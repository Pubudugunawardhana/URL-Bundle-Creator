const assert = require('assert');
const axios = require('axios');

// Load compiled CommonJS files
const { AuthService } = require('./dist/auth/auth.service');
const { MetadataService } = require('./dist/metadata/metadata.service');
const { BundlesService } = require('./dist/bundles/bundles.service');

async function testAuthService() {
  console.log('Testing AuthService...');
  
  const mockPrisma = {
    user: {
      findUnique: async ({ where }) => {
        if (where.email === 'exists@example.com') {
          return { id: 'existing-id', email: 'exists@example.com' };
        }
        return null;
      },
      create: async ({ data }) => {
        return { id: 'new-id', ...data };
      }
    }
  };

  const authService = new AuthService(mockPrisma);

  // 1. Success signup
  const res = await authService.signup({
    email: 'new@example.com',
    password: 'password123',
    name: 'New User'
  });
  assert.strictEqual(res.message, 'User registered successfully.');
  assert.strictEqual(res.userId, 'new-id');
  console.log('✅ Signup success test passed');

  // 2. Conflict signup
  try {
    await authService.signup({
      email: 'exists@example.com',
      password: 'password123'
    });
    assert.fail('Should have thrown conflict exception');
  } catch (err) {
    assert.strictEqual(err.status, 409);
    assert.strictEqual(err.getResponse().error, 'A user with this email already exists.');
    console.log('✅ Signup conflict test passed');
  }
}

async function testMetadataService() {
  console.log('Testing MetadataService...');

  const originalGet = axios.get;
  axios.get = async (url, options) => {
    if (url.includes('example.com')) {
      return {
        data: `
          <html>
            <head>
              <title>Example Domain</title>
              <meta name="description" content="This is description">
              <link rel="icon" href="/fav.png">
            </head>
          </html>
        `
      };
    }
    throw new Error('Network error');
  };

  const metadataService = new MetadataService();

  try {
    const metadata = await metadataService.getMetadata('http://example.com');
    assert.strictEqual(metadata.title, 'Example Domain');
    assert.strictEqual(metadata.description, 'This is description');
    assert.strictEqual(metadata.favicon, 'http://example.com/fav.png');
    console.log('✅ Metadata fetch test passed');
  } finally {
    axios.get = originalGet;
  }
}

async function testBundlesService() {
  console.log('Testing BundlesService...');

  const mockPrisma = {
    bundle: {
      create: async ({ data }) => {
        return {
          id: 'bundle-id-1',
          shortId: data.shortId,
          name: data.name,
          description: data.description,
          userId: data.userId,
          password: data.password,
          expiresAt: data.expiresAt,
          links: data.links.create
        };
      },
      findMany: async ({ where }) => {
        if (where.userId === 'user-1') {
          return [{ id: 'b1', name: 'Bundle 1', password: 'secret-hash' }];
        }
        return [];
      },
      findUnique: async ({ where }) => {
        if (where.shortId === 'b1234') {
          return {
            id: 'b1234',
            shortId: 'b1234',
            userId: 'user-1',
            name: 'Bundle 1',
            views: 0,
            password: null,
            links: [{ url: 'https://example.com' }]
          };
        }
        if (where.shortId === 'bother') {
          return {
            id: 'bother',
            shortId: 'bother',
            userId: 'user-2',
            name: 'Bundle Other',
            views: 0,
            password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', // hash of password123
            links: [{ url: 'https://secret.com' }]
          };
        }
        return null;
      },
      update: async ({ where, data }) => {
        return { shortId: where.shortId };
      },
      delete: async ({ where }) => {
        return { shortId: where.shortId };
      }
    }
  };

  const bundlesService = new BundlesService(mockPrisma);

  // 1. Create bundle
  const dto = {
    name: 'My Bundle',
    links: [{ url: 'https://example.com' }],
    expiresIn: '24h'
  };
  const created = await bundlesService.create(dto, 'user-1');
  assert.strictEqual(created.name, 'My Bundle');
  assert.strictEqual(created.userId, 'user-1');
  assert.strictEqual(created.shortId.length, 5);
  console.log('✅ Create bundle test passed');

  // 2. Get user bundles
  const userBundles = await bundlesService.getUserBundles('user-1');
  assert.strictEqual(userBundles.length, 1);
  assert.strictEqual(userBundles[0].name, 'Bundle 1');
  assert.strictEqual(userBundles[0].password, undefined);
  console.log('✅ Get user bundles test passed');

  // 3. Delete bundle success
  const delRes = await bundlesService.delete('b1234', 'user-1');
  assert.strictEqual(delRes.success, true);
  console.log('✅ Delete bundle success test passed');

  // 4. Delete bundle not found
  try {
    await bundlesService.delete('nonexistent', 'user-1');
    assert.fail('Should have failed for nonexistent');
  } catch (err) {
    assert.strictEqual(err.status, 404);
    assert.strictEqual(err.getResponse().error, 'Bundle not found');
    console.log('✅ Delete bundle not found test passed');
  }

  // 5. Delete bundle unauthorized
  try {
    await bundlesService.delete('bother', 'user-1');
    assert.fail('Should have failed for unauthorized');
  } catch (err) {
    assert.strictEqual(err.status, 403);
    assert.strictEqual(err.getResponse().error, 'Unauthorized: You do not own this bundle');
    console.log('✅ Delete bundle unauthorized test passed');
  }

  // 6. Find bundle success (no password)
  const foundNoPass = await bundlesService.findOne('b1234');
  assert.strictEqual(foundNoPass.shortId, 'b1234');
  assert.strictEqual(foundNoPass.views, 1);
  assert.strictEqual(foundNoPass.links.length, 1);
  console.log('✅ Find bundle success (no password) test passed');

  // 7. Find bundle success (correct password hash)
  const foundWithPass = await bundlesService.findOne('bother', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f');
  assert.strictEqual(foundWithPass.shortId, 'bother');
  assert.strictEqual(foundWithPass.links.length, 1);
  assert.strictEqual(foundWithPass.password, 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f');
  console.log('✅ Find bundle success (correct password) test passed');

  // 8. Find bundle success (incorrect/missing password - links redacted)
  const foundRedacted = await bundlesService.findOne('bother', 'wrongpassword');
  assert.strictEqual(foundRedacted.shortId, 'bother');
  assert.strictEqual(foundRedacted.links.length, 0);
  assert.strictEqual(foundRedacted.password, 'protected');
  console.log('✅ Find bundle success (incorrect password, links redacted) test passed');

  // 9. Verify password success
  const verifyRes = await bundlesService.verifyPassword('bother', 'password123');
  assert.strictEqual(verifyRes.success, true);
  console.log('✅ Verify password success test passed');

  // 10. Verify password failure
  try {
    await bundlesService.verifyPassword('bother', 'wrongpassword');
    assert.fail('Should have failed for incorrect password');
  } catch (err) {
    assert.strictEqual(err.status, 403);
    assert.strictEqual(err.getResponse().error, 'Incorrect password');
    console.log('✅ Verify password failure test passed');
  }
}

async function testNextAuthGuard() {
  console.log('Testing NextAuthGuard...');

  // Mock next-auth/jwt before requiring NextAuthGuard
  const jwtPath = require.resolve('next-auth/jwt');
  const originalJwt = require(jwtPath);
  require.cache[jwtPath] = {
    id: jwtPath,
    filename: jwtPath,
    loaded: true,
    exports: {
      ...originalJwt,
      decode: async (options) => {
        if (options.token === 'valid-session-token') {
          return { id: 'user-1', email: 'test@example.com' };
        }
        return null;
      }
    }
  };

  const { NextAuthGuard } = require('./dist/auth/guards/next-auth.guard');
  const guard = new NextAuthGuard();

  process.env.AUTH_SECRET = 'supersecret';

  const mockContext = (cookies) => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            cookie: cookies,
          },
        }),
      }),
    };
  };

  // Case 1: No cookies
  try {
    await guard.canActivate(mockContext(null));
    assert.fail('Should fail on no cookies');
  } catch (e) {
    assert.strictEqual(e.status, 401);
    assert.strictEqual(e.message, 'No cookies found');
    console.log('✅ NextAuthGuard: No cookies test passed');
  }

  // Case 2: No session token
  try {
    await guard.canActivate(mockContext('other-cookie=123'));
    assert.fail('Should fail on no session token');
  } catch (e) {
    assert.strictEqual(e.status, 401);
    assert.strictEqual(e.message, 'No session token found');
    console.log('✅ NextAuthGuard: No session token test passed');
  }

  // Case 3: Valid unchunked session token
  const reqSuccess = { headers: { cookie: 'authjs.session-token=valid-session-token' } };
  const contextSuccess = {
    switchToHttp: () => ({
      getRequest: () => reqSuccess
    })
  };
  const activeSuccess = await guard.canActivate(contextSuccess);
  assert.strictEqual(activeSuccess, true);
  assert.strictEqual(reqSuccess.user.id, 'user-1');
  console.log('✅ NextAuthGuard: Valid session token test passed');

  // Case 4: Valid chunked session token
  const reqChunked = {
    headers: {
      cookie: 'authjs.session-token.0=valid-ses; authjs.session-token.1=sion-to; authjs.session-token.2=ken'
    }
  };
  const contextChunked = {
    switchToHttp: () => ({
      getRequest: () => reqChunked
    })
  };
  const activeChunked = await guard.canActivate(contextChunked);
  assert.strictEqual(activeChunked, true);
  assert.strictEqual(reqChunked.user.id, 'user-1');
  console.log('✅ NextAuthGuard: Valid chunked session token test passed');
}

async function runAll() {
  try {
    await testAuthService();
    await testMetadataService();
    await testBundlesService();
    await testNextAuthGuard();
    console.log('\n🎉 ALL BACKEND TESTS PASSED!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test suite failed:', err);
    process.exit(1);
  }
}

runAll();
