const express = require('express');
const router = express.Router();

const { createOrder, getOrders } = require('../controllers/orderController');

// Crear pedido (POST)
router.post('/', createOrder);

// Obtener pedidos (GET)
router.get('/', getOrders);

module.exports = router;
