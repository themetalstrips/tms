const mysql = require('mysql2/promise');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'metalstrips',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initDb() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  });
  
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'metalstrips'}\`;`);
  await connection.end();
  
  const db = await pool.getConnection();
  
  // Existing tables
  await db.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      kickstarter_url VARCHAR(500) NOT NULL,
      title VARCHAR(300) NOT NULL,
      creator VARCHAR(200),
      description TEXT,
      image_url VARCHAR(500),
      funding_goal DECIMAL(10,2),
      amount_raised DECIMAL(10,2),
      end_date VARCHAR(100),
      status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);
  
  await db.query(`
    CREATE TABLE IF NOT EXISTS reward_tiers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      title VARCHAR(300),
      price DECIMAL(10,2),
      description TEXT,
      delivery_date VARCHAR(100),
      backer_count INT DEFAULT 0,
      limit_total INT DEFAULT NULL,
      limit_remaining INT DEFAULT NULL,
      is_active BOOLEAN DEFAULT true,
      display_order INT DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);

  // New Content Tables
  await db.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      setting_key VARCHAR(100) NOT NULL UNIQUE,
      setting_value TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS nav_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      label VARCHAR(100) NOT NULL,
      url VARCHAR(300) NOT NULL,
      display_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      opens_new_tab BOOLEAN DEFAULT false
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS homepage_content (
      id INT AUTO_INCREMENT PRIMARY KEY,
      section_key VARCHAR(100) NOT NULL UNIQUE,
      content_json TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS footer_content (
      id INT AUTO_INCREMENT PRIMARY KEY,
      section_key VARCHAR(100) NOT NULL UNIQUE,
      content_json TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS kintsugi_content (
      id INT AUTO_INCREMENT PRIMARY KEY,
      section_key VARCHAR(100) NOT NULL UNIQUE,
      content_json TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS announcement_bar (
      id INT AUTO_INCREMENT PRIMARY KEY,
      message TEXT,
      is_active BOOLEAN DEFAULT false,
      bg_color VARCHAR(20) DEFAULT '#c9a227',
      text_color VARCHAR(20) DEFAULT '#000000',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  // Seeding
  
  // admin_users
  const [adminRows] = await db.query('SELECT * FROM admin_users LIMIT 1');
  if (adminRows.length === 0) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await db.query('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)', ['admin', passwordHash]);
  }

  // site_settings
  const [settingRows] = await db.query('SELECT * FROM site_settings LIMIT 1');
  if (settingRows.length === 0) {
    const defaults = [
      { setting_key: 'site_name', setting_value: 'The Metal Strips' },
      { setting_key: 'logo_url', setting_value: '' },
      { setting_key: 'primary_color', setting_value: '#c9a227' },
      { setting_key: 'secondary_color', setting_value: '#8b1a1a' },
      { setting_key: 'body_font', setting_value: 'DM Sans' },
      { setting_key: 'heading_font', setting_value: 'Cormorant Garamond' },
      { setting_key: 'favicon_url', setting_value: '' },
    ];
    for (const d of defaults) {
      await db.query('INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?)', [d.setting_key, d.setting_value]);
    }
  }

  // nav_items
  const [navRows] = await db.query('SELECT * FROM nav_items LIMIT 1');
  if (navRows.length === 0) {
    const navDefaults = [
      { label: 'Home', url: '/', display_order: 1 },
      { label: 'Shop', url: '/shop', display_order: 2 },
      { label: 'Kintsugi Knife', url: '/kintsugi-knife', display_order: 3 },
    ];
    for (const n of navDefaults) {
      await db.query('INSERT INTO nav_items (label, url, display_order) VALUES (?, ?, ?)', [n.label, n.url, n.display_order]);
    }
  }

  // homepage_content
  const [homeRows] = await db.query('SELECT * FROM homepage_content LIMIT 1');
  if (homeRows.length === 0) {
    const homeDefaults = [
      { section_key: 'hero', content_json: JSON.stringify({
          headline: 'Precision Forged. Artisan Finished.',
          subheadline: 'Premium knives where craft meets function.',
          cta_text: 'Shop Now',
          cta_url: '/shop',
          bg_image_url: ''
      })},
      { section_key: 'featured_banner', content_json: JSON.stringify({
          title: 'Featured: Kintsugi Knife',
          body: 'Where art meets precision in every slice.',
          cta_text: 'View Collection',
          cta_url: '/kintsugi-knife',
          image_url: ''
      })},
    ];
    for (const h of homeDefaults) {
      await db.query('INSERT INTO homepage_content (section_key, content_json) VALUES (?, ?)', [h.section_key, h.content_json]);
    }
  }

  // footer_content
  const [footerRows] = await db.query('SELECT * FROM footer_content LIMIT 1');
  if (footerRows.length === 0) {
    const footerDefaults = [
      { section_key: 'brand', content_json: JSON.stringify({
          tagline: 'Precision Forged. Artisan Finished.',
          copyright: '© 2025 The Metal Strips. All rights reserved.'
      })},
      { section_key: 'social', content_json: JSON.stringify({
          instagram: '',
          twitter: '',
          facebook: '',
          youtube: ''
      })},
      { section_key: 'links', content_json: JSON.stringify({
          columns: [
            { heading: 'Shop', links: [{ label: 'All Knives', url: '/shop' }, { label: 'Kintsugi Knife', url: '/kintsugi-knife' }] },
            { heading: 'Info', links: [{ label: 'About', url: '/about' }, { label: 'Contact', url: '/contact' }] },
          ]
      })},
    ];
    for (const f of footerDefaults) {
      await db.query('INSERT INTO footer_content (section_key, content_json) VALUES (?, ?)', [f.section_key, f.content_json]);
    }
  }

  // announcement_bar
  const [announcementRows] = await db.query('SELECT * FROM announcement_bar LIMIT 1');
  if (announcementRows.length === 0) {
    await db.query("INSERT INTO announcement_bar (message, is_active, bg_color, text_color) VALUES ('Free worldwide shipping on all orders', false, '#c9a227', '#000000')");
  }

  // kintsugi_content
  const [kintsugiRows] = await db.query('SELECT * FROM kintsugi_content LIMIT 1');
  if (kintsugiRows.length === 0) {
    const kintsugiDefaults = [
      { section_key: 'hero', content_json: JSON.stringify({
          headline: 'Where Art Meets Precision in Every Slice',
          subheadline: 'Inspired by the Japanese art of Kintsugi — beauty through imperfection.',
          badge1: 'Lifetime Guarantee', badge2: 'Free Worldwide Shipping', badge3: 'Each Knife Unique'
      })},
      { section_key: 'story', content_json: JSON.stringify({
          heading: 'The Philosophy of Kintsugi',
          body: 'Kintsugi (金継ぎ) is the centuries-old Japanese art of repairing broken ceramics with gold lacquer — turning damage into beauty. We applied this philosophy to steel.'
      })},
      { section_key: 'specs', content_json: JSON.stringify({ rows: [
          { label: 'Blade Material', value: 'High-Carbon German Steel (X50CrMoV15)' },
          { label: 'Blade Length', value: '8 inches (20 cm)' },
          { label: 'Hardness', value: '58 HRC Rockwell' },
          { label: 'Gold Veining', value: '24K gold-fill inlay, hand-applied' },
          { label: 'Handle Options', value: 'FSC-certified Walnut or African Ebony' },
          { label: 'Edge Angle', value: '15° per side' },
          { label: 'Weight', value: '~220g Chef / ~185g Santoku' },
      ]})},
      { section_key: 'faqs', content_json: JSON.stringify({ items: [
          { q: 'Is each knife truly unique?', a: 'Yes. The 24K gold vein pattern is hand-applied. No two knives are identical.' },
          { q: 'Is it dishwasher safe?', a: 'Hand-wash only. Dishwashers dull the blade and damage the gold veins.' },
          { q: 'When will my order ship?', a: 'Orders ship within 7–14 business days.' },
      ]})},
    ];
    for (const k of kintsugiDefaults) {
      await db.query('INSERT INTO kintsugi_content (section_key, content_json) VALUES (?, ?)', [k.section_key, k.content_json]);
    }
  }

  db.release();
  console.log("Database connected and schema initialized");
}

module.exports = { pool, initDb };
