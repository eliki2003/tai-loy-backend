const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  supplier: { type: String, required: true },
  image: { type: String, required: true },  // URL de la imagen cargada
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
