@echo off
setlocal enabledelayedexpansion

set PORT=3000
set PID=

echo Checking if port %PORT% is in use...

:: Find the PID listening on the port
for /f "tokens=5" %%a in ('netstat -aon ^| findstr /R /C:"LISTENING" ^| findstr /C:":%PORT% "') do (
    set PID=%%a
)

:: If PID is still empty, try IPv6 format just in case
if "%PID%"=="" (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr /R /C:"LISTENING" ^| findstr /C:":%PORT% "') do (
        set PID=%%a
    )
)

if not "%PID%"=="" (
    echo.
    echo ========================================================
    echo [ALERT] Port %PORT% is currently IN USE by PID: !PID!
    echo ========================================================
    echo.
    echo What would you like to do?
    echo [1] Restart (Kill current process and start dev server)
    echo [2] Kill it (Stop the process only and exit)
    echo [3] Cancel and Exit
    echo.
    set /p choice="Enter your choice (1/2/3): "

    if "!choice!"=="1" (
        echo.
        echo Killing process !PID!...
        taskkill /F /PID !PID! >nul 2>&1
        echo Starting dev server...
        echo.
        npm run dev
    ) else if "!choice!"=="2" (
        echo.
        echo Killing process !PID!...
        taskkill /F /PID !PID! >nul 2>&1
        echo Process !PID! killed. Port %PORT% is now free.
        pause
    ) else (
        echo Exiting...
        exit /b
    )
) else (
    echo.
    echo ========================================================
    echo [INFO] Port %PORT% is FREE. No server is running.
    echo ========================================================
    echo.
    set /p startChoice="Press [ENTER] to start the dev server, or type 'n' to exit: "

    if /i not "!startChoice!"=="n" (
        echo.
        echo Starting dev server...
        echo.
        npm run dev
    )
)

endlocal
