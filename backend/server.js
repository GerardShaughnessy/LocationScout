const locationRoutes = require('./routes/locationRoutes');

// ... rest of your server code ...

// Add this line to use the location routes
app.use('/api/locations', locationRoutes); 