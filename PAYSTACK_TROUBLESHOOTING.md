# 🔧 Paystack Integration - Troubleshooting Guide

## ✅ What Was Fixed

### 1. **Toast Notifications** - FIXED
- Replaced all `toast({ title, description })` with `toast.success()` and `toast.error()`
- Fixed blank screen issues in Checkout page
- All notifications now work properly

### 2. **Enhanced Error Handling** - ADDED
- Added comprehensive validation for Paystack public key
- Added validation for PaystackPop script loading
- Added payment data validation
- Added detailed console logging for debugging

---

## 🔑 CRITICAL: Configure Your Paystack Public Key

### Current Issue:
Your `.env` file has a placeholder Paystack public key:
```bash
VITE_PAYSTACK_PUBLIC_KEY="pk_test_your_paystack_public_key_here"
```

### ⚠️ THIS MUST BE REPLACED WITH YOUR ACTUAL KEY!

### How to Get Your Paystack Keys:

1. **Login to Paystack Dashboard**
   - Go to: https://dashboard.paystack.com/
   - Login with your account

2. **Navigate to Settings**
   - Click on **Settings** in the sidebar
   - Click on **API Keys & Webhooks**

3. **Copy Your Keys**
   - **Test Mode**: Use for development
     - Public Key: `pk_test_xxxxxxxxxx`
     - Secret Key: `sk_test_xxxxxxxxxx`
   - **Live Mode**: Use for production
     - Public Key: `pk_live_xxxxxxxxxx`
     - Secret Key: `sk_live_xxxxxxxxxx`

4. **Update Your .env File**
   ```bash
   # Replace this line in .env:
   VITE_PAYSTACK_PUBLIC_KEY="pk_test_your_actual_key_here"
   
   # With your actual key:
   VITE_PAYSTACK_PUBLIC_KEY="pk_test_abc123xyz456..."
   ```

5. **Restart Your Dev Server**
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

---

## 🔐 Configure Paystack Secret Key (Backend)

### Where to Add Secret Key:

**DO NOT** add the secret key to `.env` file!

### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **Project Settings** → **Edge Functions**
3. Click on **Secrets** tab
4. Add new secret:
   - **Name**: `PAYSTACK_SECRET_KEY`
   - **Value**: `sk_test_your_actual_secret_key`
5. Click **Save**

### Option 2: Supabase CLI
```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_ID

# Set the secret
supabase secrets set PAYSTACK_SECRET_KEY=sk_test_your_actual_secret_key
```

---

## 🐛 Debugging Checklist

When you click "Proceed to Checkout" and it doesn't redirect to Paystack, check these:

### 1. **Check Browser Console**
Open Developer Tools (F12) and look for these messages:

#### ✅ Good Signs:
```
✅ Initializing Paystack payment with: {...}
🚀 Opening Paystack payment window...
```

#### ❌ Error Messages:

**Error 1: Public Key Not Configured**
```
❌ Paystack public key not configured!
Please add your Paystack public key to .env file
```
**Solution**: Update `.env` with your actual Paystack public key

**Error 2: Paystack Script Not Loaded**
```
❌ Paystack script not loaded!
Make sure the Paystack script is in index.html
```
**Solution**: Verify `index.html` has the script (it's already there at line 21)

**Error 3: Invalid Payment Data**
```
❌ Invalid payment data: {...}
```
**Solution**: Check that email, amount, and reference are all present

### 2. **Verify Environment Variables**
```bash
# In your terminal, check if the key is loaded:
echo $VITE_PAYSTACK_PUBLIC_KEY

# Or check in browser console:
console.log(import.meta.env.VITE_PAYSTACK_PUBLIC_KEY)
```

### 3. **Check Network Tab**
- Open Developer Tools → Network tab
- Click "Proceed to Checkout"
- Look for any failed requests
- Check if Paystack iframe is being loaded

### 4. **Verify Cart Has Items**
- Make sure you have items in cart
- Check cart total is greater than 0
- Verify currency is set to NGN (Paystack only works with NGN)

---

## 🔄 Step-by-Step Testing Process

### Test 1: Verify Paystack Script Loaded
1. Open browser console (F12)
2. Type: `typeof PaystackPop`
3. Should return: `"object"` or `"function"`
4. If returns `"undefined"`: Refresh the page

### Test 2: Verify Public Key
1. Open browser console
2. Type: `import.meta.env.VITE_PAYSTACK_PUBLIC_KEY`
3. Should return: `"pk_test_..."` (your actual key)
4. If returns placeholder: Update `.env` and restart server

### Test 3: Test Checkout Flow
1. Add a product to cart
2. Go to cart page
3. Click "Proceed to Checkout"
4. Fill in shipping address
5. Click "Place Order"
6. Watch console for logs
7. Paystack popup should appear

---

## 📋 Common Issues & Solutions

### Issue 1: "Payment configuration error: Paystack public key not set"
**Cause**: `.env` file has placeholder key  
**Solution**: 
1. Get your actual key from Paystack dashboard
2. Update `.env` file
3. Restart dev server (`npm run dev`)

### Issue 2: Nothing happens when clicking "Place Order"
**Cause**: JavaScript error or validation failure  
**Solution**:
1. Open browser console (F12)
2. Look for red error messages
3. Check if all form fields are filled
4. Verify you're logged in

### Issue 3: "Payment system not ready"
**Cause**: Paystack script not loaded  
**Solution**:
1. Refresh the page
2. Check internet connection
3. Verify `index.html` has Paystack script

### Issue 4: Paystack popup opens but payment fails
**Cause**: Using test key with real card, or invalid card  
**Solution**:
1. Use Paystack test cards:
   - Card: `4084 0840 8408 4081`
   - CVV: `408`
   - Expiry: Any future date
   - PIN: `0000`
2. Or use your actual Paystack account for testing

### Issue 5: Payment successful but order not updating
**Cause**: Callback function error  
**Solution**:
1. Check browser console for errors
2. Verify Supabase connection
3. Check order status in database

---

## 🧪 Test Cards (Paystack Test Mode)

### Successful Payment:
- **Card Number**: `4084 0840 8408 4081`
- **CVV**: `408`
- **Expiry**: Any future date
- **PIN**: `0000`

### Failed Payment:
- **Card Number**: `4084 0840 8408 4081`
- **CVV**: `408`
- **Expiry**: Any future date
- **PIN**: `1111`

### Insufficient Funds:
- **Card Number**: `5060 6666 6666 6666 6666`
- **CVV**: `123`
- **Expiry**: Any future date
- **PIN**: `1234`

---

## 📊 Files Modified

### 1. `src/utils/payment.ts`
- ✅ Added public key validation
- ✅ Added PaystackPop script check
- ✅ Added payment data validation
- ✅ Added comprehensive error logging
- ✅ Added try-catch error handling

### 2. `src/pages/Checkout.tsx`
- ✅ Fixed all toast notifications
- ✅ Replaced toast() with toast.success()/toast.error()
- ✅ Better error messages

### 3. `index.html`
- ✅ Already has Paystack script (line 21)

---

## ✅ Final Checklist

Before testing payment:
- [ ] Updated `.env` with actual Paystack public key
- [ ] Restarted dev server after updating `.env`
- [ ] Added Paystack secret key to Supabase (for backend verification)
- [ ] Verified Paystack script loads (check console: `typeof PaystackPop`)
- [ ] Currency set to NGN (Paystack requirement)
- [ ] Cart has items
- [ ] User is logged in
- [ ] All shipping fields filled

---

## 🚀 Next Steps

### 1. **Update .env File** (REQUIRED)
```bash
VITE_PAYSTACK_PUBLIC_KEY="pk_test_YOUR_ACTUAL_KEY_HERE"
```

### 2. **Restart Server** (REQUIRED)
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 3. **Test Payment Flow**
1. Add product to cart
2. Go to checkout
3. Fill shipping info
4. Click "Place Order"
5. Paystack popup should appear
6. Use test card to complete payment

### 4. **Monitor Console**
- Keep browser console open (F12)
- Watch for success/error messages
- All steps are now logged with emojis:
  - ✅ = Success
  - ❌ = Error
  - ⚠️ = Warning
  - 🚀 = Action

---

## 📞 Still Having Issues?

If you've followed all steps and still having problems:

1. **Share Console Logs**
   - Open browser console (F12)
   - Click "Place Order"
   - Copy all console messages
   - Share them for debugging

2. **Check These Details**
   - What currency is selected? (Must be NGN)
   - What error message appears?
   - Does Paystack popup appear at all?
   - Any network errors in Network tab?

3. **Verify Paystack Account**
   - Login to Paystack dashboard
   - Verify account is active
   - Check if test mode is enabled
   - Verify API keys are correct

---

## 🎉 Success Indicators

When everything is working correctly, you'll see:

1. **In Console**:
   ```
   ✅ Initializing Paystack payment with: {
     email: "user@example.com",
     amount: 100000,
     reference: "ORD-123456-...",
     currency: "NGN",
     key: "pk_test_..."
   }
   🚀 Opening Paystack payment window...
   ```

2. **On Screen**:
   - Paystack payment popup appears
   - Shows correct amount
   - Shows your email
   - Payment options visible

3. **After Payment**:
   - Green success toast appears
   - Redirects to order confirmation
   - Order status updated in database

---

**Remember**: The most common issue is not updating the `.env` file with your actual Paystack public key!

