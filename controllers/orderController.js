const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// Generar código automático (PED-000X)
const generateOrderCode = async () => {
  const count = await Order.countDocuments();
  const code = String(count + 1).padStart(4, '0');
  return `PED-${code}`;
};

// Crear pedido
const createOrder = async (req, res) => {
  try {
    const { clientData, products } = req.body;

    const orderCode = await generateOrderCode();

    // Validación de stock
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `No hay stock suficiente para ${product.name}`
        });
      }
    }

    // Resta de stock
    for (const item of products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.quantity },
      });
    }

    // Calcular total
    const total = products.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const newOrder = new Order({
      orderCode,
      clientData,
      products,
      total,
    });

    await newOrder.save();

    res.status(201).json({
      message: "Pedido registrado correctamente",
      order: newOrder,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al registrar el pedido" });
  }
};

//  obtener pedidos
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("products.product");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener pedidos" });
  }
};

module.exports = { createOrder, getOrders };
