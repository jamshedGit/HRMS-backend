const { body, validationResult } = require('express-validator');
const validateIbFormFields = [
    body('countryId').notEmpty().withMessage('countryId is required'),
    body('cityId').notEmpty().withMessage('cityId is required'),
    body('incidentTypeId').notEmpty().withMessage('incidentTypeId is required'),
    body('districtId').notEmpty().withMessage('districtId is required'),
    body('areaId').notEmpty().withMessage('areaId is required'),
    body('statusId').notEmpty().withMessage('statusId is required'),
    // body('description').notEmpty().withMessage('Description is required'),
    // body('price').notEmpty().withMessage('Price is required').isNumeric().withMessage('Price should be numeric'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

const validateMortuaryFormFields = [
    body('countryId').notEmpty().withMessage('countryId is required'),
    body('cityId').notEmpty().withMessage('cityId is required'),
    body('statusId').notEmpty().withMessage('statusId is required'),
    // body('description').notEmpty().withMessage('Description is required'),
    // body('price').notEmpty().withMessage('Price is required').isNumeric().withMessage('Price should be numeric'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

module.exports = { validateIbFormFields, validateMortuaryFormFields };