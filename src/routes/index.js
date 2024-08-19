const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const userRoutes = require('./userRoutes');
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');

router.use('/v1/user', userRoutes);
router.use('/v1/category', categoryRoutes);
router.use('/v1/product', productRoutes);
router.post('/v1/user/token', userController.generateToken);

module.exports = router;
