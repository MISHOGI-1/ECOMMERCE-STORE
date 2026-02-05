# Quick Start Guide - GLOBAL CITY Store

## ✅ Current Status:

- ✅ Server is running on port 3000
- ✅ Database is set up and seeded
- ⚠️ Shopify connection needs verification

## 🚀 Access Your Store:

1. **Open your browser**: `http://localhost:3000`
2. **Homepage**: Should load (may show local products if Shopify isn't connected)
3. **Admin Login**: 
   - Email: `admin@globalcity.com`
   - Password: `admin123`

## 📦 Adding Products:

### Option 1: Add via Shopify (Recommended)
1. Go to your Shopify Admin
2. Add products there
3. Once Shopify connection is verified, products will appear automatically

### Option 2: Add via Local Database (Temporary)
1. Login as admin: `http://localhost:3000/auth/login`
2. Go to Admin Dashboard: `http://localhost:3000/admin`
3. Manage products there

## 🔧 Fix Shopify Connection:

### Step 1: Find Your Store Domain
1. Log into Shopify Admin
2. Check the URL or go to Settings → Domains
3. Find your `.myshopify.com` domain

### Step 2: Verify Your Token
1. Go to Settings → Apps and sales channels
2. Find your app → API credentials
3. Copy the **Storefront API** token (not Admin API)

### Step 3: Update .env File
```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token
```

### Step 4: Restart Server
```bash
npm run dev
```

## ✅ What's Working:

- ✅ Store frontend and design
- ✅ User authentication
- ✅ Shopping cart
- ✅ Wishlist
- ✅ Customer profiles
- ✅ Admin dashboard
- ✅ Product management (local database)
- ✅ Order management
- ✅ Reviews and ratings

## ⚠️ What Needs Setup:

- ⚠️ Shopify connection (needs correct store domain)
- ⚠️ Stripe payment (needs API keys for checkout)

## 🎯 Next Steps:

1. **Test the store**: Visit `http://localhost:3000`
2. **Verify Shopify**: Check `VERIFY_SHOPIFY.md` for help
3. **Add products**: Either via Shopify or admin dashboard
4. **Test checkout**: Once Shopify is connected

---

**Your store is ready to use!** Even without Shopify connected, you can manage products locally and test all features.

