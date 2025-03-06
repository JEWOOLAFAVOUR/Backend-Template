// MODEL 
const { User, } = require('../../models/user/user');

const jwt = require("jsonwebtoken");
const crypto = require("crypto-js");
const { isValidObjectId } = require("mongoose");
const { sendError, } = require('../../utils/helper');


exports.createUser = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        const userEmail = await User.findOne({ email })

        if (userEmail) {
            // Check if the email is already verified
            const user = await User.findOne({ email });
            if (user.verifyLater) {
                return res.status(400)
                    .json({
                        checkStatus: "activated",
                        message: "This account is already activated, please login"
                    });
            } else {
                return res
                    .status(400)
                    .json({
                        checkStatus: "verify-later",
                        message: "This account need verification",
                        userId: user._id
                    })
            }
        }

        const newUser = new User({
            email: req.body.email,
            password: crypto.AES.encrypt(
                req.body.password,
                process.env.PASS_SEC
            ).toString(),
            firstname,
            lastname,
        });

        await newUser.save();

        // const emailSubject = "Hello ✔";
        // const emailText = "Hello {{ contact.FIRSTNAME }}, This is an SMTP message with customizations";

        // sendEmail(email, emailSubject, emailText);


        res.status(201).json({
            status: true,
            message: "Account Created Successfully. Please Verify your email",
            user: {
                userId: newUser._id,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                email: newUser.email,
                verified: newUser.verified,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "User Creation Failed",
            result: error,
        });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return sendError(res, 401, "email/password missing!");

        const user = await User.findOne({ email });
        if (!user)
            return sendError(res, 404, "User doesn't exist!");

        const isMatched = await crypto.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );
        const passwords = isMatched.toString(crypto.enc.Utf8);
        if (passwords !== req.body.password) {
            return sendError(res, 401, "Password doesn't match!");
        }

        if (user.verifyLater === false) {
            return res
                .status(400)
                .json({
                    checkStatus: "verify-later",
                    message: "This account need vefirication",
                    userId: user._id
                })
        }

        // Generate access token
        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "30d",
            }
        );

        // if (!user.department) {
        //     return res
        //         .status(404)
        //         .json({
        //             checkStatus: "department",
        //             message: "You need to choose department and level before continuing",
        //             accessToken,
        //         })
        // }

        // if (user.level === "100 Level" && !user.category) {
        //     return res
        //         .status(404)
        //         .json({
        //             checkStatus: "category",
        //             message: "Choosing category is compulsory for 100 level student",
        //             accessToken,
        //         })
        // }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Login Successfully",
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                bio: user.bio,
                // department: user.department,
                // level: user.level,
                // verified: user.verified,
                // gender: user.gender,
                // role: user.role,
                // notification: user.notifications,
            },
            accessToken,
        });
    } catch (error) {
        res.status(500).json({
            message: "User Login Failed",
            result: error,
        });
    }
};
