const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken } = require('../controllers/categoryController');

router.get('/v1/category/search', categoryController.getCategories);
router.get('/v1/category/:id', categoryController.getCategoryById);
router.post('/v1/category', authenticateToken ,categoryController.createCategory);
router.put('/v1/category/:id', authenticateToken ,categoryController.updateCategory);
router.delete('/v1/category/:id', authenticateToken ,categoryController.deleteCategory);

module.exports = router;
