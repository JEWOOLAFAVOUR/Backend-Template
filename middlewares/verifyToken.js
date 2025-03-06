const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/helper');
const { User } = require('../models/user/user')
const { promisify } = require('util')

const generateAccessToken = (userId, isAdmin) => {
    return jwt.sign(
        {
            id: userId,
            isAdmin: isAdmin,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "40d",
        }
    );
};


const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    console.log(authHeader)
    if (authHeader) {
        const token = authHeader.split(" ")[1]
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(decode)
        //  const decode =   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        //         if (err) sendError(res, status = 403, 'Token is not valid')
        //         req.user = user;
        //         return next()
        //     })
    } else {
        return sendError(res, status = 401, 'You are not authenticated')
    }
}

const verifyTokenAndAuthorization = async (req, res, next) => {
    const token = req.headers.authorization

    if (!token) {
        return sendError(res, status = 403, "User not authorized")
    }
    let accessToken = token.split(' ')[1]
    try {
        const decoded = await promisify(jwt.verify)(accessToken, process.env.JWT_SECRET, { expiresIn: "30d" })
        req.userId = decoded.id;
        const user = await User.findById(decoded.id)
        if (!user) {
            return sendError(res, status = 404, 'user does not exist')
        }
        req.user = user

        next()
    } catch (err) {
        res.status(500).json({
            status: 'error',
            err,
            message: err.message
        })

    }

}

const verifyTokenAndAdmin = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return sendError(res, 403, "User not authorized");
    }

    const accessToken = token.split(" ")[1];
    try {
        const decoded = await promisify(jwt.verify)(
            accessToken,
            process.env.JWT_SECRET,
            { expiresIn: "10d" }
        );
        const user = await User.findById(decoded.id);
        if (!user) {
            return sendError(res, 404, "User does not exist");
        }
        if (!user.isAdmin) {
            return sendError(res, 403, "User not authorized");
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({
            status: "error",
            err,
            message: err.message,
        });
    }
};

// authMiddleware.js

const classRepMiddleware = (req, res, next) => {
    if (req.user.position === 'class_rep') {
        // User is a class rep, allow access
        next();
    } else {
        // User is not a class rep, deny access
        res.status(403).json({ error: 'Access forbidden' });
    }
};

module.exports = { classRepMiddleware };



module.exports = { verifyTokenAndAuthorization, verifyToken, verifyTokenAndAdmin, generateAccessToken, classRepMiddleware }


