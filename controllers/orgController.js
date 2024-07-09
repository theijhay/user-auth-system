const { Organisation, User, UserOrganisation } = require('../models');
const { v4: uuidv4 } = require('uuid');

const createOrganisation = async (req, res, next) => {
    const { name, description } = req.body;
    const userId = req.user.userId;

    try {
        const org = await Organisation.create({
            orgId: uuidv4(),
            name,
            description
        });

        await UserOrganisation.create({
            userId,
            orgId: org.orgId
        });

        res.status(201).json({
            status: 'success',
            message: 'Organisation created successfully',
            data: {
                orgId: org.orgId,
                name: org.name,
                description: org.description
            }
        });
    } catch (err) {
        console.error('Error creating organisation:', err);
        next(err);
    }
};

const getOrganisations = async (req, res, next) => {
    const userId = req.user.userId; // Use userId instead of id

    try {
        const organisations = await Organisation.findAll({
            include: [
                {
                    model: User,
                    through: {
                        attributes: [],
                    },
                    where: { userId }, // Use userId instead of id
                },
            ],
        });

        res.status(200).json({
            status: 'success',
            message: 'Organisations fetched successfully',
            data: {
                organisations: organisations.map(org => ({
                    orgId: org.orgId,
                    name: org.name,
                    description: org.description,
                })),
            },
        });
    } catch (err) {
        console.error('Error fetching organisations:', err);
        res.status(400).json({ status: 'Bad Request', message: err.message, statusCode: 400 });
    }
};

const getOrganisationById = async (req, res, next) => {
    const userId = req.user.userId; // Use userId instead of id
    const { orgId } = req.params;

    try {
        const organisation = await Organisation.findOne({
            where: { orgId },
            include: [
                {
                    model: User,
                    through: {
                        attributes: [],
                    },
                    where: { userId }, // Use userId instead of id
                },
            ],
        });

        if (!organisation) {
            return res.status(404).json({
                status: 'Bad Request',
                message: 'Organisation not found',
                statusCode: 404,
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Organisation fetched successfully',
            data: {
                orgId: organisation.orgId,
                name: organisation.name,
                description: organisation.description,
            },
        });
    } catch (err) {
        console.error('Error fetching organisation by ID:', err);
        next(err);
    }
};

const addUserToOrganisation = async (req, res) => {
    const { orgId } = req.params;
    const { userId } = req.body;

    try {
        const organisation = await Organisation.findOne({ where: { orgId } });
        if (!organisation) {
            return res.status(404).json({ status: 'Not Found', message: 'Organisation not found', statusCode: 404 });
        }

        console.log(`Adding user ${userId} to organisation ${orgId}`);  // Debugging log

        const user = await User.findOne({ where: { userId } });
        if (!user) {
            return res.status(404).json({ status: 'Not Found', message: 'User not found', statusCode: 404 });
        }

        // Ensure organisation.users is an array
        if (!Array.isArray(organisation.users)) {
            organisation.users = [];
        }

        // Check if the user is already in the organisation
        if (!organisation.users.includes(user.userId)) {
            organisation.users.push(user.userId);
            await organisation.save();
        }

        res.status(200).json({ status: 'success', message: 'User added to organisation successfully' });
    } catch (err) {
        console.error('Error adding user to organisation:', err);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

module.exports = {
    createOrganisation,
    getOrganisations,
    getOrganisationById,
    addUserToOrganisation
};
