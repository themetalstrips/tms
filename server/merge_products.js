const fs = require('fs');
const path = require('path');

// 1. Existing 4 static products
const originalProducts = [
  {
      id: 'silver-edition',
      name: 'Silver Edition Chef\'s Knife',
      subtitle: '12-Inch Kintsugi Blade',
      price: 47.00,
      retailPrice: 74.00,
      badge: 'Bestseller',
      description: 'Inspired by traditional Japanese Kintsugi, featuring a high-quality stainless steel blade with a unique gold-vein aesthetic. Hand-forged for unparalleled precision.',
      image: '/images/hero-knife.png',
      specs: {
          totalLength: '12 inches',
          bladeLength: '8 inches',
          handleLength: '4 inches',
          material: 'Böhler J2 Japanese Steel',
          handle: 'High-grade Pakka wood'
      }
  },
  {
      id: 'blue-edition',
      name: 'Titanium Blue Edition',
      subtitle: '12-Inch Chef\'s Knife',
      price: 47.00,
      retailPrice: 74.00,
      badge: 'Limited Edition',
      description: 'A striking titanium blue finish that blends modern resilience with the classic Kintsugi design. High-performance steel for the modern chef.',
      image: '/images/knife-blue.png',
      specs: {
          totalLength: '12 inches',
          bladeLength: '8 inches',
          handleLength: '4 inches',
          material: 'Böhler J2 Japanese Steel (Titanium Plated)',
          handle: 'High-grade Pakka wood'
      }
  },
  {
      id: 'gold-edition',
      name: 'Radiant Gold Edition',
      subtitle: '12-Inch Chef\'s Knife',
      price: 47.00,
      retailPrice: 74.00,
      badge: 'Most Popular',
      description: 'The most premium look in the collection, featuring a gold-plated aesthetic that emphasizes the "repaired with gold" philosophy of Kintsugi.',
      image: '/images/knife-gold.png',
      specs: {
          totalLength: '12 inches',
          bladeLength: '8 inches',
          handleLength: '4 inches',
          material: 'Böhler J2 Japanese Steel (Gold Plated)',
          handle: 'High-grade Pakka wood'
      }
  },
  {
      id: 'dual-set',
      name: 'Kintsugi Dual Chef Set',
      subtitle: 'Two-Knife Collection',
      price: 89.00,
      retailPrice: 148.00,
      badge: 'Best Value',
      description: 'The ultimate culinary duo. Includes two knives of your choice (Silver, Blue, or Gold variants) at a special value. Gift-boxed.',
      image: '/images/knife-dual-set.png',
      specs: {
          inclusion: 'Any 2 Kintsugi Chef Knives',
          accessories: 'Leather Sheaths ×2, Cleaning Cloths ×2'
      }
  }
];

// 2. Load scraped products
const scrapedPath = path.join(__dirname, 'mozek_products.json');
if (!fs.existsSync(scrapedPath)) {
  console.error("scraped products file not found!");
  process.exit(1);
}

const scrapedProducts = JSON.parse(fs.readFileSync(scrapedPath, 'utf8'));

// 3. Make IDs and Names completely unique
const idCounts = {};
const nameCounts = {};

const uniqueScrapedProducts = scrapedProducts.map(p => {
  let uniqueId = p.id;
  let uniqueName = p.name;
  
  // Handle duplicate IDs
  if (idCounts[p.id]) {
    idCounts[p.id]++;
    uniqueId = `${p.id}-${idCounts[p.id]}`;
  } else {
    idCounts[p.id] = 1;
  }
  
  // Handle duplicate Names (so they appear as different sizes/options on frontend)
  if (nameCounts[p.name]) {
    nameCounts[p.name]++;
    uniqueName = `${p.name} (Option ${nameCounts[p.name]})`;
  } else {
    nameCounts[p.name] = 1;
  }
  
  return {
    ...p,
    id: uniqueId,
    name: uniqueName
  };
});

// 4. Combine catalogs
const combined = [...originalProducts, ...uniqueScrapedProducts];

// 5. Write to src/data/products.js
const destPath = path.join(__dirname, '..', 'src', 'data', 'products.js');

const fileContent = `export const products = ${JSON.stringify(combined, null, 4)};\n`;

fs.writeFileSync(destPath, fileContent, 'utf8');

console.log(`Successfully merged! Total products: ${combined.length}`);
console.log(`Saved new catalog to ${destPath}`);
