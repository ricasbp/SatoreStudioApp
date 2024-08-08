@echo off

REM Start MongoDB Compass in a new command prompt window
start "" "C:\Users\tmart\AppData\Local\MongoDBCompass\MongoDBCompass.exe"

REM Navigate to the Angular project directory
cd /d "C:\Users\tmart\Desktop\Dissertacao\SatoreApp\angular"

REM Start the Angular application in a new command prompt window
start cmd /k "ng serve --open"

REM Navigate to the Express server directory
cd /d "C:\Users\tmart\Desktop\Dissertacao\SatoreApp\express"

REM Start the Express server in a new command prompt window
start cmd /k "npm start"

REM Pause the terminal after execution
pause
