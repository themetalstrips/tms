const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');

// GET settings
router.get('/settings', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT setting_key, setting_value FROM site_settings');
    const settings = {};
    rows.forEach(r => { settings[r.setting_key] = r.setting_value; });
    res.json(settings);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/settings', requireAuth, async (req, res) => {
  try {
    const { key, value } = req.body;
    await pool.query('INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?', [key, value, value]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET nav
router.get('/nav', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM nav_items ORDER BY display_order');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/nav', requireAuth, async (req, res) => {
  try {
    const { label, url, display_order, is_active, opens_new_tab } = req.body;
    await pool.query('INSERT INTO nav_items (label, url, display_order, is_active, opens_new_tab) VALUES (?, ?, ?, ?, ?)', 
      [label, url, display_order || 0, is_active ?? true, opens_new_tab ?? false]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/nav/reorder', requireAuth, async (req, res) => {
  try {
    const { order } = req.body;
    for (const item of order) {
      await pool.query('UPDATE nav_items SET display_order = ? WHERE id = ?', [item.display_order, item.id]);
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/nav/:id', requireAuth, async (req, res) => {
  try {
    const { label, url, display_order, is_active, opens_new_tab } = req.body;
    await pool.query('UPDATE nav_items SET label=?, url=?, display_order=?, is_active=?, opens_new_tab=? WHERE id=?', 
      [label, url, display_order, is_active, opens_new_tab, req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/nav/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM nav_items WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET homepage
router.get('/homepage', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT section_key, content_json FROM homepage_content');
    const sections = {};
    rows.forEach(r => { sections[r.section_key] = JSON.parse(r.content_json); });
    res.json(sections);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/homepage/:section_key', requireAuth, async (req, res) => {
  try {
    const content = JSON.stringify(req.body);
    await pool.query('INSERT INTO homepage_content (section_key, content_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE content_json = ?', [req.params.section_key, content, content]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET footer
router.get('/footer', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT section_key, content_json FROM footer_content');
    const sections = {};
    rows.forEach(r => { sections[r.section_key] = JSON.parse(r.content_json); });
    res.json(sections);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/footer/:section_key', requireAuth, async (req, res) => {
  try {
    const content = JSON.stringify(req.body);
    await pool.query('INSERT INTO footer_content (section_key, content_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE content_json = ?', [req.params.section_key, content, content]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET announcement
router.get('/announcement', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM announcement_bar LIMIT 1');
    res.json(rows.length > 0 ? rows[0] : null);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/announcement', requireAuth, async (req, res) => {
  try {
    const { message, is_active, bg_color, text_color } = req.body;
    await pool.query('UPDATE announcement_bar SET message=?, is_active=?, bg_color=?, text_color=?', [message, is_active, bg_color, text_color]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET kintsugi
router.get('/kintsugi', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT section_key, content_json FROM kintsugi_content');
    const sections = {};
    rows.forEach(r => { sections[r.section_key] = JSON.parse(r.content_json); });
    res.json(sections);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/kintsugi/:section_key', requireAuth, async (req, res) => {
  try {
    const content = JSON.stringify(req.body);
    await pool.query('INSERT INTO kintsugi_content (section_key, content_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE content_json = ?', [req.params.section_key, content, content]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
