const express = require('express');
const router = express.Router();
const {
    createOrganisation,
    getOrganisations,
    getOrganisationById,
    addUserToOrganisation
} = require('../controllers/orgController');
const { check, validationResult } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const errorHandler = require('../middlewares/errorHandler');
router.post('/:orgId/users', authMiddleware, addUserToOrganisation);

router.post(
    '/',
    [
        check('name', 'Name is required').not().isEmpty()
    ],
    authMiddleware,
    errorHandler,
    createOrganisation
);

router.get('/', authMiddleware, getOrganisations);
router.get('/:orgId', authMiddleware, getOrganisationById);

router.post(
    '/:orgId/users',
    [
        check('userId', 'User ID is required').not().isEmpty()
    ],
    authMiddleware,
    errorHandler,
    addUserToOrganisation
);

module.exports = router;
