require('dotenv').config();
const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');

console.log('Environment Check:');
console.log('AWS_REGION:', process.env.AWS_REGION);
console.log('AWS_BUCKET_NAME:', process.env.AWS_BUCKET_NAME);

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

async function testS3Connection() {
  console.log('Attempting to connect to S3...');
  try {
    const command = new ListBucketsCommand({});
    const response = await s3Client.send(command);
    console.log('Success! Found buckets:', response.Buckets.map(b => b.Name));
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Full error:', error);
  }
}

testS3Connection().catch(console.error); 