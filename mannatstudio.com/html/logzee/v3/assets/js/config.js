// API Configuration
// Same-origin: API and frontend are served from the same Render Web Service,
// so requests go to /api/... on whatever host is serving the page.
const API_CONFIG = {
    BASE_URL: '',

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