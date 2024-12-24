# Install MongoDB
choco install mongodb -y

# Install Node.js
choco install nodejs-lts --version="22.12.0"
# Verifies the right Node.js version is in the environment
node -v # should print `22`
# Verifies the right npm version is in the environment
npm -v # should print `10.9.0`

# Install Angular CLI
npm install -g @angular/cli@17

# Install ngrok
choco install ngrok -y

# Verify installations
node -v
npm -v
ng version
mongo --version

Write-Host "Installation complete!"