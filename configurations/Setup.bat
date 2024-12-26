@echo off

:: Install MongoDB
pause 
choco install mongodb
if %errorlevel% neq 0 (
    echo "Error installing MongoDB"
    pause
    exit /b %errorlevel%
)

:: Install Node.js
pause 
choco install nodejs
if %errorlevel% neq 0 (
    echo "Error installing Node.js"
    pause
    exit /b %errorlevel%
)

:: Install Angular CLI
pause 
npm install -g @angular/cli@17
if %errorlevel% neq 0 (
    echo "Error installing Angular CLI"
    pause
    exit /b %errorlevel%
)


:: Install ngrok
pause 
choco install ngrok

:: Verify installations
pause 
node -v
pause 
npm -v
pause 
ng version
pause 
mongo --version

:: Keep the terminal open
pause
echo "Script completed successfully. Press any key to exit."
pause
