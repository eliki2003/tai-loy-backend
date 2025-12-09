// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const {
  generateOrderReport,
  generateLowStockReport,
  generateSupplierReport,
  generateFinancialReport,
  generateMostRequestedProductsReport,
} = require('../controllers/reportController');

// Rutas para los diferentes tipos de reportes
router.get('/pedidos', generateOrderReport);
router.get('/productos-bajo-stock', generateLowStockReport); // Esta ruta debe estar configurada correctamente.
router.get('/productos-mas-solicitados', generateMostRequestedProductsReport);
router.get('/proveedores', generateSupplierReport);
router.get('/financiero', generateFinancialReport);

module.exports = router;
