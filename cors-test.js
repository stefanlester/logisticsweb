// Quick CORS test script - run in browser console on sovereignfortunesecurities.com
// This will test if CORS is working properly

async function testCORS() {
    console.log('🧪 Testing CORS with your domain...');
    
    try {
        const response = await fetch('https://logzeeserver.onrender.com/api/health', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ CORS Test Success!');
        console.log('📡 Status:', response.status);
        
        const data = await response.json();
        console.log('📋 Data:', data);
        
        return true;
    } catch (error) {
        console.error('❌ CORS Test Failed:', error);
        return false;
    }
}

// Run the test
testCORS();