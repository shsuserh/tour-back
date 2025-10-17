# Social Authentication Tests

This directory contains comprehensive tests for the social authentication functionality.

## Test Structure

```
tests/
├── helpers/
│   └── social-auth-test-helper.js     # Helper utilities for social auth tests
├── unit/
│   ├── test-social-auth-endpoints.js   # Unit tests for API endpoints
│   └── test-social-auth-mock.js       # Mock tests for OAuth flow simulation
├── integration/
│   └── test-social-auth-integration.js # Integration tests with database
├── auth/
│   └── test-complete-social-auth-flow.js # Complete OAuth flow tests
└── run-social-auth-tests.js           # Social auth test runner
```

## Available Test Commands

### Run All Social Auth Tests
```bash
npm run test:social-auth
```

### Run Individual Test Suites
```bash
# Mock tests (no OAuth credentials needed)
npm run test:social-auth:mock

# Endpoint tests
npm run test:social-auth:endpoints

# Integration tests (requires database)
npm run test:social-auth:integration

# Complete flow tests
npm run test:social-auth:flow
```

## Test Categories

### 1. Unit Tests (`/unit/`)

#### `test-social-auth-endpoints.js`
- Tests all social authentication API endpoints
- Verifies proper HTTP status codes
- Tests authentication requirements
- Validates error handling
- Tests CORS headers
- Checks rate limiting behavior

#### `test-social-auth-mock.js`
- Simulates OAuth flow without real providers
- Tests profile data structures
- Validates mock authentication flow
- Tests error scenarios
- Useful for development without OAuth credentials

### 2. Integration Tests (`/integration/`)

#### `test-social-auth-integration.js`
- Tests complete authentication flow with database
- Creates and manages test users
- Tests token generation and validation
- Tests social account linking/unlinking
- Verifies database operations
- Tests logout functionality

### 3. Authentication Flow Tests (`/auth/`)

#### `test-complete-social-auth-flow.js`
- Comprehensive OAuth flow testing
- Tests all three providers (Google, Facebook, Instagram)
- Validates redirect URLs
- Tests callback handling
- Tests error scenarios
- Tests malformed requests

## Test Helper Utilities

### `SocialAuthTestHelper`
Located in `helpers/social-auth-test-helper.js`, provides:

- `testSocialAuthInitiation(provider)` - Tests OAuth initiation
- `testSocialAuthCallback(provider, mockProfile)` - Tests callback handling
- `testLinkedSocialAccounts(accessToken)` - Tests account management
- `testUnlinkSocialAccount(accessToken, provider)` - Tests unlinking
- `testUnauthenticatedAccess()` - Tests authentication requirements
- `cleanupSocialAuthData(userId)` - Cleans up test data

## Prerequisites

### For All Tests
- Server running on port 3000 (or configured port)
- Database connection
- All dependencies installed

### For Integration Tests
- Database migration run (`npm run migration:run`)
- Test database accessible

### For Complete Flow Tests
- OAuth applications set up with providers
- OAuth credentials in `.env` file
- Valid redirect URLs configured

## Environment Variables for Testing

```env
# Required for all tests
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001

# Required for complete flow tests
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
```

## Test Data

### Mock Profiles
Tests use mock OAuth profiles for simulation:

```javascript
{
  google: {
    id: 'mock_google_123456789',
    emails: [{ value: 'mockuser@gmail.com' }],
    displayName: 'Mock Google User',
    name: { givenName: 'Mock', familyName: 'Google' },
    photos: [{ value: 'https://example.com/mock-google-avatar.jpg' }]
  },
  // ... similar for Facebook and Instagram
}
```

### Test Users
Integration tests create temporary users with:
- Unique usernames (timestamp-based)
- Test passwords
- Automatic cleanup after tests

## Running Tests

### Quick Start
```bash
# Start the server
npm run dev

# In another terminal, run mock tests (no setup needed)
npm run test:social-auth:mock
```

### Full Test Suite
```bash
# 1. Start the server
npm run dev

# 2. Run database migration
npm run migration:run

# 3. Run all social auth tests
npm run test:social-auth
```

### Individual Test Categories
```bash
# Unit tests only
npm run test:social-auth:endpoints

# Integration tests only
npm run test:social-auth:integration

# Complete flow tests only
npm run test:social-auth:flow
```

## Test Output

### Successful Test Run
```
🧪 Social Authentication Test Suite
===================================

📁 Found 4 social auth test file(s):
   - tests/unit/test-social-auth-endpoints.js
   - tests/unit/test-social-auth-mock.js
   - tests/integration/test-social-auth-integration.js
   - tests/auth/test-complete-social-auth-flow.js

🔬 Unit Tests
──────────────────────────────────────────────────
   ✅ test-social-auth-endpoints.js - PASSED
   ✅ test-social-auth-mock.js - PASSED

🔬 Integration Tests
──────────────────────────────────────────────────
   ✅ test-social-auth-integration.js - PASSED

🔬 Authentication Flow Tests
──────────────────────────────────────────────────
   ✅ test-complete-social-auth-flow.js - PASSED

==================================================
📊 Social Authentication Test Summary
==================================================
✅ Passed: 4
❌ Failed: 0
📈 Total:  4

🎉 All social authentication tests passed!
✨ Social authentication is ready for production!
```

### Failed Test Run
```
❌ test-social-auth-integration.js - FAILED (exit code: 1)

==================================================
📊 Social Authentication Test Summary
==================================================
✅ Passed: 3
❌ Failed: 1
📈 Total:  4

⚠️  1 social auth test(s) failed

🔧 Troubleshooting tips:
   - Make sure the server is running on port 3000
   - Check that all dependencies are installed
   - Verify database connection
   - Check environment variables
```

## Troubleshooting

### Common Issues

1. **Server not running**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:3000
   ```
   Solution: Start the server with `npm run dev`

2. **Database connection issues**
   ```
   Error: Database connection failed
   ```
   Solution: Check database configuration and run migration

3. **OAuth credentials missing**
   ```
   Error: Missing required env var: GOOGLE_CLIENT_ID
   ```
   Solution: Add OAuth credentials to `.env` file

4. **Migration not run**
   ```
   Error: relation "social_auth" does not exist
   ```
   Solution: Run `npm run migration:run`

### Debug Mode
Set `DEBUG=true` environment variable for verbose test output:
```bash
DEBUG=true npm run test:social-auth
```

## Contributing

When adding new social authentication tests:

1. Follow the existing naming convention: `test-social-auth-*.js`
2. Use the `SocialAuthTestHelper` for common operations
3. Include proper cleanup in integration tests
4. Add appropriate error handling
5. Update this documentation

## Test Coverage

The social authentication tests cover:

- ✅ OAuth initiation endpoints
- ✅ OAuth callback endpoints
- ✅ User creation and linking
- ✅ Token generation and validation
- ✅ Social account management
- ✅ Authentication requirements
- ✅ Error handling
- ✅ Database operations
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Logout functionality
- ✅ Token refresh
- ✅ Malformed request handling
