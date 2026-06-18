@echo off
setlocal
cd /d "%~dp0src"

rem --- find Python (python -> py -> python3) ---
set "PY="
where python  >nul 2>nul && set "PY=python"
if not defined PY ( where py      >nul 2>nul && set "PY=py" )
if not defined PY ( where python3 >nul 2>nul && set "PY=python3" )

if not defined PY (
  echo.
  echo [ERROR] Python was not found on this PC.
  echo Install Python from https://www.python.org/downloads/
  echo and tick "Add python.exe to PATH" during setup,
  echo then double-click this file again.
  echo.
  pause
  exit /b 1
)

echo ============================================================
echo   Yokai Zukan - local server
echo ------------------------------------------------------------
echo   Top   : http://localhost:8000/index.html
echo   Map   : http://localhost:8000/map.html
echo   Kyoto : http://localhost:8000/kyoto.html
echo ------------------------------------------------------------
echo   To stop: close the server window or press Ctrl + C
echo ============================================================
echo.

rem --- start the server in a separate window ---
start "yokai-server" %PY% -m http.server 8000

rem --- wait a moment, then open index.html in the browser ---
timeout /t 2 >nul
start "" http://localhost:8000/index.html

echo Server is running in the "yokai-server" window.
echo You can close THIS window.
echo.
pause
