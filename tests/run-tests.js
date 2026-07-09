const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

const WORKSPACE_DIR = path.resolve(__dirname, '..');

const BACKEND_DIR = path.join(WORKSPACE_DIR, 'backend');
const FRONTEND_DIR = path.join(WORKSPACE_DIR, 'frontend');

const SCHEMA_PATH = path.join(BACKEND_DIR, 'prisma', 'schema.prisma');
const SCHEMA_BACKUP_PATH = path.join(BACKEND_DIR, 'prisma', 'schema.prisma.backup');

const BACKEND_ENV_PATH = path.join(BACKEND_DIR, '.env');
const BACKEND_ENV_BACKUP_PATH = path.join(BACKEND_DIR, '.env.backup');

const FRONTEND_ENV_PATH = path.join(FRONTEND_DIR, '.env');
const FRONTEND_ENV_BACKUP_PATH = path.join(FRONTEND_DIR, '.env.backup');

let backendProcess = null;
let frontendProcess = null;
let testsFailed = false;

// Helper to kill processes on Windows or POSIX
function killProcess(proc) {
  if (proc) {
    try {
      if (process.platform === 'win32') {
        execSync(`taskkill /pid ${proc.pid} /f /t`);
      } else {
        proc.kill('SIGTERM');
      }
    } catch (e) {
      // Ignore
    }
  }
}

// Backup files
function backupFiles() {
  console.log('Backing up schema and .env files...');
  if (fs.existsSync(SCHEMA_PATH)) {
    fs.copyFileSync(SCHEMA_PATH, SCHEMA_BACKUP_PATH);
  }
  if (fs.existsSync(BACKEND_ENV_PATH)) {
    fs.copyFileSync(BACKEND_ENV_PATH, BACKEND_ENV_BACKUP_PATH);
  }
  if (fs.existsSync(FRONTEND_ENV_PATH)) {
    fs.copyFileSync(FRONTEND_ENV_PATH, FRONTEND_ENV_BACKUP_PATH);
  }
}

// Restore files
function restoreFiles() {
  console.log('Restoring schema and .env files from backups...');
  if (fs.existsSync(SCHEMA_BACKUP_PATH)) {
    fs.copyFileSync(SCHEMA_BACKUP_PATH, SCHEMA_PATH);
    fs.unlinkSync(SCHEMA_BACKUP_PATH);
  }
  if (fs.existsSync(BACKEND_ENV_BACKUP_PATH)) {
    fs.copyFileSync(BACKEND_ENV_BACKUP_PATH, BACKEND_ENV_PATH);
    fs.unlinkSync(BACKEND_ENV_BACKUP_PATH);
  }
  if (fs.existsSync(FRONTEND_ENV_BACKUP_PATH)) {
    fs.copyFileSync(FRONTEND_ENV_BACKUP_PATH, FRONTEND_ENV_PATH);
    fs.unlinkSync(FRONTEND_ENV_BACKUP_PATH);
  }

  // Delete test database files
  const dbPath = path.resolve(BACKEND_DIR, 'prisma', 'test.db');
  const dbFiles = [dbPath, `${dbPath}-journal`, `${dbPath}-wal`, `${dbPath}-shm`];
  for (const file of dbFiles) {
    if (fs.existsSync(file)) {
      try {
        fs.unlinkSync(file);
      } catch (e) {
        // Ignore
      }
    }
  }
}

// Clean up servers and restore files
function cleanup() {
  console.log('Cleaning up integration test processes...');
  if (backendProcess) {
    console.log('Stopping backend server...');
    killProcess(backendProcess);
    backendProcess = null;
  }
  if (frontendProcess) {
    console.log('Stopping frontend server...');
    killProcess(frontendProcess);
    frontendProcess = null;
  }
  restoreFiles();
}

// Register exit handlers
process.on('exit', cleanup);
process.on('SIGINT', () => {
  cleanup();
  process.exit(1);
});
process.on('SIGTERM', () => {
  cleanup();
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  cleanup();
  process.exit(1);
});

async function main() {
  try {
    backupFiles();

    // Setup absolute path to SQLite test DB
    const dbPath = path.resolve(BACKEND_DIR, 'prisma', 'test.db').replace(/\\/g, '/');
    const databaseUrl = `file:${dbPath}`;
    const authSecret = 'test-secret-key-1234567890';

    console.log(`Test SQLite Database Path: ${dbPath}`);

    // Create env file content
    const testEnvContent = `DATABASE_URL="${databaseUrl}"\nAUTH_SECRET="${authSecret}"\nNEXTAUTH_SECRET="${authSecret}"\nPORT=3002`;
    fs.writeFileSync(BACKEND_ENV_PATH, testEnvContent);

    const frontendEnvContent = `AUTH_SECRET="${authSecret}"\nNEXTAUTH_SECRET="${authSecret}"\nNEXTAUTH_URL="http://localhost:3001"\nPORT=3001`;
    fs.writeFileSync(FRONTEND_ENV_PATH, frontendEnvContent);

    // Modify schema.prisma to use SQLite provider
    console.log('Configuring SQLite database schema...');
    let schemaContent = fs.readFileSync(SCHEMA_PATH, 'utf8');
    schemaContent = schemaContent.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
    fs.writeFileSync(SCHEMA_PATH, schemaContent);

    const commonEnv = {
      ...process.env,
      DATABASE_URL: databaseUrl,
      AUTH_SECRET: authSecret,
      NEXTAUTH_SECRET: authSecret,
      NEXTAUTH_URL: 'http://localhost:3001',
      NEXT_PUBLIC_BACKEND_URL: 'http://localhost:3002',
    };

    // Run db push on backend schema
    console.log('Running prisma db push for SQLite test database...');
    execSync('npx prisma db push --accept-data-loss --schema=backend/prisma/schema.prisma', {
      cwd: WORKSPACE_DIR,
      env: commonEnv,
      stdio: 'inherit'
    });

    // Run prisma generate
    console.log('Running prisma generate...');
    execSync('npx prisma generate --schema=backend/prisma/schema.prisma', {
      cwd: WORKSPACE_DIR,
      env: commonEnv,
      stdio: 'inherit'
    });

    // Spawn backend on port 3002
    console.log('Starting NestJS backend server on port 3002...');
    backendProcess = spawn('node', ['dist/main.js'], {
      cwd: BACKEND_DIR,
      env: { ...commonEnv, PORT: '3002' },
      shell: true,
      stdio: 'pipe',
    });

    backendProcess.stdout.on('data', (data) => {
      console.log(`[Backend stdout] ${data.toString().trim()}`);
    });
    backendProcess.stderr.on('data', (data) => {
      console.error(`[Backend stderr] ${data.toString().trim()}`);
    });

    // Spawn frontend Next.js server on port 3001
    console.log('Starting Next.js frontend server on port 3001...');
    frontendProcess = spawn('npx', ['next', 'dev', '-p', '3001'], {
      cwd: FRONTEND_DIR,
      env: { ...commonEnv, PORT: '3001' },
      shell: true,
      stdio: 'pipe',
    });

    frontendProcess.stdout.on('data', (data) => {
      console.log(`[Frontend stdout] ${data.toString().trim()}`);
    });
    frontendProcess.stderr.on('data', (data) => {
      console.error(`[Frontend stderr] ${data.toString().trim()}`);
    });

    // Wait for backend to start (port 3002)
    console.log('Waiting for NestJS backend to respond on http://localhost:3002/api/bundles...');
    let backendReady = false;
    for (let i = 0; i < 30; i++) {
      try {
        const res = await fetch('http://localhost:3002/api/bundles');
        if (res.status === 401 || res.status === 200 || res.status === 400 || res.status === 404) {
          backendReady = true;
          break;
        }
      } catch (err) {
        // Wait
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (!backendReady) {
      throw new Error('NestJS backend server failed to start on port 3002 after 30 seconds.');
    }
    console.log('Backend is responsive!');

    // Wait for frontend to start (port 3001)
    console.log('Waiting for Next.js frontend to respond on http://localhost:3001...');
    let frontendReady = false;
    for (let i = 0; i < 30; i++) {
      try {
        const res = await fetch('http://localhost:3001');
        if (res.status === 200 || res.status === 302 || res.status === 307 || res.status === 404) {
          frontendReady = true;
          break;
        }
      } catch (err) {
        // Wait
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (!frontendReady) {
      throw new Error('Next.js dev server failed to start on port 3001 after 30 seconds.');
    }
    console.log('Frontend is responsive!');

    console.log('Both servers are ready. Starting verification tests...');

    // Instantiate Prisma Client pointing to the SQLite DB
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });

    // 1. Route Protection Test
    console.log('\n--- Test 1: Route protection ---');
    const routeRes = await fetch('http://localhost:3001/dashboard', { redirect: 'manual' });
    console.log(`Status: ${routeRes.status}`);
    const location = routeRes.headers.get('location');
    console.log(`Location Header: ${location}`);
    if (location && location.includes('/login')) {
      console.log('✅ Route Protection Test Passed!');
    } else {
      console.log('❌ Route Protection Test Failed!');
      testsFailed = true;
    }

    // 2. Signup Test
    console.log('\n--- Test 2: User Signup ---');
    const email = `test_${Date.now()}@example.com`;
    const signupRes = await fetch('http://localhost:3001/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email,
        password: 'Password123',
      }),
    });
    console.log(`Status: ${signupRes.status}`);
    const signupData = await signupRes.json();
    console.log('Response:', signupData);
    if (signupRes.status === 201 && signupData.userId) {
      console.log('✅ User Signup Test Passed!');
    } else {
      console.log('❌ User Signup Test Failed!');
      testsFailed = true;
    }

    // 3. Login Test
    console.log('\n--- Test 3: User Login ---');
    // Step 3a: Get CSRF Token
    const csrfRes = await fetch('http://localhost:3001/api/auth/csrf');
    const csrfData = await csrfRes.json();
    const csrfToken = csrfData.csrfToken;
    console.log(`CSRF Token: ${csrfToken}`);
    const csrfCookie = csrfRes.headers.get('set-cookie');
    console.log(`CSRF Cookie: ${csrfCookie}`);

    // Extract raw csrf cookie value
    let csrfCookieValue = '';
    if (csrfCookie) {
      csrfCookieValue = csrfCookie.split(';')[0];
    }

    // Step 3b: Authenticate via POST
    const loginRes = await fetch('http://localhost:3001/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': csrfCookieValue,
      },
      body: new URLSearchParams({
        email,
        password: 'Password123',
        csrfToken,
        redirect: 'false',
        json: 'true',
      }).toString(),
      redirect: 'manual',
    });

    console.log(`Login response status: ${loginRes.status}`);
    const loginCookies = loginRes.headers.get('set-cookie');
    console.log(`Login response Set-Cookie: ${loginCookies}`);

    let sessionCookieValue = '';
    if (loginCookies) {
      // Find the authjs.session-token cookie
      const match = loginCookies.match(/authjs\.session-token=([^;]+)/);
      if (match) {
        sessionCookieValue = `authjs.session-token=${match[1]}`;
      }
    }
    console.log(`Extracted Session Cookie: ${sessionCookieValue}`);

    if (sessionCookieValue) {
      console.log('✅ User Login Test Passed!');
    } else {
      console.log('❌ User Login Test Failed!');
      testsFailed = true;
    }

    // 4. Anonymous Bundle Creation Test
    console.log('\n--- Test 4: Anonymous Bundle Creation ---');
    const anonBundleRes = await fetch('http://localhost:3001/api/bundles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Anonymous Bundle',
        description: 'Testing anon bundle creation',
        links: [{ url: 'https://example.com', title: 'Example' }],
      }),
    });
    console.log(`Status: ${anonBundleRes.status}`);
    const anonBundleData = await anonBundleRes.json();
    console.log('Created bundle:', anonBundleData);

    if (anonBundleRes.status === 201 && anonBundleData.shortId) {
      // Verify in DB
      const dbBundle = await prisma.bundle.findUnique({
        where: { shortId: anonBundleData.shortId },
      });
      console.log(`Bundle in DB userId: ${dbBundle.userId}`);
      if (dbBundle.userId === null) {
        console.log('✅ Anonymous Bundle Creation Test Passed!');
      } else {
        console.log('❌ Anonymous Bundle Creation Test Failed (userId is not null)!');
        testsFailed = true;
      }
    } else {
      console.log('❌ Anonymous Bundle Creation Test Failed (HTTP error)!');
      testsFailed = true;
    }

    // 5. Authenticated Bundle Creation Test
    console.log('\n--- Test 5: Authenticated Bundle Creation ---');
    if (!sessionCookieValue) {
      console.log('❌ Cannot test Authenticated Bundle Creation (Login failed/No session cookie)');
      testsFailed = true;
    } else {
      const authBundleRes = await fetch('http://localhost:3001/api/bundles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': sessionCookieValue,
        },
        body: JSON.stringify({
          name: 'Authenticated Bundle',
          description: 'Testing authenticated bundle creation',
          links: [{ url: 'https://google.com', title: 'Google' }],
        }),
      });
      console.log(`Status: ${authBundleRes.status}`);
      const authBundleData = await authBundleRes.json();
      console.log('Created bundle:', authBundleData);

      if (authBundleRes.status === 201 && authBundleData.shortId) {
        // Verify in DB
        const dbBundle = await prisma.bundle.findUnique({
          where: { shortId: authBundleData.shortId },
        });
        console.log(`Bundle in DB userId: ${dbBundle.userId}`);
        if (dbBundle.userId !== null && dbBundle.userId === signupData.userId) {
          console.log('✅ Authenticated Bundle Creation Test Passed!');
        } else {
          console.log(`❌ Authenticated Bundle Creation Test Failed (userId in DB is ${dbBundle.userId}, expected ${signupData.userId})!`);
          testsFailed = true;
        }
      } else {
        console.log('❌ Authenticated Bundle Creation Test Failed (HTTP error)!');
        testsFailed = true;
      }
    }

    await prisma.$disconnect();

    if (testsFailed) {
      console.log('\n❌ SOME INTEGRATION TESTS FAILED.');
      process.exit(1);
    } else {
      console.log('\n🎉 ALL INTEGRATION TESTS PASSED!');
      process.exit(0);
    }

  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  } finally {
    cleanup();
  }
}

main();
