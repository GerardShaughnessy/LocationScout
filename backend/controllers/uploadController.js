const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const uploadController = {
  // Generate pre-signed URL for direct upload
  getUploadUrl: async (req, res) => {
    try {
      const { fileName, fileType } = req.body;
      const key = `uploads/${Date.now()}-${fileName}`;

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        ContentType: fileType
      });

      const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

      res.json({
        uploadUrl,
        key
      });
    } catch (error) {
      console.error('Upload URL generation error:', error);
      res.status(500).json({ error: 'Failed to generate upload URL' });
    }
  }
};

module.exports = uploadController; 