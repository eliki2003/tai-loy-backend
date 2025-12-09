const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload'); 
const { receptionProduct, updateProduct, deleteProduct, getProducts, getProductById } = require('../controllers/productController');

// Registrar un producto (con imagen)
router.post('/reception', upload.single('image'), receptionProduct);

// Obtener todos los productos
router.get('/', getProducts);  // Dirección al controlador

// Obtener un producto por ID
router.get('/:id', getProductById);  // Esto debería estar correcto

// Actualizar un producto (PUT)
router.put('/:id', updateProduct);  // Dirección al controlador

// Eliminar un producto (DELETE)
router.delete('/:id', deleteProduct);  // Dirección al controlador

module.exports = router;
