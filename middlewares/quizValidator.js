const { check, validationResult } = require('express-validator');

exports.validateQuiz = [
    // check('quizId')
    //     .trim()
    //     .not()
    //     .isEmpty()
    //     .withMessage('Quiz ID is missing!'),
    // check('password')
    //     .optional()
    //     .trim(),
    check('quizName')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Quiz name is missing!'),
    check('quizType')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Quiz type is missing!'),
    check('quizType')
        .trim()
        .isIn([
            'Multiple Choice Question (4 Option)',
            'Multiple Choice Question (5 Option)',
            'Multiple Choice Question (2 Option)'
        ])
        .withMessage('Invalid quiz type!'),
    check('numberOfQuestions')
        .isInt({ min: 5 })
        .withMessage('Number of questions must be a positive integer!'),
    check('duration')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Quiz duration is missing'),
    check('duration')
        .trim()
        .isIn([
            "5 Minutes",
            "10 Minutes",
            "20 Minutes",
            "30 Minutes"
        ])
        .withMessage('Select right duration!'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

