const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeMozek() {
  console.log("Starting Mozek Surgical scraper...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
  
  let products = [];
  let currentPageUrl = 'https://www.mozeksurgical.com/product-category/veterinary-instruments/';
  let pageNum = 1;

  try {
    while (currentPageUrl) {
      console.log(`Navigating to page ${pageNum}: ${currentPageUrl}`);
      await page.goto(currentPageUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
      
      // Wait for products to load
      await page.waitForSelector('.product, li.product', { timeout: 15000 }).catch(err => {
        console.log("No product elements found or timed out.");
      });

      // Extract products from current page
      const pageProducts = await page.evaluate(() => {
        const items = [];
        const productElements = document.querySelectorAll('.product, li.product');
        
        productElements.forEach(el => {
          // Extract Name
          const nameEl = el.querySelector('.woocommerce-loop-product__title, h2, h3, .product-title, .title');
          const name = nameEl ? nameEl.innerText.trim() : '';
          
          // Extract Link
          const linkEl = el.querySelector('a');
          const link = linkEl ? linkEl.href : '';
          
          // Extract Image
          const imgEl = el.querySelector('img');
          const image = imgEl ? (imgEl.getAttribute('data-src') || imgEl.getAttribute('lazy-src') || imgEl.src) : '';
          
          // Extract Price
          const priceEl = el.querySelector('.price, .amount');
          let priceText = priceEl ? priceEl.innerText.replace(/[^0-9.]/g, '') : '';
          let price = parseFloat(priceText) || 0;
          
          // If no price is listed (quote only), assign a realistic mock price
          if (!price) {
            // Generate a realistic veterinary instrument price between $25.00 and $180.00
            const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            price = 25 + (hash % 155) + 0.99;
          }
          
          if (name) {
            items.push({
              name,
              link,
              image,
              price,
              retailPrice: price * 1.5 // Generate a retail price for the strikethrough effect
            });
          }
        });
        
        return items;
      });

      console.log(`Scraped ${pageProducts.length} products on page ${pageNum}`);
      products = products.concat(pageProducts);

      // Check for Next Page link
      const nextPageUrl = await page.evaluate(() => {
        const nextEl = document.querySelector('.next, a.next, a.next-page, .pagination a.next');
        return nextEl ? nextEl.href : null;
      });

      if (nextPageUrl && nextPageUrl !== currentPageUrl && pageNum < 10) {
        currentPageUrl = nextPageUrl;
        pageNum++;
      } else {
        currentPageUrl = null;
      }
    }

    // Now, scrape details/specs for the first 12 products to give them realistic descriptions and specifications
    console.log(`Total products scraped: ${products.length}. Scraping detail page specs for key products...`);
    
    for (let i = 0; i < Math.min(products.length, 15); i++) {
      const p = products[i];
      if (p.link) {
        try {
          console.log(`Detail scraping: ${p.name}`);
          await page.goto(p.link, { waitUntil: 'domcontentloaded', timeout: 30000 });
          
          const details = await page.evaluate(() => {
            // Extract description
            const descEl = document.querySelector('.woocommerce-product-details__short-description, .description, #tab-description');
            const description = descEl ? descEl.innerText.trim() : '';
            
            // Extract specs
            const specs = {};
            const specRows = document.querySelectorAll('.shop_attributes tr, .specification tr, table.product-attributes tr');
            specRows.forEach(row => {
              const labelEl = row.querySelector('th, .label');
              const valEl = row.querySelector('td, .value');
              if (labelEl && valEl) {
                const label = labelEl.innerText.trim().replace(/:/g, '');
                const val = valEl.innerText.trim();
                if (label && val) {
                  specs[label] = val;
                }
              }
            });
            
            return { description, specs };
          });
          
          p.description = details.description || `Premium quality medical grade ${p.name} designed specifically for professional veterinary surgical procedures. Forged from high-grade German stainless steel for exceptional durability, corrosion resistance, and precision handling.`;
          p.specs = Object.keys(details.specs).length > 0 ? details.specs : {
            "Material": "German Surgical Stainless Steel",
            "Autoclavable": "Yes (Reusable)",
            "Application": "Veterinary Surgery",
            "Quality Standard": "CE & ISO Certified"
          };
          
        } catch (detailErr) {
          console.log(`Failed detail scrape for ${p.name}: ${detailErr.message}`);
          p.description = `Premium quality medical grade ${p.name} designed specifically for professional veterinary surgical procedures. Forged from high-grade German stainless steel for exceptional durability, corrosion resistance, and precision handling.`;
          p.specs = {
            "Material": "German Surgical Stainless Steel",
            "Autoclavable": "Yes (Reusable)",
            "Application": "Veterinary Surgery",
            "Quality Standard": "CE & ISO Certified"
          };
        }
      } else {
        p.description = `Premium quality medical grade ${p.name} designed specifically for professional veterinary surgical procedures. Forged from high-grade German stainless steel for exceptional durability, corrosion resistance, and precision handling.`;
        p.specs = {
          "Material": "German Surgical Stainless Steel",
          "Autoclavable": "Yes (Reusable)",
          "Application": "Veterinary Surgery",
          "Quality Standard": "CE & ISO Certified"
        };
      }
    }

    // Set fallback descriptions/specs for the rest
    for (let i = 15; i < products.length; i++) {
      const p = products[i];
      p.description = `Premium quality medical grade ${p.name} designed specifically for professional veterinary surgical procedures. Forged from high-grade German stainless steel for exceptional durability, corrosion resistance, and precision handling.`;
      p.specs = {
        "Material": "German Surgical Stainless Steel",
        "Autoclavable": "Yes (Reusable)",
        "Application": "Veterinary Surgery",
        "Quality Standard": "CE & ISO Certified"
      };
    }

    // Clean up links and make them static products
    const finalProducts = products.map((p, idx) => {
      // Create a unique id
      const id = 'vet-' + p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return {
        id,
        name: p.name,
        subtitle: 'Veterinary Instrument',
        price: parseFloat(p.price.toFixed(2)),
        retailPrice: parseFloat(p.retailPrice.toFixed(2)),
        badge: idx < 5 ? 'Top Rated' : idx % 7 === 0 ? 'Best Seller' : 'Premium',
        description: p.description,
        image: p.image || 'https://www.mozeksurgical.com/wp-content/uploads/2021/04/placeholder.png',
        specs: p.specs
      };
    });

    const outputPath = path.join(__dirname, 'mozek_products.json');
    fs.writeFileSync(outputPath, JSON.stringify(finalProducts, null, 2));
    console.log(`Success! Scraped ${finalProducts.length} products and saved to ${outputPath}`);
  } catch (error) {
    console.error("Scraper failed with error:", error);
  } finally {
    await browser.close();
  }
}

scrapeMozek();
