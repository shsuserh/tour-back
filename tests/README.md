# Tour Application Test Suite

This directory contains the test suite for the Tour application.

## Directory Structure

```
tests/
├── auth/                                    # Authentication tests
│   └── test-complete-auth-flow.js          # Complete authentication test suite
├── helpers/                                 # Test helper utilities
│   └── api-test-user-manager.js             # API-based test user manager
├── integration/                             # Integration tests (empty)
├── unit/                                    # Unit tests (empty)
├── config.js                               # Test configuration
├── run-tests.js                            # Test runner
└── README.md                               # This file
```

## Quick Start

### Run Complete Authentication Tests

```bash
npm test                    # Run all tests (recommended)
npm run test:complete       # Run complete authentication flow directly
```

This test will:
- Create a test user via the `/user` API endpoint
- Test login, authenticated requests, token refresh, and logout
- Automatically clean up all test data when finished
- No manual setup required

## Test Configuration

Edit `tests/config.js` to modify:
- API base URL
- Test user credentials
- Request timeouts
- Default headers

## Test Types

### Authentication Tests (`tests/auth/`)

- **test-complete-auth-flow.js**: Complete API-based authentication test suite
  - Creates test user via `/user` API endpoint
  - Tests login, authenticated requests, token refresh, and logout
  - Automatically cleans up all test data
  - No manual setup required

### Helper Scripts (`tests/helpers/`)

- **api-test-user-manager.js**: API-based test user manager
  - Creates test users via API endpoints
  - Handles login, logout, and cleanup
  - Uses unique usernames to avoid conflicts

## Prerequisites

1. **Application Running**: Ensure the Tour application is running on `http://localhost:3030`
2. **Node.js**: Node.js installed for running test scripts

## Test Data

The test suite automatically creates test users with unique usernames to avoid conflicts. No manual database setup is required.

## Adding New Tests

1. Create test files with the naming convention `test-*.js`
2. Place them in the appropriate subdirectory (`auth/`, `integration/`, `unit/`)
3. Use the configuration from `tests/config.js`
4. Test files will be automatically discovered by the test runner

## Troubleshooting

### Common Issues

1. **503 Service Unavailable**: Ensure the application is running and accessible
2. **Connection Refused**: Check that the application is running on the correct port

### Debug Mode

Add `console.log` statements in test files for debugging, or run individual test files directly:

```bash
node tests/auth/test-complete-auth-flow.js
```

## Test Results

The test runner provides:
- ✅ Pass/Fail status for each test
- 📊 Summary statistics
- 🔍 Detailed error messages for failed tests

## Contributing

When adding new tests:
1. Follow the existing naming conventions
2. Use the shared configuration
3. Include proper error handling
4. Document any special setup requirements
