@echo off
title NutriLearn - Child Health & Nutrition App
color 0A

echo ===================================================================
echo                     NUTRILEARN PLATFORM
echo     E-Learning & Malnutrition Monitoring (10%% Stunting Target)
echo ===================================================================
echo.
echo Starting NutriLearn Application for Windows...
echo.

:: Ensure working directory is the NutriLearn project folder
cd /d "%~dp0"
set PORT=8085

:: Free up port 8085 if any stale server is lingering
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%PORT% "') do (
    taskkill /F /PID %%a >nul 2>&1
)

:: Check if python is available to run local HTTP server for full PWA and .env capabilities
where python >nul 2>&1
if %ERRORLEVEL% equ 0 (
    python -c "import uvicorn" >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo [OK] FastAPI Backend runtime ready. Launching full backend on port %PORT%...
        start /B python -m uvicorn main:app --port %PORT% >nul 2>&1
    ) else (
        echo [OK] Python runtime detected. Starting local server on port %PORT%...
        start /B python -m http.server %PORT% >nul 2>&1
    )
    timeout /t 1 /nobreak >nul
    set TARGET_URL=http://localhost:%PORT%/index.html
) else (
    echo [INFO] Python not in PATH. Launching web app directly...
    set TARGET_URL=index.html
)

:: Try to launch with Microsoft Edge in app standalone mode
where msedge >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [OK] Launching in dedicated Windows App window...
    start msedge --app="%TARGET_URL%" --window-size=1280,840
    goto :done
)

:: Try to launch with Google Chrome in app standalone mode
where chrome >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [OK] Launching in Chrome App window...
    start chrome --app="%TARGET_URL%" --window-size=1280,840
    goto :done
)

:: Fallback to default browser
echo [OK] Launching in default browser...
start "" "%TARGET_URL%"

:done
echo.
echo NutriLearn is now running at %TARGET_URL%! 
echo Keep this window open while using the app, or press any key to close.
pause >nul
