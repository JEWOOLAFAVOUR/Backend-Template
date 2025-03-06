const crypto = require('crypto');
const { isValidObjectId } = require('mongoose');

exports.sendError = (res, status = 404, message = 'Not found', error = null) => {
    const response = {
        success: false,
        message: message
    };
    if (error) {
        response.error = error;
    }
    res.status(status).json(response);
}

exports.idError = (res, message = "Invalid ID from Mongoose") => {
    res
        .status(404)
        .json({
            status: false,
            message: message
        })
}

exports.createRandomBytes = () =>
    new Promise((resolve, reject) => {
        crypto.randomBytes(30, (err, buff) => {
            if (err) reject(err);

            const token = buff.toString('hex');
            resolve(token)
        })
    })

// Function to generate a random quiz ID
exports.generateQuizId = () => {
    // Implement your logic to generate a unique quiz ID
    // Example: Generate a random string using a combination of letters and numbers
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let quizId = '';
    for (let i = 0; i < 6; i++) {
        quizId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return quizId;
};


exports.generateUniqueChannelNumber = () => {
    const min = 100000; // Minimum 6-digit number
    const max = 999999; // Maximum 6-digit number

    return Math.floor(Math.random() * (max - min + 1)) + min;
}
