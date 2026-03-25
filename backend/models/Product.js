const mongoose = require('mongoose');

const SizeSchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const ProductSchema = new mongoose.Schema({
  category: { type: String, required: true },
  productName: { type: String, required: true },
  images: [{ type: String, required: true }],
  sizes: {
    S: { type: SizeSchema, required: false },
    M: { type: SizeSchema, required: false },
    L: { type: SizeSchema, required: false },
    XL: { type: SizeSchema, required: false },
    '2XL': { type: SizeSchema, required: false },
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
