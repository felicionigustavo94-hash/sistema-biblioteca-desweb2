@echo off
title Sistema de Biblioteca
echo ========================================================
echo   INICIANDO O SISTEMA DE BIBLIOTECA (DESWEB2)
echo ========================================================
echo.

:: Inicia o Backend Laravel em uma janela
start "1. Backend Laravel (API)" cmd /k "cd backend && php artisan serve"

:: Inicia o Frontend React em outra janela
start "2. Frontend React (Interface)" cmd /k "cd frontend && npm run dev"

echo.
echo Servidores iniciados com sucesso!
echo.
echo Acesse no seu navegador: http://localhost:5173
echo.
echo (Para desligar o sistema, basta fechar as duas janelas pretas que abriram)
echo ========================================================
pause