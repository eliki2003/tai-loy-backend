const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Ruta para registrar un usuario
router.post('/register', userController.registerUser);

// Ruta para iniciar sesión
router.post('/login', userController.loginUser);

// Ruta protegida para obtener los datos del usuario autenticado
router.get('/me', authMiddleware, userController.getUserData);

// Ruta para actualizar los datos del usuario
router.put('/update/:id', authMiddleware, userController.updateUser);

module.exports = router;
