const Product = require('../models/productModel');

// Registrar un producto (con imagen)
const receptionProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se recibió ninguna imagen" });
    }

    const { name, category, quantity, price, supplier } = req.body;
    
    const newProduct = new Product({
      name,
      category,
      quantity,
      price,
      supplier,
      image: `/uploads/${req.file.filename}`// URL de la imagen subida
    });

    await newProduct.save();

    res.status(201).json({
      message: "Producto registrado correctamente",
      product: newProduct
    });

  } catch (error) {
    console.log("ERROR EN CONTROLADOR:", error);  
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

// Obtener todos los productos (GET)
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();  // Consulta todos los productos
    res.json(products);  // Devuelve los productos como respuesta
  } catch (error) {
    console.error('Error al obtener los productos', error);
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
};

// Actualizar un producto (PUT)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;  // Este es el ID que se pasa desde la URL
    const { quantity, price } = req.body;

    // Asegúrate de que el id es válido
    if (!id) {
      return res.status(400).json({ message: 'ID del producto no proporcionado' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { quantity, price },  // Actualizamos cantidad y precio
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error al actualizar el producto', error);
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
};


// Eliminar un producto (DELETE)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;  // Obtener el id del producto de la URL

    // Buscar el producto y eliminarlo
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el producto', error);
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
};

// Controlador para obtener un producto por ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  console.log("ID recibido: ", id);  // Verifica que se reciba el ID

  try {
    const product = await Product.findById(id);  // Busca el producto en la base de datos
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);  // Devuelve el producto como respuesta
  } catch (error) {
    console.error('Error al obtener el producto', error);
    res.status(500).json({ message: 'Error al obtener el producto' });
  }
};

module.exports = { receptionProduct, getProducts, updateProduct, deleteProduct, getProductById  };
