// API Configuration
// Update this URL after deploying to Render
const API_CONFIG = {
    // Development
    // BASE_URL: 'http://localhost:3000',
    
    // Production - Your actual Render URL
    BASE_URL: 'https://logzeeserver.onrender.com',
    
    // API Endpoints
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

// Helper function to get full API URL
function getApiUrl(endpoint) {
    return API_CONFIG.BASE_URL + endpoint;
}