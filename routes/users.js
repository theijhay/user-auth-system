const express = require('express');
const router = express.Router();
const { getUserById } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:id', authMiddleware, getUserById);

module.exports = router;
