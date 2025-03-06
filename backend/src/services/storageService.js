const AWS = require('aws-sdk');
const sharp = require('sharp');

class StorageService {
  constructor() {
    this.s3 = new AWS.S3();
    this.compressionDefaults = {
      photo: { quality: 80, format: 'jpeg' },
      document: { quality: 'medium' },
      audio: { bitrate: 128000 }
    };
  }

  async compressAndStore(file, type, customSettings = {}) {
    const settings = { ...this.compressionDefaults[type], ...customSettings };
    let compressed;

    if (type === 'photo') {
      compressed = await sharp(file.buffer)
        .jpeg({ quality: settings.quality })
        .toBuffer();
    }
    // Add more compression types as needed

    return this.uploadToS3(compressed || file.buffer, file.originalname);
  }

  async setRetentionPeriod(fileId, period) {
    const expirationDate = this.calculateExpirationDate(period);
    // Set expiration policy on S3 and update database
  }
}

module.exports = new StorageService(); 