# ⚡ QUICK START - Local Development

## 🚀 Get Running in 5 Minutes

### 1. Install Prerequisites (2 minutes)
```bash
# Install Node.js 18+ from nodejs.org
# Install pnpm globally
npm install -g pnpm

# Verify installation
node --version  # Should be 18+
pnpm --version  # Should be 8+
```

### 2. Setup MongoDB (1 minute)

**Option A: Quick Local Setup (macOS/Linux)**
```bash
# macOS
brew tap mongodb/brew && brew install mongodb-community
brew services start mongodb-community

# Linux (Ubuntu/Debian)
sudo apt install mongodb
sudo systemctl start mongodb
```

**Option B: MongoDB Atlas (Cloud - Recommended)**
- Go to [MongoDB Atlas](https://cloud.mongodb.com)
- Create free account + M0 cluster
- Create user, get connection string

### 3. Project Setup (2 minutes)
```bash
# Clone/navigate to project
cd chat-room

# Install dependencies
pnpm install

# Build shared packages
pnpm run build:shared

# Create environment files
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
```

### 4. Configure Environment
Edit `apps/server/.env`:
```env
# Generate JWT secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Replace JWT_SECRET with the output

# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/chatroom

# For MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatroom
```

### 5. Start Development Servers
```bash
# Start everything (backend + frontend)
pnpm dev

# OR start separately:
# Terminal 1: pnpm --filter @chat-room/server dev
# Terminal 2: pnpm --filter @chat-room/web dev
```

### 6. Test Application
1. **Frontend**: Open http://localhost:3000
2. **Backend Health**: http://localhost:3001/health
3. **Register**: Create test account at http://localhost:3000/register
4. **Login**: Test login at http://localhost:3000/login

## ✅ Success Indicators

You should see:
- ✅ Frontend loads at localhost:3000
- ✅ Backend health check returns JSON
- ✅ Database connection successful in terminal
- ✅ No errors in browser console
- ✅ User registration/login works

## 🐛 Quick Troubleshooting

**MongoDB Connection Failed?**
```bash
# Check if MongoDB is running
mongosh  # Should connect successfully
# If not, restart MongoDB service
```

**Port Already in Use?**
```bash
# Kill processes on ports 3000/3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

**Module Not Found?**
```bash
# Reinstall and rebuild
rm -rf node_modules
pnpm install
pnpm run build:shared
```

## 📚 Next Steps

- See `LOCAL_DEVELOPMENT.md` for comprehensive setup
- See `DEPLOYMENT_INSTRUCTIONS.md` for production deployment
- Check `docs/` folder for architecture and API docs

🎉 **You're ready to develop!**
