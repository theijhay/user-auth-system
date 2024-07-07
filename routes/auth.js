const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { check, validationResult } = require('express-validator');
const errorHandler = require('../middlewares/errorHandler');

router.post(
    '/register',
    [
        check('firstName', 'First name is required').not().isEmpty(),
        check('lastName', 'Last name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').not().isEmpty()
    ],
    errorHandler,
    register
);

router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').not().isEmpty()
    ],
    errorHandler,
    login
);

module.exports = router;
