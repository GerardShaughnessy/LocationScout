const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('../services/redis');

const createRateLimiter = (options = {}) => {
  return rateLimit({
    store: new RedisStore({
      client: redis,
      prefix: 'rate-limit:'
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later',
    ...options
  });
};

module.exports = {
  standardLimiter: createRateLimiter(),
  mapTileLimiter: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 1000, // Limit tile requests
    message: 'Tile request limit exceeded'
  })
}; 