const axios = require('axios');
const config = require('../config');

class TestUserManager {
    constructor() {
        this.testUser = {
            username: `testuser_${Date.now()}`, // Unique username
            password: 'testpassword123',
            confirmPassword: 'testpassword123'
        };
    }

    async createTestUser() {
        console.log('🔧 Creating test user via API...');

        try {
            const response = await axios.post(`${config.baseUrl}/user`, this.testUser, {
                headers: config.defaultHeaders
            });

            if (response.status === 200 || response.status === 201) {
                console.log('✅ Test user created successfully');
                console.log(`   Username: ${this.testUser.username}`);
                return true;
            } else {
                throw new Error(`Unexpected status code: ${response.status}`);
            }
        } catch (error) {
            console.error('❌ Failed to create test user:', error.response?.data || error.message);
            return false;
        }
    }

    async deleteTestUser() {
        if (!this.testUser.username) {
            console.log('ℹ️  No test user to delete');
            return true;
        }

        console.log('🧹 Deleting test user from database...');

        try {
            const { exec } = require('child_process');
            return new Promise((resolve) => {
                const fs = require('fs');
                const path = require('path');

                // Create temporary SQL file
                const tempDir = '/tmp';
                const tempFile = path.join(tempDir, `cleanup_${Date.now()}.sql`);

                const sqlContent = `DELETE FROM token WHERE "userId" IN (SELECT id FROM "user" WHERE username = '${this.testUser.username}');
DELETE FROM "user" WHERE username = '${this.testUser.username}';`;

                try {
                    fs.writeFileSync(tempFile, sqlContent);

                    // Copy file to container and execute
                    exec(`docker cp ${tempFile} tour-db-1:/tmp/cleanup.sql && docker exec -i tour-db-1 psql -U postgres -d tour -f /tmp/cleanup.sql`, (err, stdout, stderr) => {
                        // Clean up temp file
                        try {
                            fs.unlinkSync(tempFile);
                        } catch (cleanupErr) {
                            // Ignore cleanup errors
                        }

                        if (err) {
                            console.error('❌ Database cleanup failed:', err.message);
                            resolve(false);
                        } else {
                            console.log('✅ Test user cleaned up from database');
                            console.log(`   Deleted user: ${this.testUser.username}`);
                            resolve(true);
                        }
                    });
                } catch (writeErr) {
                    console.error('❌ Failed to create temp SQL file:', writeErr.message);
                    resolve(false);
                }
            });
        } catch (error) {
            console.error('❌ Failed to delete test user:', error.message);
            return false;
        }
    }

    async login() {
        console.log('🔐 Logging in test user...');

        try {
            const response = await axios.post(`${config.baseUrl}/login`, {
                username: this.testUser.username,
                password: this.testUser.password
            }, {
                headers: config.defaultHeaders
            });

            if (response.data.data.success) {
                console.log('✅ Login successful');
                return {
                    accessToken: response.data.data.accessToken,
                    refreshToken: response.data.data.refreshToken
                };
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error('❌ Login failed:', error.response?.data || error.message);
            return null;
        }
    }

    async logout(accessToken) {
        console.log('🚪 Logging out test user...');

        try {
            const response = await axios.post(`${config.baseUrl}/logout`, {}, {
                headers: {
                    ...config.defaultHeaders,
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            console.log('✅ Logout successful');
            return true;
        } catch (error) {
            console.error('❌ Logout failed:', error.response?.data || error.message);
            return false;
        }
    }
}

module.exports = TestUserManager;
