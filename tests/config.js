// Test Configuration
const config = {
    // Base URL for the API
    baseUrl: 'http://localhost:3030',

    // Test user credentials
    testUser: {
        username: 'testuser',
        password: 'testpassword123',
        email: 'test@example.com',
        name: 'Test',
        lastname: 'User'
    },

    // Test timeouts
    timeout: 10000,

    // Headers for requests
    defaultHeaders: {
        'User-Agent': 'test-session',
        'Content-Type': 'application/json'
    }
};

module.exports = config;
