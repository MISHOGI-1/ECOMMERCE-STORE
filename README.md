# GLOBAL CITY - E-Commerce Store

A modern, full-featured e-commerce platform built with Next.js, TypeScript, and Tailwind CSS.

## Features

- ✅ Product Catalog with 13 categories (Bags, Hoodies, T-Shirts, Trousers, Jackets, Boxers, Singlets, Boots, Glasses, Hats, Socks, Gym Wears, Sneakers)
- ✅ Shopping Cart System
- ✅ User Authentication & Accounts
- ✅ Checkout Process with Stripe Integration
- ✅ Order Management
- ✅ Payment Integration (Stripe)
- ✅ Inventory Management
- ✅ Search & Filtering
- ✅ Wishlist Functionality
- ✅ Product Reviews & Ratings
- ✅ Discount Codes & Promotions
- ✅ Shipping Calculations
- ✅ Admin Dashboard
- ✅ Responsive Design
- ✅ Customizable Background (Color/Image)
- ✅ Animations with Framer Motion

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (Prisma ORM) - Can be upgraded to PostgreSQL
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: React Icons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

3. Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
STRIPE_PUBLIC_KEY="pk_test_your_stripe_public_key"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Creating an Admin Account

To create an admin account, you can use Prisma Studio:

```bash
npx prisma studio
```

Then manually update a user's role to "admin" in the database, or create a seed script.

## Adding Products

Products can be added through the admin dashboard at `/admin/products` or directly via the database.

## Logo

Replace the placeholder logo in the Navbar component (`components/Navbar.tsx`) with your actual logo image.

## Customization

### Background Customization

Admins can customize the site background through `/admin/settings`:
- Choose between color or image background
- Set custom colors or image URLs

### Colors

The site uses a blue and white color scheme. Primary colors can be customized in `tailwind.config.ts`.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── auth/              # Authentication pages
│   ├── products/          # Product pages
│   └── ...
├── components/            # React components
├── lib/                   # Utility functions
├── prisma/               # Database schema
└── store/                # Zustand stores
```

## License

MIT

