// orderModel.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderCode: { type: String, required: true, unique: true },
  clientData: {
    name: { type: String, required: true },
    dni: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
  },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },

  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
