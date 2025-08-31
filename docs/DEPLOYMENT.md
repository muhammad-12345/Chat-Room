# Deployment Guide

## 🚀 Quick Deployment Setup

### Frontend Deployment (Vercel)

1. **Connect Repository**:
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Select the `apps/web` directory as the project root

2. **Environment Variables**:
   Set these in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   VITE_WS_URL=https://your-backend-url.railway.app
   VITE_STUN_SERVERS=stun:stun.l.google.com:19302,stun:stun1.l.google.com:19302
   ```

3. **Build Settings**:
   - Framework Preset: `Vite`
   - Build Command: `cd apps/web && npm run build`
   - Output Directory: `apps/web/dist`
   - Install Command: `npm install`

### Backend Deployment (Railway)

1. **Connect Repository**:
   - Go to [Railway](https://railway.app)
   - Create new project from GitHub repo
   - Select this repository

2. **Environment Variables**:
   Set these in Railway dashboard:
   ```
   NODE_ENV=production
   PORT=3001
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatroom
   JWT_SECRET=your_secure_jwt_secret_32_chars_minimum
   CORS_ORIGIN=https://your-frontend.vercel.app
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

3. **Build Settings**:
   - Build Command: `cd apps/server && npm install && npm run build`
   - Start Command: `cd apps/server && npm start`
   - Health Check Path: `/health`

### Database Setup (MongoDB Atlas)

1. **Create Cluster**:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create free M0 cluster
   - Create database user
   - Add IP addresses to network access (0.0.0.0/0 for all)

2. **Get Connection String**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/chatroom
   ```

## 🔧 Environment Variables Reference

### Required Backend Variables
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatroom
JWT_SECRET=generate_with_crypto_randomBytes_32_toString_hex
CORS_ORIGIN=https://your-frontend-domain.vercel.app
FRONTEND_URL=https://your-frontend-domain.vercel.app
NODE_ENV=production
PORT=3001
```

### Required Frontend Variables
```env
VITE_API_URL=https://your-backend-domain.railway.app/api
VITE_WS_URL=https://your-backend-domain.railway.app
```

### Optional Variables
```env
# Backend
REDIS_URL=redis://username:password@hostname:port
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info

# Frontend
VITE_STUN_SERVERS=stun:stun.l.google.com:19302,stun:stun1.l.google.com:19302
VITE_APP_NAME=Chat Room
```

## 🔐 Security Setup

### JWT Secret Generation
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### CORS Configuration
- Set `CORS_ORIGIN` to your exact frontend domain
- Include protocol (https://)
- No trailing slash

### Database Security
- Use MongoDB Atlas with authentication
- Restrict network access if possible
- Use strong database passwords

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] MongoDB Atlas cluster created
- [ ] Environment variables prepared
- [ ] JWT secret generated
- [ ] CORS origins configured

### Frontend (Vercel)
- [ ] Repository connected
- [ ] Environment variables set
- [ ] Build settings configured
- [ ] Custom domain (optional)

### Backend (Railway)
- [ ] Repository connected
- [ ] Environment variables set
- [ ] Health check configured
- [ ] Custom domain (optional)

### Post-Deployment
- [ ] Test user registration
- [ ] Test room creation
- [ ] Test real-time features
- [ ] Monitor logs for errors

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Check `CORS_ORIGIN` matches frontend URL exactly
   - Include protocol (https://)
   - No trailing slash

2. **Database Connection Failed**:
   - Verify MongoDB connection string
   - Check network access settings
   - Ensure database user has correct permissions

3. **Socket Connection Failed**:
   - Verify `VITE_WS_URL` matches backend URL
   - Check Railway deployment logs
   - Ensure WebSocket support is enabled

4. **Authentication Issues**:
   - Verify JWT secret is set
   - Check token expiration settings
   - Monitor browser network tab

### Monitoring

1. **Railway Logs**:
   ```bash
   railway logs
   ```

2. **Vercel Function Logs**:
   - Check Vercel dashboard
   - Monitor real-time logs

3. **Database Monitoring**:
   - MongoDB Atlas metrics
   - Connection pool status

## 🔄 CI/CD Pipeline

The repository includes GitHub Actions that will:
- Run tests on pull requests
- Type check all code
- Run linting and formatting checks
- Build the application
- Run security audits

### Automatic Deployment
Both Vercel and Railway support automatic deployment:
- Deploys on push to `main` branch
- Preview deployments for pull requests
- Rollback capabilities

## 📊 Performance Optimization

### Frontend
- Code splitting enabled
- Bundle analysis available
- Image optimization
- Progressive Web App features

### Backend
- Connection pooling configured
- Rate limiting implemented
- Compression enabled
- Health checks setup

## 🔍 Monitoring & Alerts

### Recommended Services
- **Uptime Monitoring**: UptimeRobot
- **Error Tracking**: Sentry
- **Performance**: Vercel Analytics
- **Database**: MongoDB Atlas monitoring

### Health Checks
- Backend: `GET /health`
- WebSocket: Connection status
- Database: Connection pool status
