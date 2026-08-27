<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Loan;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LoanController extends Controller
{
    /**
     * Display a listing of loans.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Loan::with(['book', 'user']);

        // Non-admin users only see their own loans
        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        } elseif ($request->filled('user_id')) {
            $query->where('user_id', $request->query('user_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('book_id')) {
            $query->where('book_id', $request->query('book_id'));
        }

        // Auto-update late loans
        $today = Carbon::today()->format('Y-m-d');
        Loan::where('status', 'ativo')
            ->where('due_date', '<', $today)
            ->update(['status' => 'atrasado']);

        $loans = $query->orderBy('created_at', 'desc')->paginate($request->query('per_page', 15));

        return response()->json($loans);
    }

    /**
     * Store a newly created loan.
     */
    public function store(Request $request): JsonResponse
    {
        $currentUser = $request->user();

        $validated = $request->validate([
            'book_id' => ['required', 'exists:books,id'],
            'user_id' => ['nullable', 'exists:users,id'],
            'loan_date' => ['nullable', 'date'],
            'due_date' => ['nullable', 'date', 'after_or_equal:loan_date'],
            'notes' => ['nullable', 'string'],
        ]);

        // If not admin, the borrower is always the current user
        $targetUserId = ($currentUser->role === 'admin' && !empty($validated['user_id']))
            ? $validated['user_id']
            : $currentUser->id;

        return DB::transaction(function () use ($validated, $targetUserId) {
            $book = Book::lockForUpdate()->findOrFail($validated['book_id']);

            if ($book->available_copies <= 0) {
                return response()->json([
                    'message' => 'N?o h? exemplares dispon?veis deste livro no momento.',
                ], 422);
            }

            $loanDate = !empty($validated['loan_date']) ? Carbon::parse($validated['loan_date']) : Carbon::today();
            $dueDate = !empty($validated['due_date']) ? Carbon::parse($validated['due_date']) : $loanDate->copy()->addDays(14);

            $loan = Loan::create([
                'user_id' => $targetUserId,
                'book_id' => $book->id,
                'loan_date' => $loanDate->format('Y-m-d'),
                'due_date' => $dueDate->format('Y-m-d'),
                'status' => 'ativo',
                'notes' => $validated['notes'] ?? null,
            ]);

            // Decrement available copies
            $book->decrement('available_copies');

            $loan->load(['book', 'user']);

            return response()->json([
                'message' => 'Empr?stimo realizado com sucesso',
                'loan' => $loan,
            ], 201);
        });
    }

    /**
     * Display the specified loan.
     */
    public function show(Request $request, Loan $loan): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'admin' && $loan->user_id !== $user->id) {
            return response()->json(['message' => 'Acesso n?o autorizado a este empr?stimo'], 403);
        }

        $loan->load(['book', 'user']);

        return response()->json($loan);
    }

    /**
     * Mark loan as returned.
     */
    public function returnBook(Request $request, Loan $loan): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'admin' && $loan->user_id !== $user->id) {
            return response()->json(['message' => 'Acesso n?o autorizado'], 403);
        }

        if ($loan->status === 'devolvido') {
            return response()->json(['message' => 'Este empr?stimo j? foi devolvido anteriormente.'], 400);
        }

        return DB::transaction(function () use ($loan) {
            $loan->update([
                'return_date' => Carbon::today()->format('Y-m-d'),
                'status' => 'devolvido',
            ]);

            $loan->book->increment('available_copies');

            $loan->load(['book', 'user']);

            return response()->json([
                'message' => 'Livro devolvido com sucesso',
                'loan' => $loan,
            ]);
        });
    }

    /**
     * Renew loan due date by +7 days.
     */
    public function renew(Request $request, Loan $loan): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'admin' && $loan->user_id !== $user->id) {
            return response()->json(['message' => 'Acesso n?o autorizado'], 403);
        }

        if ($loan->status === 'devolvido') {
            return response()->json(['message' => 'N?o ? poss?vel renovar um empr?stimo j? devolvido.'], 400);
        }

        $currentDueDate = Carbon::parse($loan->due_date);
        $newDueDate = $currentDueDate->addDays(7);

        $loan->update([
            'due_date' => $newDueDate->format('Y-m-d'),
            'status' => $newDueDate->isPast() ? 'atrasado' : 'ativo',
        ]);

        $loan->load(['book', 'user']);

        return response()->json([
            'message' => 'Empr?stimo renovado com sucesso por mais 7 dias',
            'loan' => $loan,
        ]);
    }

    /**
     * Delete loan record (Admin only).
     */
    public function destroy(Request $request, Loan $loan): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Apenas administradores podem excluir registros de empr?stimos'], 403);
        }

        // If deleting an active loan, restore available copies
        if ($loan->status !== 'devolvido') {
            $loan->book->increment('available_copies');
        }

        $loan->delete();

        return response()->json([
            'message' => 'Registro de empr?stimo removido com sucesso',
        ]);
    }
}