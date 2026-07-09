const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function test() {
  try {
    const email = 'test2@example.com';
    const password = 'password123';
    
    console.log('Checking existing user...');
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) console.log('Exists!');
    
    console.log('Hashing password...');
    const hash = await bcrypt.hash(password, 10);
    
    console.log('Creating user...');
    const user = await prisma.user.create({
      data: {
        email,
        password: hash,
        name: 'Test',
      }
    });
    console.log('Success:', user);
  } catch (e) {
    console.error('ERROR:', e);
  } finally {
    await prisma.$disconnect();
  }
}
test();
