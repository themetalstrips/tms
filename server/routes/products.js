const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    
    // Get all reward tiers
    const [rewards] = await pool.query('SELECT * FROM reward_tiers');
    
    // Attach rewards to products
    const productsWithRewards = products.map(product => ({
      ...product,
      reward_tiers: rewards.filter(r => r.product_id === product.id)
    }));

    res.json(productsWithRewards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (products.length === 0) return res.status(404).json({ error: 'Product not found' });
    
    const [rewards] = await pool.query('SELECT * FROM reward_tiers WHERE product_id = ?', [req.params.id]);
    
    res.json({
      ...products[0],
      reward_tiers: rewards
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/products/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, description, image_url, status } = req.body;
    await pool.query(
      'UPDATE products SET title = ?, description = ?, image_url = ?, status = ? WHERE id = ?',
      [title, description, image_url, status, req.params.id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/products/:id/rewards/:rewardId
router.put('/:id/rewards/:rewardId', async (req, res) => {
  try {
    const { title, price, is_active } = req.body;
    await pool.query(
      'UPDATE reward_tiers SET title = ?, price = ?, is_active = ? WHERE id = ? AND product_id = ?',
      [title, price, is_active, req.params.rewardId, req.params.id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/products/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE products SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    // cascades down to reward_tiers because of ON DELETE CASCADE
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
