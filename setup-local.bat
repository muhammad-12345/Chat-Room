@echo off
REM Local Development Setup Script for Chat Room Application (Windows)
echo 🚀 Setting up Chat Room for local development...

REM Check prerequisites
echo 📋 Checking prerequisites...

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=1 delims=." %%i in ('node --version') do set NODE_MAJOR=%%i
set NODE_MAJOR=%NODE_MAJOR:v=%
if %NODE_MAJOR% LSS 18 (
    echo ❌ Node.js version %NODE_MAJOR% found. Please install Node.js 18 or higher.
    pause
    exit /b 1
)
echo ✅ Node.js found
node --version

REM Check pnpm
where pnpm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ pnpm not found. Installing pnpm...
    npm install -g pnpm
)
echo ✅ pnpm found
pnpm --version

REM Install dependencies
echo 📦 Installing dependencies...
pnpm install

REM Build shared packages
echo 🏗️ Building shared packages...
pnpm run build:shared

REM Create environment files
echo 🔧 Creating environment files...

REM Backend environment file
(
echo # Backend Environment Configuration for Local Development
echo.
echo # Database Configuration ^(REQUIRED^)
echo MONGODB_URI=mongodb://localhost:27017/chatroom
echo # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/chatroom
echo.
echo # Authentication ^(REQUIRED - Generate with: node -e "console.log(require('crypto'^).randomBytes(32^).toString('hex'^)^)"^)
echo JWT_SECRET=your_development_jwt_secret_at_least_32_characters_long_example_key
echo JWT_EXPIRES_IN=7d
echo BCRYPT_ROUNDS=12
echo.
echo # Server Configuration
echo PORT=3001
echo NODE_ENV=development
echo CORS_ORIGIN=http://localhost:3000
echo.
echo # Rate Limiting ^(Relaxed for development^)
echo RATE_LIMIT_WINDOW_MS=900000
echo RATE_LIMIT_MAX_REQUESTS=1000
echo.
echo # Frontend URL
echo FRONTEND_URL=http://localhost:3000
echo.
echo # Logging
echo LOG_LEVEL=debug
echo.
echo # WebRTC Configuration ^(Optional^)
echo STUN_SERVERS=stun:stun.l.google.com:19302,stun:stun1.l.google.com:19302
echo.
echo # Optional: Redis for caching ^(leave empty for development^)
echo # REDIS_URL=redis://localhost:6379
) > apps\server\.env

REM Frontend environment file
(
echo # Frontend Environment Configuration for Local Development
echo.
echo # Backend API Configuration ^(REQUIRED^)
echo VITE_API_URL=http://localhost:3001/api
echo VITE_WS_URL=http://localhost:3001
echo.
echo # WebRTC Configuration
echo VITE_STUN_SERVERS=stun:stun.l.google.com:19302,stun:stun1.l.google.com:19302
echo.
echo # App Configuration
echo VITE_APP_NAME=Chat Room ^(Local^)
echo VITE_APP_VERSION=1.0.0-dev
echo.
echo # Environment
echo VITE_NODE_ENV=development
) > apps\web\.env

REM Generate JWT secret
echo 🔐 Generating secure JWT secret...
for /f %%i in ('node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"') do set JWT_SECRET=%%i

REM Replace JWT_SECRET in backend .env file
powershell -Command "(Get-Content 'apps\server\.env') -replace 'JWT_SECRET=your_development_jwt_secret_at_least_32_characters_long_example_key', 'JWT_SECRET=%JWT_SECRET%' | Set-Content 'apps\server\.env'"

echo ✅ Environment files created successfully!

REM Check MongoDB
echo 🗄️ Checking MongoDB...
where mongosh >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    mongosh --eval "db.runCommand('ping')" --quiet >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo ✅ MongoDB is running and accessible
    ) else (
        echo ⚠️  MongoDB is installed but not running
        echo    Start it with: net start MongoDB ^(if installed as service^)
    )
) else (
    where mongo >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        mongo --eval "db.runCommand('ping')" --quiet >nul 2>nul
        if %ERRORLEVEL% EQU 0 (
            echo ✅ MongoDB is running and accessible
        ) else (
            echo ⚠️  MongoDB is installed but not running
        )
    ) else (
        echo ⚠️  MongoDB not found locally
        echo    Download from: https://www.mongodb.com/try/download/community
        echo    Or use MongoDB Atlas cloud database
    )
)

echo.
echo 🎉 Setup complete! Next steps:
echo.
echo 1. Ensure MongoDB is running:
echo    Local: net start MongoDB ^(Windows service^)
echo    Or: Download and install from MongoDB website
echo    Or: Use MongoDB Atlas cloud database
echo.
echo 2. Start development servers:
echo    pnpm dev
echo.
echo 3. Open your browser:
echo    Frontend: http://localhost:3000
echo    Backend Health: http://localhost:3001/health
echo.
echo 4. Test the application:
echo    - Register a new user
echo    - Login with your credentials
echo    - Create a test room
echo.
echo For detailed instructions, see LOCAL_DEVELOPMENT.md
echo.
pause
