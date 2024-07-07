const User = require('../models/User');

const getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.id });

        if (!user) {
            return res.status(404).json({ status: 'Bad Request', message: 'User not found', statusCode: 404 });
        }

        res.status(200).json({
            status: 'success',
            message: 'User fetched successfully',
            data: {
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (err) {
        res.status(400).json({ status: 'Bad Request', message: 'Client error', statusCode: 400 });
    }
};

module.exports = { getUserById };
