const jwt = require('jsonwebtoken');
const User = require('../models').User;

const auth = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ where: { userId: decoded.user.id } });

        if (!user) {
            throw new Error();
        }

        req.user = { userId: user.userId, id: user.id }; // Ensure userId is set correctly
        next();
    } catch (err) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = auth;
