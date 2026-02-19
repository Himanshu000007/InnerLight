/**
 * Generate JWT Secret Key
 * 
 * Run this file to generate a secure random JWT secret:
 * node generate-secret.js
 */

import crypto from 'crypto';

const secret = crypto.randomBytes(64).toString('hex');
console.log('\n🔐 Generated JWT Secret Key:\n');
console.log(secret);
console.log('\n📋 Copy this to your .env file as JWT_SECRET\n');
