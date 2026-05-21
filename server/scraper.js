const puppeteer = require('puppeteer');

async function scrapeKickstarter(url) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Check if it's a valid project page
    const titleSelector = 'h2, .project-profile__title, [data-test-id="project-name"]';
    await page.waitForSelector(titleSelector, { timeout: 10000 });

    const data = await page.evaluate(() => {
      const getText = (selector) => {
        const el = document.querySelector(selector);
        return el ? el.innerText.trim() : null;
      };

      const title = getText('h2') || getText('.project-profile__title') || getText('[data-test-id="project-name"]') || '';
      const creator = getText('.creator-name') || getText('[data-test-id="creator-name"]') || '';
      const blurb = getText('.project-profile__blurb') || getText('p.type-14.type-18-md.line-height-15') || '';
      const description = getText('#react-project-description') || getText('[data-component="project-description"]') || '';
      
      const imageEl = document.querySelector('.project-profile__video img') || document.querySelector('img.aspect-ratio--object') || document.querySelector('img.js-project-cover-image');
      const imageUrl = imageEl ? imageEl.src : '';

      const fundingGoal = getText('.money.goal') || '';
      const amountRaised = getText('.money.pledged') || getText('.js-pledged') || '';
      const endDate = getText('.js-num-days') || getText('span[data-test-id="time-left"]') || '';

      const rewards = [];
      const rewardElements = document.querySelectorAll('.pledge__info, .reward-card, .js-reward-card');
      
      rewardElements.forEach((el, index) => {
        const rTitle = el.querySelector('.pledge__title, h3, h2.pledge__title') ? el.querySelector('.pledge__title, h3, h2.pledge__title').innerText.trim() : `Tier ${index + 1}`;
        const rPriceText = el.querySelector('.pledge__amount, .money') ? el.querySelector('.pledge__amount, .money').innerText.replace(/[^0-9.]/g, '') : '0';
        const rPrice = parseFloat(rPriceText) || 0;
        const rDesc = el.querySelector('.pledge__reward-description, .reward-description, .pledge__details') ? el.querySelector('.pledge__reward-description, .reward-description, .pledge__details').innerText.trim() : '';
        const rDelivery = el.querySelector('.pledge__extra-info .pledge__detail, .delivery-date, .pledge__delivery') ? el.querySelector('.pledge__extra-info .pledge__detail, .delivery-date, .pledge__delivery').innerText.replace(/Estimated delivery/i, '').trim() : '';
        const rBackerCount = el.querySelector('.pledge__backer-count, .backers-count, .pledge__backers') ? parseInt(el.querySelector('.pledge__backer-count, .backers-count, .pledge__backers').innerText.replace(/[^0-9]/g, '')) || 0 : 0;
        const rLimit = el.querySelector('.pledge__limit, .limit') ? el.querySelector('.pledge__limit, .limit').innerText.trim() : null;
        
        let limitRemaining = null;
        let limitTotal = null;
        if (rLimit) {
          const match = rLimit.match(/(\d+)\s+left\s+of\s+(\d+)/i);
          if (match) {
            limitRemaining = parseInt(match[1]);
            limitTotal = parseInt(match[2]);
          } else {
            const leftMatch = rLimit.match(/Limited\s+\((\d+)\s+left\)/i) || rLimit.match(/(\d+)\s+left/i);
            if (leftMatch) {
              limitRemaining = parseInt(leftMatch[1]);
            }
          }
        }

        rewards.push({
          title: rTitle,
          price: rPrice,
          description: rDesc,
          delivery_date: rDelivery,
          backer_count: rBackerCount,
          limit_remaining: limitRemaining,
          limit_total: limitTotal
        });
      });

      return {
        title,
        creator,
        description: description || blurb,
        imageUrl,
        fundingGoal: parseFloat(fundingGoal.replace(/[^0-9.]/g, '')) || null,
        amountRaised: parseFloat(amountRaised.replace(/[^0-9.]/g, '')) || null,
        endDate,
        rewards
      };
    });

    await browser.close();
    return data;
  } catch (error) {
    await browser.close();
    throw new Error(`Scraper failed: ${error.message}`);
  }
}

module.exports = { scrapeKickstarter };
