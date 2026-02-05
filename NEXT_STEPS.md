# Next Steps After Shopify Setup

## ✅ You've Completed:
- Created Shopify app
- Enabled Storefront API scopes
- Got your Storefront API access token

## 🚀 What's Next:

### Step 1: Add Credentials to .env File

Open your `.env` file and add these two lines (replace with your actual values):

```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_actual_token_here
```

**Important:**
- Replace `your-store` with your actual Shopify store name (e.g., `global-city`)
- Replace `your_actual_token_here` with the Storefront API access token you copied
- Make sure there are NO quotes around the values
- Make sure there are NO spaces before or after the `=` sign

**Example:**
```env
SHOPIFY_STORE_DOMAIN=global-city.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_1234567890abcdef
```

### Step 2: Verify Dependencies

Make sure all packages are installed:
```bash
npm install
```

### Step 3: Restart Your Development Server

1. Stop your current server (Ctrl+C in the terminal)
2. Start it again:
```bash
npm run dev
```

### Step 4: Test the Integration

1. Open your browser: `http://localhost:3000`
2. Check if products are loading from Shopify
3. Try adding a product to cart
4. Test the checkout process

## 🔍 How to Verify It's Working:

### ✅ Success Indicators:
- Products appear on your homepage
- Products show correct prices and images
- "Add to Cart" buttons work
- Checkout redirects to Shopify checkout page
- No errors in browser console (F12)

### ❌ If Products Don't Show:
1. Check `.env` file has correct credentials
2. Verify token has all 4 required scopes
3. Make sure products are published in Shopify
4. Check browser console for errors (F12)
5. Check server terminal for error messages

## 📝 Troubleshooting:

### Issue: "Access denied" or "401 Unauthorized"
**Solution**: 
- Double-check your Storefront API token
- Verify token is copied correctly (no extra spaces)
- Make sure token has all required scopes enabled

### Issue: Products not showing
**Solution**:
- Verify products are published in Shopify Admin
- Check products have variants and inventory
- Ensure products are not in draft mode
- Check browser console for specific errors

### Issue: Checkout not working
**Solution**:
- Verify `unauthenticated_write_checkouts` scope is enabled
- Check that products have available inventory
- Ensure variant IDs are correct

## 🎯 What Happens Next:

Once everything is working:
1. ✅ Products will load from Shopify
2. ✅ Inventory updates automatically
3. ✅ Checkout uses Shopify's secure payment system
4. ✅ Orders appear in your Shopify Admin
5. ✅ Your custom features (wishlist, reviews, profile) still work

## 📚 Need Help?

- Check `SHOPIFY_API_SCOPES.md` for scope details
- Check `SHOPIFY_SETUP.md` for setup instructions
- Shopify API Docs: https://shopify.dev/api/storefront

