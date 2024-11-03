@echo off

:: Minimize the window if not already minimized
if not "%Minimized%"=="" goto :Minimized
set Minimized=True
start /min cmd /C "%~dpnx0"
goto :EOF

:Minimized

REM Navigate to the Angular project directory
cd /d "C:\Users\tmart\Desktop\SatoreApp\angular"

REM Start the Angular application in a minimized command prompt window with a custom title
start /min cmd /k "title Angular Front-End & ng serve"

REM Navigate to the Express server directory
cd /d "C:\Users\tmart\Desktop\SatoreApp\express"

REM Start the Express server in a minimized command prompt window with a custom title
start /min cmd /k "title Express Back-End & npm start"

REM Navigate to the Angular project directory
cd /d "C:\Users\tmart\Desktop\SatoreApp"

REM Run ngrok without minimizing the terminal and with a custom title
start cmd /k "title Ngrok & ngrok start --all"

REM Pause the terminal after execution
pause