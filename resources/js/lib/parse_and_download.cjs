const fs = require('fs');
const path = require('path');
const https = require('https');

const filePath = 'C:\\Users\\hp\\.gemini\\antigravity\\brain\\82bc7ab2-3269-4a1b-8ab4-a4dad594cfc5\\.system_generated\\steps\\1464\\content.md';
const content = fs.readFileSync(filePath, 'utf8');

const blocks = content.split('class="car_result"');
const carBlocks = blocks.slice(1);

console.log('Parsing', carBlocks.length, 'cars...');

const parsedCars = [];

// Helper to download a file
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

// Clean and create target directories
const targetImgDir = path.join(__dirname, '..', '..', '..', 'public', 'images', 'cars');
if (!fs.existsSync(targetImgDir)) {
  fs.mkdirSync(targetImgDir, { recursive: true });
}

async function run() {
  for (let idx = 0; idx < carBlocks.length; idx++) {
    const block = carBlocks[idx];
    
    // Extract Name
    const nameMatch = block.match(/<h4 class="vrc-car-name"[^>]*>([\s\S]*?)<\/h4>/);
    if (!nameMatch) continue;
    const rawName = nameMatch[1].replace(/<[^>]*>/g, '').trim();
    
    // Extract Image URL
    const imgMatch = block.match(/data-src="([^"]+?)"/);
    const imageUrl = imgMatch ? imgMatch[1] : '';
    
    // Extract Category
    const catMatch = block.match(/<div class="vrc-car-category">([\s\S]*?)<\/div>/);
    const category = catMatch ? catMatch[1].trim() : '';
    
    // Extract Description
    const descMatch = block.match(/<div class="vrc-car-result-description">([\s\S]*?)<\/div>/);
    let description = descMatch ? descMatch[1].trim() : '';
    // Replace Drive Plus / DrivePlus with Teima Cars
    description = description.replace(/drive\s*plus/gi, 'Teima Cars');
    
    // Extract Price
    const priceMatch = block.match(/<span class="vrc_price">([\s\S]*?)<\/span>/);
    const priceStr = priceMatch ? priceMatch[1].trim() : '';
    const priceVal = parseFloat(priceStr) || 0;
    
    // Extract Specs
    const specs = [];
    const specRegex = /data-vrc-expl="([^"]+?)"/g;
    let specMatch;
    while ((specMatch = specRegex.exec(block)) !== null) {
      specs.push(specMatch[1]);
    }
    
    // Guess Brand and Model
    let brand = 'Other';
    let model = rawName;
    const brandList = ['Dacia', 'Renault', 'Peugeot', 'Fiat', 'Volkswagen', 'Audi', 'BMW', 'Porsche', 'Range Rover', 'Jeep', 'Hyundai', 'Toyota', 'Kia'];
    for (const b of brandList) {
      if (rawName.toLowerCase().startsWith(b.toLowerCase())) {
        brand = b;
        model = rawName.substring(b.length).trim();
        break;
      }
    }
    
    // Guess fuel type
    let fuelType = 'Diesel';
    if (rawName.toLowerCase().includes('pétrole') || rawName.toLowerCase().includes('essence') || rawName.toLowerCase().includes('petrol') || description.toLowerCase().includes('petrol') || description.toLowerCase().includes('gasoline')) {
      fuelType = 'Petrol';
    } else if (rawName.toLowerCase().includes('hybride') || rawName.toLowerCase().includes('hybrid')) {
      fuelType = 'Hybrid';
    }
    
    // Guess transmission
    let transmission = 'Manual';
    if (rawName.toLowerCase().includes('automatic') || rawName.toLowerCase().includes('auto') || category.toLowerCase().includes('automatic') || description.toLowerCase().includes('automatic')) {
      transmission = 'Automatic';
    }
    
    // Guess passenger capacity and luggage
    let passengerCapacity = 5;
    let luggageCapacity = 2;
    specs.forEach(s => {
      const sLower = s.toLowerCase();
      if (sLower.includes('passenger') || sLower.includes('place')) {
        const num = parseInt(sLower);
        if (!isNaN(num)) passengerCapacity = num;
      } else if (sLower.includes('luggage') || sLower.includes('valise')) {
        const num = parseInt(sLower);
        if (!isNaN(num)) luggageCapacity = num;
      }
    });

    // Prepare filename for the WebP image
    let localImagePath = null;
    if (imageUrl) {
      const parsedUrl = path.parse(imageUrl);
      const filename = parsedUrl.base; // e.g. agadir-car-rental-sandero.webp
      const destPath = path.join(targetImgDir, filename);
      
      console.log(`Downloading ${imageUrl} -> ${destPath}`);
      try {
        await downloadFile(imageUrl, destPath);
        localImagePath = `/images/cars/${filename}`;
        console.log(`Successfully downloaded ${filename}`);
      } catch (err) {
        console.error(`Failed to download ${filename}:`, err.message);
      }
    }

    parsedCars.push({
      brand,
      model,
      year: 2024,
      price_per_day: Math.round(priceVal * 10), // Conversion: 1 Euro = 10 MAD
      fuel_type: fuelType,
      passenger_capacity: passengerCapacity,
      luggage_capacity: luggageCapacity,
      status: 'available',
      image_path: localImagePath,
      description,
      category
    });
  }

  // Save the JSON payload to the database seeders path
  const targetJsonPath = path.join(__dirname, '..', '..', '..', 'database', 'seeders', 'cars_data.json');
  fs.writeFileSync(targetJsonPath, JSON.stringify(parsedCars, null, 2), 'utf8');
  console.log(`Successfully saved parsed data to ${targetJsonPath}`);
}

run().catch(console.error);
