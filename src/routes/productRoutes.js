const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/v1/product/search', productController.getProducts);
router.get('/v1/product/:id', productController.getProductById);
router.post('/v1/product', authenticateToken ,productController.createProduct);
router.put('/v1/product/:id', authenticateToken ,productController.updateProduct);
router.delete('/v1/product/:id', authenticateToken ,productController.deleteProduct);

module.exports = router;
