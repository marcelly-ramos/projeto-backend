const express = require('express');
const router = express.Router();
const { getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');
const { getProducts } = require('../controllers/productController');


// Endpoint para obter informações do usuário pelo ID
router.get('/v1/user/:id', getUserById);
router.post('/v1/user', createUser); // cadastro pode ser publico
router.put('/v1/user/:id', authenticateToken, updateUser);
router.delete('/v1/user/:id', authenticateToken, deleteUser);

module.exports = router;
