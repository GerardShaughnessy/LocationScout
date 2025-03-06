console.log('Test starting...');

// Try to load dotenv
require('dotenv').config();

// Log something basic
console.log('Hello, this is a test!');

// Try to log the environment variable
console.log('Checking for MongoDB URI...');
console.log(process.env.MONGODB_URI || 'No MongoDB URI found');

// Keep the process alive for a moment
setTimeout(() => {
  console.log('Test complete');
}, 1000); 