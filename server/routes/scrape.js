const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { scrapeKickstarter } = require('../scraper');

router.post('/', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || !url.startsWith('https://www.kickstarter.com/projects/')) {
      return res.status(400).json({ success: false, error: 'Valid Kickstarter URL is required' });
    }

    const data = await scrapeKickstarter(url);

    const db = await pool.getConnection();
    try {
      await db.beginTransaction();
      
      const [productResult] = await db.query(
        `INSERT INTO products (kickstarter_url, title, creator, description, image_url, funding_goal, amount_raised, end_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [url, data.title, data.creator, data.description, data.imageUrl, data.fundingGoal, data.amountRaised, data.endDate]
      );
      
      const productId = productResult.insertId;

      if (data.rewards && data.rewards.length > 0) {
        for (const reward of data.rewards) {
          await db.query(
            `INSERT INTO reward_tiers (product_id, title, price, description, delivery_date, backer_count, limit_total, limit_remaining)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [productId, reward.title, reward.price, reward.description, reward.delivery_date, reward.backer_count, reward.limit_total, reward.limit_remaining]
          );
        }
      }

      await db.commit();
      res.json({ success: true, productId, data });
    } catch (err) {
      await db.rollback();
      throw err;
    } finally {
      db.release();
    }

  } catch (error) {
    console.error('Scrape error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
