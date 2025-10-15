// DEBUG VERSION - API Configuration for Hostinger
// This version includes console logging to help debug issues

const API_CONFIG = {
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

// Helper function to get full API URL with debugging
function getApiUrl(endpoint) {
    const fullUrl = API_CONFIG.BASE_URL + endpoint;
    console.log('🔗 API Call URL:', fullUrl);
    return fullUrl;
}

// Log configuration on load
console.log('✅ API Config loaded:', API_CONFIG);
console.log('🎯 Base URL:', API_CONFIG.BASE_URL);

// Test function to verify API connectivity
async function testApiConnection() {
    try {
        console.log('🧪 Testing API connection...');
        const response = await fetch(API_CONFIG.BASE_URL + '/api/health');
        const result = await response.json();
        console.log('✅ API Health Check:', result);
        return true;
    } catch (error) {
        console.error('❌ API Health Check Failed:', error);
        return false;
    }
}

// Test API on page load
document.addEventListener('DOMContentLoaded', function() {
    testApiConnection();
});

// Enhanced login function with detailed debugging
async function debugLogin(email, password) {
    console.log('🔐 Starting login process...');
    console.log('📧 Email:', email);
    console.log('🔑 Password length:', password.length);
    
    const loginData = {
        email: email,
        password: password,
        rememberMe: false
    };
    
    console.log('📦 Login data:', loginData);
    
    try {
        const url = getApiUrl(API_CONFIG.ENDPOINTS.LOGIN);
        console.log('🌐 Making request to:', url);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        
        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', response.headers);
        
        const result = await response.json();
        console.log('📋 Response data:', result);
        
        if (result.success) {
            console.log('✅ Login successful!');
            return result;
        } else {
            console.log('❌ Login failed:', result.message);
            return result;
        }
        
    } catch (error) {
        console.error('💥 Login error:', error);
        console.error('💥 Error type:', error.name);
        console.error('💥 Error message:', error.message);
        return { success: false, message: 'Connection error: ' + error.message };
    }
}

// Add to window for testing in console
window.debugLogin = debugLogin;
window.testApiConnection = testApiConnection;
window.API_CONFIG = API_CONFIG;