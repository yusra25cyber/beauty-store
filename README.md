# Glow & Grace Beauty - E-Commerce Store

A full-stack e-commerce application for a handmade beauty products business built with Next.js 14, TypeScript, Tailwind CSS, and MongoDB.

## Features

- Product catalog with categories, search, and filtering
- Shopping cart with localStorage persistence
- Cash on Delivery (COD) and WhatsApp ordering
- Admin dashboard with order management, product CRUD, and category management
- JWT-based admin authentication
- Cloudinary image uploads

## Prerequisites

- Node.js 18+
- MongoDB Atlas (free tier) or local MongoDB
- Cloudinary account (free tier)
- WhatsApp Business number (optional for testing)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

### Required Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Random 64-char hex string for JWT signing |
| `ADMIN_EMAIL` | Email for the initial admin account |
| `ADMIN_INITIAL_PASSWORD` | Password for the initial admin account |
| `SEED_SECRET` | Secret key required to call the seed endpoint |

### Optional Variables

| Variable | Description |
|----------|-------------|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (for image uploads) |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number for customer orders |
| `NEXT_PUBLIC_SITE_NAME` | Site name (default: "Glow & Grace Beauty") |

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Edit `.env.local` with your actual values. At minimum you need:
- `MONGODB_URI` - from MongoDB Atlas
- `JWT_SECRET` - generate with: `openssl rand -hex 32`
- `ADMIN_EMAIL` and `ADMIN_INITIAL_PASSWORD` - for first admin
- `SEED_SECRET` - a random string

### 3. Create the first administrator

There are two ways to create the initial admin account:

#### Option A: Local seed script (recommended)

Run the seed script directly — it connects to MongoDB, reads credentials from `.env.local`, and creates the admin:

```bash
npm run seed:admin
```

This is safe to run multiple times — it won't duplicate the admin account.

#### Option B: Seed endpoint

The `/api/admin/seed` endpoint creates the initial admin account but requires a `SEED_SECRET` query parameter:

```bash
curl -X POST "http://localhost:3000/api/admin/seed?secret=your-secret-here"
```

The admin credentials are read from `ADMIN_EMAIL` and `ADMIN_INITIAL_PASSWORD` environment variables. The seed endpoint is only available when no administrator exists.

**Important:** In production, consider removing or disabling the seed endpoint after setup.

### 4. Start development server

```bash
npm run dev
```

### 5. Access the store

- Customer store: http://localhost:3000
- Admin panel: http://localhost:3000/admin/login

## Security Notes

- JWT tokens are stored in httpOnly, SameSite cookies
- Admin routes are protected by middleware and per-route authorization
- Order totals are calculated server-side - client-provided prices are never trusted
- Order confirmation uses a cryptographically random access token
- Image uploads are restricted to image MIME types (max 5 MB)
- Category deletion is blocked when products reference the category
- All POST/PUT payloads are validated with Zod schemas
- Password hashes are never returned in API responses

## Deployment

This application is designed for Vercel deployment:

1. Push to GitHub
2. Import in Vercel
3. Add all environment variables in Vercel project settings
4. Deploy

After deployment, create the first admin by calling the seed endpoint with the `SEED_SECRET`.

## Architecture

- **App Router**: Next.js 14 app directory with client/server component separation
- **MongoDB/Mongoose**: Database with cached connection for serverless
- **JWT (jose)**: Edge-compatible JWT for admin authentication
- **Zod**: Runtime validation for all API inputs
- **Cart**: React Context with localStorage persistence
