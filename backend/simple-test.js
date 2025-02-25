console.log('Starting test...');

require('dotenv').config();

console.log('Environment variables:');
console.log('AWS_REGION:', process.env.AWS_REGION);
console.log('AWS_BUCKET_NAME:', process.env.AWS_BUCKET_NAME);
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? 'Found' : 'Not found');
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'Found' : 'Not found');

if (process.env.MONGODB_URI) {
    console.log('First few characters of URI:', process.env.MONGODB_URI.substring(0, 20) + '...');
} 