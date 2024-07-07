const User = require('../models/User');
const Organisation = require('../models/Organisation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const register = async (req, res, next) => {
    const { firstName, lastName, email, password, phone } = req.body;

    // Validate required fields
    const errors = [];
    if (!firstName) errors.push({ field: 'firstName', message: 'First name is required' });
    if (!lastName) errors.push({ field: 'lastName', message: 'Last name is required' });
    if (!email) errors.push({ field: 'email', message: 'Email is required' });
    if (!password) errors.push({ field: 'password', message: 'Password is required' });

    if (errors.length > 0) {
        return res.status(422).json({ errors });
    }

    try {
        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            userId,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone
        });

        const savedUser = await user.save();

        const org = new Organisation({
            orgId: uuidv4(),
            name: `${firstName}'s Organisation`,
            users: [savedUser._id]
        });

        await org.save();

        const payload = {
            user: {
                id: savedUser.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({
                    status: 'success',
                    message: 'Registration successful',
                    data: {
                        accessToken: token,
                        user: {
                            userId: savedUser.userId,
                            firstName: savedUser.firstName,
                            lastName: savedUser.lastName,
                            email: savedUser.email,
                            phone: savedUser.phone
                        }
                    }
                });
            }
        );
    } catch (err) {
        if (err.code === 11000) { // Duplicate key error
            err.name = 'DuplicateKeyError';
            return next(err);
        }
        next(err);
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ status: 'Bad request', message: 'Authentication failed', statusCode: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ status: 'Bad request', message: 'Authentication failed', statusCode: 401 });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({
                    status: 'success',
                    message: 'Login successful',
                    data: {
                        accessToken: token,
                        user: {
                            userId: user.userId,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            phone: user.phone
                        }
                    }
                });
            }
        );
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login };
