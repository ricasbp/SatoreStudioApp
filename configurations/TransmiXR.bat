@echo off

:: Minimize the window if not already minimized
if not "%Minimized%"=="" goto :Minimized
set Minimized=True
start /min cmd /C "%~dpnx0"
goto :EOF

:Minimized

REM Navigate to the Angular project directory
cd /d "%USERPROFILE%\Desktop\SatoreStudioApp-main\angular"

REM Start the Angular application in a minimized command prompt window with a custom title
start /min cmd /k "title Angular Front-End & npm install & ng serve"

REM Navigate to the Express server directory
cd /d "%USERPROFILE%\Desktop\SatoreStudioApp-main\express"

REM Start the Express server in a minimized command prompt window with a custom title
start /min cmd /k "title Express Back-End & npm install & npm start"

REM Navigate to the Angular project directory
cd /d "%USERPROFILE%\Desktop\SatoreStudioApp-main"

REM Run ngrok without minimizing the terminal and with a custom title
start cmd /k "title Ngrok & ngrok start --all"
