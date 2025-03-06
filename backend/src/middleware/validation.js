const { validationResult, check } = require('express-validator');

const locationValidationRules = [
  check('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  check('coordinates')
    .isArray()
    .withMessage('Coordinates must be an array')
    .custom((value) => {
      if (!Array.isArray(value) || value.length !== 2) {
        throw new Error('Coordinates must contain latitude and longitude');
      }
      const [lng, lat] = value;
      if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
        throw new Error('Invalid coordinates');
      }
      return true;
    }),

  check('type')
    .isIn(['LOCATION', 'PARKING', 'EQUIPMENT', 'CREW', 'CUSTOM'])
    .withMessage('Invalid location type')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  locationValidationRules,
  validate
}; 