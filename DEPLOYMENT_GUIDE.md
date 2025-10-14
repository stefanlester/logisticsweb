# FirstFortune Securities - Deployment Guide

## Render (Backend) + Hostinger (Frontend) Setup

### 🚀 **Phase 1: Deploy Backend to Render**

#### **Step 1: Prepare Repository**
1. Push your code to GitHub repository
2. Ensure `server/` folder contains:
   - `package.json` ✅
   - `server.js` ✅
   - All dependencies listed ✅

#### **Step 2: Render Deployment**
1. **Create Account**: Go to [render.com](https://render.com)
2. **Connect GitHub**: Link your repository
3. **New Web Service** with these settings:
   ```
   Name: firstfortune-api
   Region: Choose closest to your users
   Branch: main
   Root Directory: server
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Environment Variables** (Optional):
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-key-2025
   PORT=10000
   ```

5. **Deploy** - Note your app URL: `https://firstfortune-api.onrender.com`

### 🌐 **Phase 2: Prepare Frontend for Hostinger**

#### **Step 1: Update API Configuration**
Update `/assets/js/config.js` with your Render URL:

```javascript
const API_CONFIG = {
    // Replace with your actual Render URL
    BASE_URL: 'https://firstfortune-api.onrender.com',
    
    ENDPOINTS: {
        LOGIN: '/api/auth/login',
        SIGNUP: '/api/auth/signup',
        VERIFY: '/api/auth/verify',
        FORGOT_PASSWORD: '/api/auth/forgot-password',
        PROFILE: '/api/user/profile',
        SHIPMENTS: '/api/user/shipments',
        TRACK: '/api/track',
        ADMIN_USERS: '/api/admin/users'
    }
};
```

#### **Step 2: Update HTML Files**
You need to update these files to use the config:

**Files to Update:**
- `track.html` ✅ (Already updated)
- `login.html` - Update all `fetch('http://localhost:3000/api/...)` calls
- `dashboard.html` - Update all API calls

**Search & Replace Pattern:**
```javascript
// OLD:
fetch('http://localhost:3000/api/auth/login'

// NEW:
fetch(getApiUrl(API_CONFIG.ENDPOINTS.LOGIN)
```

#### **Step 3: Add Config Script to All Pages**
Add this line to all HTML files that make API calls:
```html
<script src="assets/js/config.js"></script>
```

**Pages needing config.js:**
- `track.html` ✅ (Already added)
- `login.html`
- `dashboard.html`

### 📁 **Phase 3: Deploy Frontend to Hostinger**

#### **Step 1: Prepare Files**
Upload entire `/mannatstudio.com/html/logzee/v3/` folder to Hostinger:
```
public_html/
├── index.html
├── assets/
│   ├── css/
│   ├── js/
│   │   └── config.js (updated)
│   └── images/
├── track.html
├── login.html
├── dashboard.html
└── [all other HTML files]
```

#### **Step 2: Hostinger Setup**
1. **File Manager**: Upload via File Manager or FTP
2. **Domain Setup**: Point your domain to the uploaded files
3. **SSL Certificate**: Enable SSL in Hostinger control panel

### 🔧 **Phase 4: Testing & Verification**

#### **Backend Testing (Render):**
```bash
# Test API endpoints
curl https://firstfortune-api.onrender.com/api/track/FF123456789
```

#### **Frontend Testing (Hostinger):**
1. Visit your domain
2. Test tracking functionality
3. Test login/signup
4. Check browser console for errors

### ⚙️ **Configuration Summary**

**Render Backend:**
- URL: `https://[your-app-name].onrender.com`
- Automatic deployments from GitHub
- Built-in SSL
- Environment variables for secrets

**Hostinger Frontend:**
- Static file hosting
- Custom domain support
- SSL certificate
- Fast global CDN

### 📝 **Post-Deployment Tasks**

1. **Update config.js** with actual Render URL
2. **Test all functionality** (tracking, login, dashboard)
3. **Monitor performance** on both platforms
4. **Set up monitoring** for API endpoints

### 🚨 **Important Notes**

- **CORS**: Already configured in server.js ✅
- **API Rate Limits**: Consider implementing for production
- **Database**: Currently in-memory, consider upgrading to PostgreSQL on Render
- **File Storage**: Consider AWS S3 for uploaded files

### 💡 **Scaling Options**

**Free Tier Limits:**
- **Render**: Spins down after 15 min inactivity
- **Hostinger**: Bandwidth limits vary by plan

**Upgrade Options:**
- **Render**: Paid plans for always-on services
- **Hostinger**: Higher tier plans for more resources

This setup gives you professional hosting with proper separation of concerns and good performance!