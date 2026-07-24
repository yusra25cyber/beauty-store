import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

function loadEnvFile(filePath: string): Record<string, string> {
  const env: Record<string, string> = {};
  const content = fs.readFileSync(filePath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

async function main() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("Error: .env.local not found");
    process.exit(1);
  }

  const env = loadEnvFile(envPath);
  const uri = env.MONGODB_URI;
  if (!uri) {
    console.error("Error: MONGODB_URI not set");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri, { bufferCommands: false });
  console.log("Connected:", mongoose.connection.host);

  const productSchema = new mongoose.Schema({}, { strict: false, collection: "products" });
  const ProductModel = mongoose.models.Product || mongoose.model("Product", productSchema);

  const allProducts = await ProductModel.find({}).lean();
  console.log(`Total products found: ${allProducts.length}`);

  let migrated = 0;
  let skipped = 0;

  for (const product of allProducts) {
    if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
      console.log(`  SKIP ${product.name} (already has ${product.variants.length} variants)`);
      skipped++;
      continue;
    }

    const name = product.name || "Unnamed Product";
    const price = typeof product.price === "number" ? product.price : 0;
    const stock = typeof product.stockQuantity === "number" ? product.stockQuantity : 0;
    const rawImages = product.images && Array.isArray(product.images) ? product.images : [];

    const sku = `PROD-${product._id.toString().slice(-8).toUpperCase()}`;

    const images = rawImages.map((url: string) => ({
      url,
      publicId: "",
      format: "",
      width: 0,
      height: 0,
    }));

    const defaultVariant = {
      name: "Default",
      sku,
      price,
      stock,
      images,
    };

    await ProductModel.findByIdAndUpdate(product._id, {
      $set: { variants: [defaultVariant] },
    });

    console.log(`  MIGRATED ${name} (price: ${price}, stock: ${stock}, images: ${images.length})`);
    migrated++;
  }

  console.log(`\nDone. Migrated: ${migrated}, Skipped: ${skipped}`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
