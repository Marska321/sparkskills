# SparkSkill Deployment Guide

This guide covers deployment options for the SparkSkill Young Entrepreneur Academy application.

## Quick Start

The project is ready for deployment on multiple platforms. Choose your preferred option:

## 🔥 Firebase Hosting (Recommended)

### Prerequisites
- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase account

### Steps
1. Login to Firebase:
   ```bash
   firebase login
   ```

2. Create a new Firebase project at https://console.firebase.google.com

3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   - Select "Hosting" and "Functions"
   - Choose your Firebase project
   - Use `dist/public` as public directory
   - Configure as single-page app: Yes
   - Set up automatic builds: No

4. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

### Firebase Configuration Files
- `firebase.json` - Firebase hosting and functions configuration
- `.firebaserc` - Project configuration

## 🐙 GitHub Pages

### Steps
1. Push your code to a GitHub repository

2. Go to repository Settings > Pages

3. Set source to "Deploy from a branch"

4. Select `gh-pages` branch

5. Build and push to gh-pages:
   ```bash
   npm run build
   git checkout -b gh-pages
   git add dist/public/*
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

## ⚡ Vercel

### Steps
1. Install Vercel CLI: `npm install -g vercel`

2. Login: `vercel login`

3. Deploy: `vercel --prod`

Configuration file: `vercel.json`

## 🎯 Netlify

### Steps
1. Connect your GitHub repository to Netlify

2. Set build command: `npm run build`

3. Set publish directory: `dist/public`

Configuration file: `netlify.toml`

## 🌐 Manual Deployment

### Build the project
```bash
npm run build
```

This creates:
- `dist/public/` - Frontend static files
- `dist/index.js` - Backend server bundle

### Deploy Frontend
Upload contents of `dist/public/` to any static hosting service.

### Deploy Backend
Deploy `dist/index.js` to any Node.js hosting service with these environment variables:
- `NODE_ENV=production`
- `PORT=5000` (or your preferred port)

## Environment Variables

For production deployments, you may need:
- `NODE_ENV=production`
- `PORT` - Server port (default: 5000)
- Database credentials if using external database

## Production Checklist

- [ ] Build completes without errors
- [ ] All 12 lessons load correctly
- [ ] Badge system functions properly
- [ ] Interactive activities work
- [ ] Progress tracking saves data
- [ ] Responsive design works on mobile
- [ ] API endpoints respond correctly

## Troubleshooting

### Build Issues
- Ensure all dependencies are installed: `npm install`
- Check TypeScript compilation: `npm run check`
- Clear node_modules and reinstall if needed

### Runtime Issues
- Check server logs for errors
- Verify API endpoints are accessible
- Ensure static files are served correctly

### Performance
- Frontend is optimized with Vite
- Backend uses efficient in-memory storage
- Assets are minified and compressed

## Monitoring

After deployment, monitor:
- Page load times
- API response times
- User engagement with lessons
- Badge completion rates
- Error logs

## Support

For deployment issues:
1. Check the console logs
2. Verify all files are uploaded correctly
3. Test API endpoints manually
4. Check network connectivity