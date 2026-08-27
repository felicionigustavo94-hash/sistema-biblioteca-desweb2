<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of users (Admin only).
     */
    public function index(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Acesso n?o autorizado'], 403);
        }

        $query = User::withCount(['loans as active_loans_count' => function ($q) {
            $q->where('status', 'ativo');
        }]);

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $users = $query->orderBy('name')->paginate($request->query('per_page', 20));

        return response()->json($users);
    }

    /**
     * Display user details.
     */
    public function show(Request $request, User $user): JsonResponse
    {
        $currentUser = $request->user();

        if ($currentUser->role !== 'admin' && $currentUser->id !== $user->id) {
            return response()->json(['message' => 'Acesso n?o autorizado'], 403);
        }

        $user->load(['loans.book']);

        return response()->json($user);
    }

    /**
     * Update user details.
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $currentUser = $request->user();

        if ($currentUser->role !== 'admin' && $currentUser->id !== $user->id) {
            return response()->json(['message' => 'Acesso n?o autorizado'], 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email,' . $user->id],
            'phone' => ['nullable', 'string', 'max:20'],
            'password' => ['nullable', 'string', 'min:6'],
            'role' => ['nullable', 'string', 'in:admin,leitor'],
        ]);

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
        ];

        if (!empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        if ($currentUser->role === 'admin' && !empty($validated['role'])) {
            $data['role'] = $validated['role'];
        }

        $user->update($data);

        return response()->json([
            'message' => 'Usu?rio atualizado com sucesso',
            'user' => $user,
        ]);
    }
}