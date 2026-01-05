@echo off
REM Amazon Email Validator - API Test Scripts
REM Gunakan untuk testing endpoints

setlocal enabledelayedexpansion
set HOST=http://localhost:3000

echo.
echo ========================================
echo Amazon Email Validator - API Tests
echo ========================================
echo.

:menu
echo Pilih test yang ingin dijalankan:
echo 1. Health Check
echo 2. Validate Single Email
echo 3. Validate Batch Emails
echo 4. Get Statistics
echo 5. Get Logs
echo 6. Clear Cache
echo 7. Exit
echo.
set /p choice="Masukkan pilihan (1-7): "

if "%choice%"=="1" goto health_check
if "%choice%"=="2" goto single_validate
if "%choice%"=="3" goto batch_validate
if "%choice%"=="4" goto stats
if "%choice%"=="5" goto logs
if "%choice%"=="6" goto cache_clear
if "%choice%"=="7" goto exit_app

echo Pilihan tidak valid!
echo.
goto menu

:health_check
echo.
echo [TEST 1] Health Check
echo URL: %HOST%/health
echo.
curl -X GET "%HOST%/health" -H "Content-Type: application/json"
echo.
pause
goto menu

:single_validate
echo.
echo [TEST 2] Validate Single Email
set /p email="Masukkan email yang ingin dicek: "
echo URL: %HOST%/api/validate
echo Body: {"email": "%email%"}
echo.
curl -X POST "%HOST%/api/validate" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"%email%\"}"
echo.
pause
goto menu

:batch_validate
echo.
echo [TEST 3] Validate Batch Emails
echo URL: %HOST%/api/validate-batch
echo Body: {"emails": ["user1@gmail.com", "user2@yahoo.com"], "delayMs": 1000}
echo.
curl -X POST "%HOST%/api/validate-batch" ^
  -H "Content-Type: application/json" ^
  -d "{\"emails\": [\"user1@gmail.com\", \"user2@yahoo.com\", \"user3@hotmail.com\"], \"delayMs\": 1000, \"stopOnError\": false}"
echo.
pause
goto menu

:stats
echo.
echo [TEST 4] Get Statistics
echo URL: %HOST%/api/stats
echo.
curl -X GET "%HOST%/api/stats" -H "Content-Type: application/json"
echo.
pause
goto menu

:logs
echo.
echo [TEST 5] Get Logs
echo URL: %HOST%/api/logs
echo.
set /p level="Filter by level (info/warn/error/debug, atau tekan Enter untuk semua): "
if not "!level!"=="" (
  curl -X GET "%HOST%/api/logs?level=!level!" -H "Content-Type: application/json"
) else (
  curl -X GET "%HOST%/api/logs" -H "Content-Type: application/json"
)
echo.
pause
goto menu

:cache_clear
echo.
echo [TEST 6] Clear Cache
set /p clear_email="Masukkan email untuk clear (atau tekan Enter untuk clear semua): "
echo URL: %HOST%/api/cache/clear
if not "!clear_email!"=="" (
  echo Body: {"email": "!clear_email!"}
  curl -X POST "%HOST%/api/cache/clear" ^
    -H "Content-Type: application/json" ^
    -d "{\"email\": \"!clear_email!\"}"
) else (
  echo Body: {}
  curl -X POST "%HOST%/api/cache/clear" ^
    -H "Content-Type: application/json" ^
    -d "{}"
)
echo.
pause
goto menu

:exit_app
echo Goodbye!
exit /b 0
