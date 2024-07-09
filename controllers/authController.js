const { User, Organisation, UserOrganisation } = require('../models');
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

        const user = await User.create({
            userId,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone
        });

        const org = await Organisation.create({
            orgId: uuidv4(),
            name: `${firstName}'s Organisation`,
            description: '',
        });

        await UserOrganisation.create({
            userId: user.userId,
            orgId: org.orgId
        });

        const payload = {
            user: {
                id: user.userId
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
        if (err.name === 'SequelizeUniqueConstraintError') { 
            const field = err.errors[0].path;
            return res.status(422).json({
                errors: [{ field, message: `${field.charAt(0).toUpperCase() + field.slice(1)} already in use` }]
            });
        }
        next(err);
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ status: 'Bad request', message: 'Authentication failed', statusCode: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ status: 'Bad request', message: 'Authentication failed', statusCode: 401 });
        }

        const payload = {
            user: {
                id: user.userId
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
