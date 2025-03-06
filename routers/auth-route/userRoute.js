const express = require('express');

const { parseData } = require('../../middlewares');
const multer = require('../../middlewares/multer');
const { validate, validateUser, validateLogin } = require('../../middlewares/validator');
const { createUser, loginUser } = require('../../controllers/auth-controller/userController');

const router = express.Router();

// USER 
router.post('/create-user', validateUser, validate, createUser)
router.post('/login-user', validateLogin, validate, loginUser)

module.exports = router;
