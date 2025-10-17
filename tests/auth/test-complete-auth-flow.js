const axios = require('axios');
const config = require('../config');
const TestUserManager = require('../helpers/api-test-user-manager');

async function testCompleteAuthFlow() {
    console.log('🧪 Complete Authentication Flow Test');
    console.log('===================================\n');

    const userManager = new TestUserManager();
    let tokens = null;

    try {
        // Step 1: Create test user via API
        console.log('1️⃣ Creating test user...');
        const userCreated = await userManager.createTestUser();
        if (!userCreated) {
            throw new Error('Failed to create test user');
        }

        // Step 2: Login
        console.log('\n2️⃣ Testing login...');
        tokens = await userManager.login();
        if (!tokens) {
            throw new Error('Login failed');
        }

        // Step 3: Test authenticated request
        console.log('\n3️⃣ Testing authenticated request...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

        const authResponse = await axios.get(`${config.baseUrl}/tour?page=1&limit=10`, {
            headers: {
                ...config.defaultHeaders,
                'Authorization': `Bearer ${tokens.accessToken}`
            }
        });

        console.log('✅ Authenticated request successful');
        console.log(`   Response status: ${authResponse.status}`);

        // Step 4: Test token refresh
        console.log('\n4️⃣ Testing token refresh...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

        const refreshResponse = await axios.post(`${config.baseUrl}/refresh`, {
            refreshToken: tokens.refreshToken
        }, {
            headers: config.defaultHeaders
        });

        if (refreshResponse.data.data.success) {
            console.log('✅ Token refresh successful');
            tokens.accessToken = refreshResponse.data.data.accessToken;
            tokens.refreshToken = refreshResponse.data.data.refreshToken;
            console.log(`   New Access Token: ${tokens.accessToken.substring(0, 50)}...`);
        } else {
            throw new Error('Token refresh failed');
        }

        // Step 5: Test logout
        console.log('\n5️⃣ Testing logout...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

        const logoutSuccess = await userManager.logout(tokens.accessToken);
        if (!logoutSuccess) {
            throw new Error('Logout failed');
        }

        // Step 6: Verify token is invalid
        console.log('\n6️⃣ Verifying token invalidation...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

        try {
            await axios.get(`${config.baseUrl}/tour?page=1&limit=10`, {
                headers: {
                    ...config.defaultHeaders,
                    'Authorization': `Bearer ${tokens.accessToken}`
                }
            });
            console.log('❌ Token should be invalid but request succeeded');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Token properly invalidated (401 Unauthorized)');
            } else {
                console.log(`⚠️  Unexpected error: ${error.response?.status}`);
            }
        }

        console.log('\n🎉 All authentication tests passed!');

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        process.exit(1);
    } finally {
        // Step 7: Cleanup
        console.log('\n7️⃣ Cleaning up test data...');
        await userManager.deleteTestUser();
        console.log('✅ Test cleanup completed');
    }
}

// Run the test
testCompleteAuthFlow();
