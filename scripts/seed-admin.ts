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
    console.error("Error: .env.local not found at", envPath);
    console.error("Create it by copying .env.example and filling in your values.");
    process.exit(1);
  }

  const env = loadEnvFile(envPath);

  const uri = env.MONGODB_URI;
  const email = env.ADMIN_EMAIL;
  const password = env.ADMIN_INITIAL_PASSWORD;

  if (!uri) {
    console.error("Error: MONGODB_URI is not set in .env.local");
    process.exit(1);
  }

  if (!email || !password) {
    console.error("Error: ADMIN_EMAIL and ADMIN_INITIAL_PASSWORD must be set in .env.local");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");

  try {
    await mongoose.connect(uri, { bufferCommands: false });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Failed to connect to MongoDB:", msg);
    process.exit(1);
  }

  console.log("Connected to MongoDB:", mongoose.connection.host);

  const adminSchema = new mongoose.Schema(
    {
      email: { type: String, required: true, unique: true, lowercase: true, trim: true },
      password: { type: String, required: true },
      name: { type: String, required: true, trim: true },
    },
    { timestamps: true }
  );

  const AdminModel =
    mongoose.models.Admin || mongoose.model("Admin", adminSchema);

  try {
    const existing = await AdminModel.findOne({ email: email.toLowerCase() });

    if (existing) {
      console.log(`Admin already exists: ${existing.email}`);
      await mongoose.disconnect();
      process.exit(0);
    }

    const bcrypt = await import("bcryptjs");
    const { hash } = bcrypt.default || bcrypt;

    const hashedPassword = await hash(password, 12);
    const name = email.split("@")[0] || "Admin";

    await AdminModel.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
    });

    console.log(`Admin created: ${email.toLowerCase()}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Error seeding admin:", msg);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
}

main();
