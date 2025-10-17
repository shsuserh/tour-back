# Social Authentication Tests

This folder contains tests for the social authentication functionality.

## Test File

- `test-social-auth-comprehensive.js` - Main comprehensive test for all social auth functionality

## Running Tests

```bash
# Run social authentication tests
npm run test:social-auth
```

## What the Test Checks

1. **Server Health** - Verifies the server is running and accessible
2. **OAuth Endpoints** - Tests Google, Facebook, Instagram auth initiation endpoints
3. **Authentication Protection** - Ensures social account management requires authentication
4. **Invalid Provider Handling** - Tests proper 404 responses for invalid providers
5. **Database Connection** - Verifies database connectivity
6. **Callback Endpoints** - Tests OAuth callback endpoints accessibility
7. **CORS Headers** - Checks CORS configuration

## Expected Results

- **7/9 tests should pass** when social auth is properly implemented
- **OAuth providers show as "NOT CONFIGURED"** until credentials are added
- **2 tests may fail** until OAuth credentials are configured (this is normal)

## Next Steps After Tests Pass

1. Run database migration: `docker exec tour-migrate-1 npm run migration:run`
2. Set up OAuth applications with Google, Facebook, Instagram
3. Add OAuth credentials to `.env` file
4. Restart Docker container: `docker restart tour-back-1`
5. Test with real OAuth providers
