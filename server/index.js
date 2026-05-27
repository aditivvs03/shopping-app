const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');

const app  = express();
const PORT = 3001;
const MONGO_URI = 'mongodb://localhost:27017/shoppingDB';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// ── Schema ──────────────────────────────────────────────
const productSchema = new mongoose.Schema({
  product_name:        { type: String, required: true },
  product_description: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema);

// ── Seed default products if collection empty ────────────
async function seedIfEmpty() {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      { product_name: 'Wireless Headphones',  product_description: 'Noise-cancelling headphones with 30hr battery life.' },
      { product_name: 'Running Shoes',         product_description: 'Lightweight breathable shoes for long-distance running.' },
      { product_name: 'Smartwatch',            product_description: 'Track fitness and notifications on your wrist.' },
      { product_name: 'Backpack',              product_description: '30L backpack with laptop compartment and USB port.' },
      { product_name: 'Sunglasses',            product_description: 'UV400 polarized lenses with sleek matte frame.' }
    ]);
    console.log('Seeded default products.');
  }
}

// ── Connect ──────────────────────────────────────────────
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await seedIfEmpty();
  })
  .catch(err => console.error('MongoDB error:', err));

// ── ROUTES ───────────────────────────────────────────────

// GET all
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST add
app.post('/api/products', async (req, res) => {
  const { product_name, product_description } = req.body;
  if (!product_name || !product_description)
    return res.status(400).json({ error: 'Both fields required' });
  try {
    const p = await Product.create({ product_name, product_description });
    res.status(201).json(p);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT update
app.put('/api/products/:id', async (req, res) => {
  const { product_name, product_description } = req.body;
  if (!product_name || !product_description)
    return res.status(400).json({ error: 'Both fields required' });
  try {
    const p = await Product.findByIdAndUpdate(
      req.params.id,
      { product_name, product_description },
      { new: true }
    );
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json(p);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE
app.delete('/api/products/:id', async (req, res) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
