import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Manually parse .env
const envPath = resolve('.env');
const envContent = readFileSync(envPath, 'utf8');
const envVars = {};
for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
        const idx = trimmed.indexOf('=');
        if (idx > 0) {
            const key = trimmed.slice(0, idx).trim();
            const val = trimmed.slice(idx + 1).trim().replace(/\r$/, '');
            envVars[key] = val;
        }
    }
}

const uri = envVars['MONGODB_URI'];
if (!uri) {
    console.log('ERROR: MONGODB_URI not found in .env');
    process.exit(1);
}

const safeUri = uri.replace(/:([^@]+)@/, ':****@');
console.log('Testing connection to:', safeUri);

try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('SUCCESS: Connected to MongoDB Atlas!');
    console.log('Host:', mongoose.connection.host);
    console.log('Database:', mongoose.connection.name);
    await mongoose.disconnect();
} catch (err) {
    console.log('FAILED:', err.message);
    if (err.message.includes('ETIMEDOUT') || err.message.includes('timed out')) {
        console.log('REASON: Your IP is NOT whitelisted in MongoDB Atlas Network Access.');
        console.log('FIX: Go to Atlas -> Network Access -> Add IP Address -> Allow from Anywhere (0.0.0.0/0)');
    } else if (err.message.includes('authentication') || err.message.includes('bad auth')) {
        console.log('REASON: Wrong username or password in MONGODB_URI.');
    } else if (err.message.includes('getaddrinfo')) {
        console.log('REASON: Cannot resolve hostname. Check internet or cluster URL.');
    }
}
process.exit(0);
