@echo off

REM Navigate to the Angular project directory
cd /d "C:\Users\tmart\Desktop\Dissertacao\SatoreApp\angular\dist\tour-of-heroes"

REM Start the Angular application in a new command prompt window
start cmd /k "http-server"

REM Navigate to the Express server directory
cd /d "C:\Users\tmart\Desktop\Dissertacao\SatoreApp\express"

REM Start the Express server in a new command prompt window
start cmd /k "npm start"

REM Pause the terminal after execution
pause