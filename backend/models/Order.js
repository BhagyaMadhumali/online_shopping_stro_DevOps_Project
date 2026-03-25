const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  date: { type: Date, default: Date.now },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      productName: String,
      img: String,
      size: String,
      quantity: Number,
      price: Number,
    }
  ],
  address: {
    no: String,
    street: String,
    city: String,
    province: String,
  },
  phone1: String,
  phone2: String,
  status: { type: String, default: "Unread" }, // 👈 added
});

module.exports = mongoose.model('Order', orderSchema);
