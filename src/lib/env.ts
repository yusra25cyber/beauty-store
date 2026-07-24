export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}\n` +
      `Please add it to your .env.local file.\n` +
      `See .env.example for all required variables.`
    );
  }
  return value;
}

export function getMongoUri(): string {
  return requireEnv("MONGODB_URI");
}

export function getJwtSecret(): string {
  return requireEnv("JWT_SECRET");
}

export function getAdminEmail(): string {
  const value = process.env.ADMIN_EMAIL;
  if (!value) {
    throw new Error(
      "ADMIN_EMAIL is required to seed the first administrator. " +
      "Set it in .env.local and call POST /api/admin/seed with the SEED_SECRET."
    );
  }
  return value;
}

export function getAdminInitialPassword(): string {
  const value = process.env.ADMIN_INITIAL_PASSWORD;
  if (!value) {
    throw new Error(
      "ADMIN_INITIAL_PASSWORD is required to seed the first administrator. " +
      "Set it in .env.local and call POST /api/admin/seed with the SEED_SECRET."
    );
  }
  return value;
}

export function getSeedSecret(): string {
  return requireEnv("SEED_SECRET");
}

export function getCloudinaryConfig(): {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
} {
  return {
    cloudName: requireEnv("CLOUDINARY_CLOUD_NAME"),
    apiKey: requireEnv("CLOUDINARY_API_KEY"),
    apiSecret: requireEnv("CLOUDINARY_API_SECRET"),
  };
}
