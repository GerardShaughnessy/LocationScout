const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Location = require('../src/models/Location');
const { setupTestDB, generateAuthToken } = require('./helpers');

describe('Location API Tests', () => {
  let authToken;
  let testLocation;

  beforeAll(async () => {
    await setupTestDB();
    authToken = await generateAuthToken();
  });

  beforeEach(async () => {
    testLocation = {
      name: 'Test Location',
      coordinates: [-73.935242, 40.730610],
      type: 'LOCATION',
      description: 'Test description'
    };
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/locations', () => {
    it('should create a new location', async () => {
      const response = await request(app)
        .post('/api/locations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testLocation);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(testLocation.name);
      expect(response.body.coordinates.coordinates).toEqual(testLocation.coordinates);
    });

    it('should fail with invalid coordinates', async () => {
      testLocation.coordinates = [-200, 100];
      const response = await request(app)
        .post('/api/locations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testLocation);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/locations', () => {
    it('should get locations within bounds', async () => {
      const bounds = '-74,40,-73,41';
      const response = await request(app)
        .get(`/api/locations?bounds=${bounds}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should handle offline region data request', async () => {
      const region = {
        bounds: {
          sw: { lng: -74, lat: 40 },
          ne: { lng: -73, lat: 41 }
        },
        zoom: 14
      };

      const response = await request(app)
        .post('/api/locations/offline-region')
        .set('Authorization', `Bearer ${authToken}`)
        .send(region);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('locations');
      expect(response.body).toHaveProperty('mapData');
    });
  });
}); 