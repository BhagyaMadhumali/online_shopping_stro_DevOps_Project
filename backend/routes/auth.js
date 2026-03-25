 require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const User = require('../models/User');
const Admin = require('../models/Admin');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const middle = require('../middlewares/middle');

const JWT_SECRET = process.env.JWT_SECRET || 'yourSuperSecretKeyHere123!';

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// -------- AUTH ROUTES --------

// Register user
router.post('/register', async (req, res) => {
  const { first, last, email, password } = req.body;
  if (!first || !last || !email || !password) {
    return res.status(400).json({ message: 'Please enter all required fields.' });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'User already exists.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ first, last, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// User login
router.post('/login/user', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Please enter all required fields.' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password.' });

    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    res.json({ 
      message: 'User login successful.',
      token,
      user: { _id: user._id, first: user.first, last: user.last, email: user.email }
    });
  } catch (err) {
    console.error('User login error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Admin login
router.post('/login/admin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Please enter all required fields.' });

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password.' });

    const payload = { id: admin._id, email: admin.email, role: 'admin' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'Admin login successful.',
      token,
      admin: { _id: admin._id, email: admin.email }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// -------- PRODUCT ROUTES --------

// Add product
router.post('/products/add', upload.array('images', 5), async (req, res) => {
  try {
    const { category, productName, sizes } = req.body;
    if (!category || !productName || !req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Category, productName, and at least one image are required.' });
    }

    let parsedSizes;
    try {
      parsedSizes = JSON.parse(sizes);
    } catch {
      return res.status(400).json({ message: 'Invalid sizes format.' });
    }

    for (const size in parsedSizes) {
      const qty = Number(parsedSizes[size].quantity);
      const price = Number(parsedSizes[size].price);
      if (!qty || !price) {
        delete parsedSizes[size];
      } else {
        parsedSizes[size].quantity = qty;
        parsedSizes[size].price = price;
      }
    }

    if (Object.keys(parsedSizes).length === 0) {
      return res.status(400).json({ message: 'At least one valid size with quantity and price is required.' });
    }

    const imagePaths = req.files.map(file => file.filename);

    const product = new Product({
      category,
      productName,
      images: imagePaths,
      sizes: parsedSizes,
    });

    await product.save();
    res.status(201).json({ message: 'Product added successfully.' });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (err) {
    console.error('Get product error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update product
router.put('/products/:id', upload.array('images', 5), async (req, res) => {
  try {
    const { category, productName, sizes, existingImages } = req.body;
    if (!category || !productName) {
      return res.status(400).json({ message: 'Category and productName are required.' });
    }

    let parsedSizes;
    try {
      parsedSizes = JSON.parse(sizes);
    } catch {
      return res.status(400).json({ message: 'Invalid sizes format.' });
    }

    for (const size in parsedSizes) {
      const qty = Number(parsedSizes[size].quantity);
      const price = Number(parsedSizes[size].price);
      if (!qty || !price) {
        delete parsedSizes[size];
      } else {
        parsedSizes[size].quantity = qty;
        parsedSizes[size].price = price;
      }
    }

    if (Object.keys(parsedSizes).length === 0) {
      return res.status(400).json({ message: 'At least one valid size with quantity and price is required.' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    product.category = category;
    product.productName = productName;
    product.sizes = parsedSizes;

    if (existingImages) {
      try {
        product.images = JSON.parse(existingImages);
      } catch {
        product.images = product.images || [];
      }
    }

    if (req.files && req.files.length > 0) {
      const newImageFiles = req.files.map(file => file.filename);
      product.images = [...product.images, ...newImageFiles];
    }

    await product.save();
    res.json({ message: 'Product updated successfully.', product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// -------- CART ROUTES --------

// Add to cart
router.post('/cart/add', middle, async (req, res) => {
  try {
    const { productId, productName, size, quantity, price } = req.body;
    const userId = req.user.id;

    if (!productId || !productName || !size || !quantity || !price) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const cartItem = new Cart({
      productId,
      productName,
      size,
      quantity,
      price,
      userId,
      addedAt: new Date()
    });

    await cartItem.save();

    return res.status(201).json({ message: 'Added to cart successfully', cartItem });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get cart items
router.get('/cart/items', middle, async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await Cart.find({ userId }).populate('productId', 'productName images');

    const formattedItems = cartItems.map(item => {
      const prod = item.productId;
      return {
        id: item._id,
        productId: prod?._id || null,
        productName: prod ? prod.productName : item.productName,
        img: prod && prod.images && prod.images.length > 0
          ? `http://localhost:5000/uploads/${prod.images[0]}`
          : '/placeholder.jpg',
        size: item.size,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      };
    });

    res.json(formattedItems);
  } catch (error) {
    console.error('Get cart items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete cart item
router.delete('/cart/:id', middle, async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItem = await Cart.findOneAndDelete({ _id: req.params.id, userId });
    if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });
    res.json({ message: 'Cart item removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update cart item
router.put('/cart/:id', middle, async (req, res) => {
  try {
    const { size, quantity, price } = req.body;
    const userId = req.user.id;
    const cartItem = await Cart.findOne({ _id: req.params.id, userId });
    if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });

    if (size) cartItem.size = size;
    if (quantity) cartItem.quantity = quantity;
    if (price) cartItem.price = price;

    await cartItem.save();

    res.json({ message: 'Cart item updated successfully', cartItem });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// -------- ORDER ROUTES --------

// Place an order (store user info)
router.post('/order/place', middle, async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, address, phone1, phone2 } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order.' });
    }

    const user = await User.findById(userId);

    const newOrder = new Order({
      userId,
      userName: user ? `${user.first} ${user.last}` : "Unknown",
      userEmail: user ? user.email : "",
      items,
      address,
      phone1,
      phone2,
      status: "Unread"
    });

    await newOrder.save();

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's own orders
router.get('/order/myorders', middle, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).sort({ date: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders (admin only)
router.get('/order/all', middle, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (optional)
router.patch('/order/:id/status', middle, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status || order.status;
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;  