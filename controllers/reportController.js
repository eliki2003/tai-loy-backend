// controllers/reportController.js
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// Generar reporte de pedidos (resumen de ventas por fecha)
const generateOrderReport = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      { $group: { _id: "$date", total: { $sum: "$total" } } },  // Agrupar por fecha y sumar el total
      { $sort: { _id: 1 } }  // Ordenar por fecha ascendente
    ]);
    res.json(orders);  // Devolver los datos de los pedidos
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el reporte de pedidos' });
  }
};

// Backend: Función para agrupar productos por categoría
const generateLowStockReport = async (req, res) => {
  try {
    // Obtener productos con cantidad de stock menor o igual a 50
    const products = await Product.find({ quantity: { $lte: 50 } });

    // Verificar si se encontraron productos
    if (products.length === 0) {
      return res.status(404).json({ message: "No hay productos con stock bajo" });
    }

    // Agrupar los productos por categoría
    const categorizedProducts = products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {});

    // Enviar los productos agrupados por categorías al frontend
    res.json(categorizedProducts);
  } catch (error) {
    console.error("Error al obtener los productos con bajo stock", error);
    res.status(500).json({ message: 'Error al obtener los productos con bajo stock' });
  }
};


// Generar reporte de productos más solicitados (productos más vendidos por categoría)
const generateMostRequestedProductsReport = async (req, res) => {
  try {
    const products = await Order.aggregate([
      { $unwind: "$products" },
      { 
        $lookup: { 
          from: 'products',
          localField: 'products.product', 
          foreignField: '_id', 
          as: 'productInfo' 
        } 
      },
      { $unwind: "$productInfo" },
      { 
        $group: { 
          _id: { 
            productId: "$products.product", 
            productName: "$productInfo.name",  // Extraemos el nombre del producto
            category: "$productInfo.category" 
          }, 
          totalSold: { $sum: "$products.quantity" }
        } 
      },
      { $sort: { totalSold: -1 } }
    ]);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el reporte de productos más solicitados' });
  }
};

// Generar reporte de proveedores (proporción de productos por proveedor)
const generateSupplierReport = async (req, res) => {
  try {
    const suppliers = await Product.aggregate([
      { $group: { _id: "$supplier", totalProducts: { $sum: 1 } } },  // Agrupar por proveedor y contar productos
    ]);
    res.json(suppliers);  // Devolver los productos por proveedor
  } catch (error) {
    console.error('Error al obtener el reporte de proveedores', error);
    res.status(500).json({ message: 'Error al obtener el reporte de proveedores' });
  }
};

// Controlador para generar el reporte financiero
const generateFinancialReport = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      { 
        $group: {
          _id: { $month: "$date" },  // Agrupar por mes
          totalSales: { $sum: "$total" }  // Sumar las ventas totales por mes
        }
      },
      { $sort: { _id: 1 } }  // Ordenar por mes ascendente
    ]);
    
    if (sales.length === 0) {
      return res.status(404).json({ message: "No hay datos de ventas disponibles" });
    }
    
    res.json(sales);  // Devolver los datos de ventas por mes
  } catch (error) {
    console.error('Error al obtener los datos de ventas', error);
    res.status(500).json({ message: 'Error al obtener el reporte financiero' });
  }
};

module.exports = {
  generateOrderReport,
  generateLowStockReport,
  generateSupplierReport,
  generateFinancialReport,
  generateMostRequestedProductsReport
};
