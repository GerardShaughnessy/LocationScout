console.log('Starting test...');

require('dotenv').config();

console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Found' : 'Not found');

if (process.env.MONGODB_URI) {
    // Hide sensitive info but show format
    const uri = process.env.MONGODB_URI;
    console.log('URI format check:', 
        uri.startsWith('mongodb+srv://') ? 'Correct' : 'Incorrect');
} 