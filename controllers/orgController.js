const Organisation = require('../models/Organisation');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');

const createOrganisation = async (req, res) => {
    const { name, description } = req.body;

    try {
        const org = new Organisation({
            orgId: uuidv4(),
            name,
            description,
            users: [req.user.id]
        });

        const savedOrg = await org.save();

        res.status(201).json({
            status: 'success',
            message: 'Organisation created successfully',
            data: {
                orgId: savedOrg.orgId,
                name: savedOrg.name,
                description: savedOrg.description
            }
        });
    } catch (err) {
        res.status(400).json({ status: 'Bad Request', message: 'Client error', statusCode: 400 });
    }
};

const getOrganisations = async (req, res) => {
    try {
        const organisations = await Organisation.find({ users: req.user.id });

        res.status(200).json({
            status: 'success',
            message: 'Organisations fetched successfully',
            data: {
                organisations: organisations.map(org => ({
                    orgId: org.orgId,
                    name: org.name,
                    description: org.description
                }))
            }
        });
    } catch (err) {
        res.status(400).json({ status: 'Bad Request', message: 'Client error', statusCode: 400 });
    }
};

const getOrganisationById = async (req, res) => {
    try {
        const organisation = await Organisation.findOne({ orgId: req.params.orgId, users: req.user.id });

        if (!organisation) {
            return res.status(404).json({ status: 'Bad Request', message: 'Organisation not found', statusCode: 404 });
        }

        res.status(200).json({
            status: 'success',
            message: 'Organisation fetched successfully',
            data: {
                orgId: organisation.orgId,
                name: organisation.name,
                description: organisation.description
            }
        });
    } catch (err) {
        res.status(400).json({ status: 'Bad Request', message: 'Client error', statusCode: 400 });
    }
};

const addUserToOrganisation = async (req, res) => {
    const { orgId } = req.params;
    const { userId } = req.body;

    try {
        const organisation = await Organisation.findOne({ orgId });
        if (!organisation) {
            return res.status(404).json({ status: 'Bad Request', message: 'Organisation not found', statusCode: 404 });
        }

        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ status: 'Bad Request', message: 'User not found', statusCode: 404 });
        }

        if (!organisation.users.includes(user._id)) {
            organisation.users.push(user._id);
            await organisation.save();
        }

        res.status(200).json({ status: 'success', message: 'User added to organisation successfully' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

module.exports = {
    createOrganisation,
    getOrganisations,
    getOrganisationById,
    addUserToOrganisation
};
