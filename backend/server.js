const locationRoutes = require('./routes/locationRoutes');
const passwordResetRoutes = require('./routes/passwordResetRoutes');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

// Define rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth routes
  message: 'Too many login attempts, please try again after 15 minutes'
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset requests per hour
  message: 'Too many password reset attempts, please try again after an hour'
});

// ... rest of your server code ...

// Add this line to use the location routes
app.use('/api/locations', locationRoutes);
app.use('/api/password', passwordResetRoutes);

// Apply rate limiters to specific routes
app.use('/api/users/login', authLimiter);
app.use('/api/users/register', authLimiter);
app.use('/api/password/request', passwordResetLimiter);

// Use Helmet for security headers
app.use(helmet());

// Update CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://your-vercel-app.vercel.app',
  credentials: true
})); 