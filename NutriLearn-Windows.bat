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

set APP_DIR=%~dp0
set PORT=8080

:: Check if python is available to run local HTTP server for full PWA capabilities
where python >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [OK] Python runtime detected. Starting local background server on port %PORT%...
    start /B python -m http.server %PORT% --directory "%APP_DIR%" >nul 2>&1
    timeout /t 1 /nobreak >nul
    set TARGET_URL=http://localhost:%PORT%
) else (
    echo [INFO] Python not in PATH. Launching web app directly...
    set TARGET_URL=%APP_DIR%index.html
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
echo NutriLearn is now running! 
echo Keep this window open if running the local server, or press any key to close.
pause >nul
