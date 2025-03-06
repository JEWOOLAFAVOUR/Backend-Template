const { check, validationResult } = require('express-validator')


exports.validateUser = [
    check('firstname')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Firstname is missing!')
        .isLength({ min: 3, max: 20 })
        .withMessage('Firstname must be 3 to 20 characters long!'),
    check('lastname')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Lastname is missing!')
        .isLength({ min: 3, max: 20 })
        .withMessage('Lastname must be 3 to 20 characters long!'),
    check('email')
        .normalizeEmail()
        .isEmail()
        .withMessage('Email is invalid'),
    check('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Password is missing!')
        .isLength({ min: 6, max: 20 })
        .withMessage('Password must be 8 to 20 characters long!')
]

exports.validateLogin = [
    check('email')
        .normalizeEmail()
        .isEmail()
        .withMessage('Email is invalid'),
    check('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Password is missing!')
    // .isLength({ min: 6, max: 20 })
    // .withMessage('Password must be 8 to 20 characters long!')
]

exports.validateBioandLevel = [
    check('bio')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Bio is missing!')
        .isLength({ min: 3, max: 20 })
        .withMessage('Bio must be 5 to 20 characters long!'),
];

exports.validate = (req, res, next) => {
    const error = validationResult(req).array()
    if (!error.length) return next();

    res.status(400).json({ success: false, error: error[0].msg });
}