@echo off
cd /d "%~dp0"
echo.
echo  ==========================================
echo   Mini Split Depot - Local Server
echo  ==========================================
echo.

where node >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo  Starting at http://localhost:8080
    echo  Press Ctrl+C to stop.
    echo.
    start "" "http://localhost:8080"
    npx serve . -p 8080 -s
    goto :end
)

where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo  Starting at http://localhost:8080
    echo  Press Ctrl+C to stop.
    echo.
    start "" "http://localhost:8080"
    python -m http.server 8080
    goto :end
)

echo  ERROR: Node.js or Python required to run the local server.
echo.
echo  Quick install (pick one):
echo    Node.js:  https://nodejs.org  (recommended)
echo    Python:   https://python.org/downloads
echo.
echo  After installing, close this window and double-click start.bat again.
echo.
pause
:end
