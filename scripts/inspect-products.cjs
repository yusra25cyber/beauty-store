const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const envPath = path.resolve(__dirname, "..", ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      envVars[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
    }
  }
});

const uri = envVars.MONGODB_URI;
if (!uri) { console.log("MONGODB_URI not found"); process.exit(1); }

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("test");  // from earlier inspection
    const products = await db.collection("products").find({}).limit(10).toArray();
    console.log(`\n=== Product count: ${products.length} ===\n`);
    
    for (const p of products) {
      console.log(`--- Product: ${p.name} ---`);
      console.log(`  _id: ${p._id}`);
      console.log(`  images (root): ${JSON.stringify(p.images)}`);
      console.log(`  images type: ${typeof p.images}, isArray: ${Array.isArray(p.images)}`);
      if (Array.isArray(p.images)) {
        console.log(`  images length: ${p.images.length}`);
        p.images.forEach((img, i) => {
          console.log(`    [${i}]: "${img}" (type: ${typeof img})`);
        });
      }
      console.log(`  variants count: ${p.variants ? p.variants.length : 0}`);
      if (p.variants && p.variants.length > 0) {
        p.variants.forEach((v, vi) => {
          console.log(`  variant[${vi}]: name="${v.name}", images=${JSON.stringify(v.images)}`);
          if (v.images && v.images.length > 0) {
            v.images.forEach((img, ii) => {
              console.log(`    img[${ii}]: url="${img.url}", publicId="${img.publicId}"`);
            });
          }
        });
      }
      console.log(`  category: ${p.category}`);
      console.log(`  price: ${p.price}`);
      console.log();
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.close();
  }
}

run();
