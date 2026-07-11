const fs = require('fs');
const path = require('path');

// Fix Login Page
const loginPath = path.join(__dirname, '../app/login/page.js');
let loginContent = fs.readFileSync(loginPath, 'utf8');

loginContent = loginContent.replace(/import api from '@\/lib\/axios';/g, "import { signIn } from 'next-auth/react';");
loginContent = loginContent.replace(/const res = await api\.post\('\/auth\/login', \{ email, password \}\);\s*localStorage\.setItem\('token', res\.data\.token\);\s*router\.push\('\/dashboard'\);/g, `
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
`);
loginContent = loginContent.replace(/FocusTube/g, 'URL Bundle Creator');
loginContent = loginContent.replace(/\/register/g, '/signup');
fs.writeFileSync(loginPath, loginContent, 'utf8');


// Fix Signup Page
const signupPath = path.join(__dirname, '../app/signup/page.js');
let signupContent = fs.readFileSync(signupPath, 'utf8');

signupContent = signupContent.replace(/FocusTube/g, 'URL Bundle Creator');
signupContent = signupContent.replace(/api\.post\('\/auth\/register'/g, "fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify");
signupContent = signupContent.replace(/\}\);/g, "} )"); // fix body stringify
signupContent = signupContent.replace(/localStorage\.setItem\('token', res\.data\.token\);\s*router\.push\('\/dashboard'\);/g, `
      // Try to sign in automatically
      const signInRes = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (signInRes?.error) {
        router.push('/login');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
`);
signupContent = signupContent.replace(/import api from '@\/lib\/axios';/, "import { signIn } from 'next-auth/react';");

fs.writeFileSync(signupPath, signupContent, 'utf8');
console.log('Fixed auth pages successfully.');
