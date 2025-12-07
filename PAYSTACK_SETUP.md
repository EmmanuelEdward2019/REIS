# Paystack Integration Setup Guide

## Overview
This guide explains how to properly configure Paystack payment gateway for the Eagle & Thistle ecosystem.

---

## 🔑 API Keys Configuration

### 1. **Public Key (Frontend)**

**Location**: `.env` file in project root

```bash
# Payment Gateway Keys
VITE_PAYSTACK_PUBLIC_KEY="pk_test_your_actual_public_key_here"
VITE_STRIPE_PUBLIC_KEY="pk_test_your_stripe_public_key_here"
```

**How to get it**:
1. Login to [Paystack Dashboard](https://dashboard.paystack.com)
2. Go to Settings → API Keys & Webhooks
3. Copy the **Public Key** (starts with `pk_test_` for test mode or `pk_live_` for production)
4. Paste it in your `.env` file

**✅ Safe to expose**: Yes, public keys are meant to be used in frontend code

---

### 2. **Secret Key (Backend)**

**⚠️ CRITICAL**: Never add secret key to `.env` file or any frontend code!

**Location**: Supabase Edge Functions Secrets

**Steps to add**:

#### Option A: Via Supabase Dashboard (Recommended)
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `squsfmtkxdtdjaacdrzg`
3. Navigate to: **Project Settings** → **Edge Functions**
4. Click **"Add Secret"**
5. Add:
   - **Name**: `PAYSTACK_SECRET_KEY`
   - **Value**: `sk_test_your_actual_secret_key` (from Paystack dashboard)
6. Click **Save**

#### Option B: Via Supabase CLI
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref squsfmtkxdtdjaacdrzg

# Set the secret
supabase secrets set PAYSTACK_SECRET_KEY=sk_test_your_actual_secret_key
```

**✅ Safe to expose**: NO! Keep this secret and never commit to git

---

## 📁 File Structure

```
project-root/
├── .env                          # Frontend public keys
├── src/
│   ├── utils/
│   │   └── payment.ts            # Payment utilities (uses public key)
│   └── components/
│       └── payment/
│           └── PaystackPayment.tsx  # Payment component
└── supabase/
    └── functions/
        ├── verify-payment/       # Payment verification
        │   └── index.ts          # Uses secret key from Supabase secrets
        └── create-payment/       # Payment initialization
            └── index.ts
```

---

## 🔧 Usage Examples

### Frontend (Public Key)

```typescript
// src/utils/payment.ts
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

export const initializePayment = (data: PaymentData) => {
  const handler = PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,  // ✅ Public key - safe to use
    email: data.email,
    amount: data.amount * 100,  // Convert to kobo
    currency: 'NGN',
    callback: (response) => {
      // Verify payment on backend
      verifyPayment(response.reference);
    }
  });
  
  handler.openIframe();
};
```

### Backend (Secret Key)

```typescript
// supabase/functions/verify-payment/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  // ✅ Get secret key from Supabase environment
  const secretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
  
  if (!secretKey) {
    return new Response('Secret key not configured', { status: 500 });
  }

  const { reference } = await req.json();

  // Verify payment with Paystack
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${secretKey}`,  // ✅ Secret key used securely
      },
    }
  );

  const data = await response.json();
  
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

---

## 🚀 Deployment Checklist

### Development
- [ ] Add test public key to `.env`
- [ ] Add test secret key to Supabase Edge Functions secrets
- [ ] Test payment flow
- [ ] Verify payment verification works

### Production
- [ ] Replace `pk_test_` with `pk_live_` in `.env`
- [ ] Replace `sk_test_` with `sk_live_` in Supabase secrets
- [ ] Set up webhook URL in Paystack dashboard
- [ ] Test live payment (small amount)
- [ ] Monitor transactions

---

## 🔒 Security Best Practices

### ✅ DO:
- Store public key in `.env` file
- Store secret key in Supabase Edge Functions secrets
- Verify all payments on the backend
- Use HTTPS for all payment requests
- Log all payment transactions
- Implement webhook verification

### ❌ DON'T:
- Never commit `.env` file to git (add to `.gitignore`)
- Never expose secret key in frontend code
- Never trust frontend payment confirmation alone
- Never skip backend verification
- Never log secret keys

---

## 🧪 Testing

### Test Cards (Paystack Test Mode)

**Successful Payment**:
- Card: `4084084084084081`
- CVV: `408`
- Expiry: Any future date
- PIN: `0000`

**Failed Payment**:
- Card: `5060666666666666666`
- CVV: Any 3 digits
- Expiry: Any future date

### Test Flow:
1. Add product to cart
2. Proceed to checkout
3. Enter test card details
4. Complete payment
5. Verify backend receives webhook
6. Check order status updated

---

## 📞 Support

**Paystack Documentation**: https://paystack.com/docs
**Paystack Support**: support@paystack.com
**Supabase Edge Functions**: https://supabase.com/docs/guides/functions

---

## ⚠️ Common Issues

### Issue: "Invalid API Key"
**Solution**: Check that you're using the correct key for your environment (test vs live)

### Issue: "Secret key not found"
**Solution**: Verify secret is set in Supabase Edge Functions secrets, not `.env`

### Issue: "Payment verification failed"
**Solution**: Ensure backend Edge Function has access to `PAYSTACK_SECRET_KEY`

### Issue: "CORS error"
**Solution**: Configure Supabase Edge Function CORS headers properly

---

## 📝 Summary

| Key Type | Location | Starts With | Safe to Expose? |
|----------|----------|-------------|-----------------|
| Public Key | `.env` file | `pk_test_` or `pk_live_` | ✅ Yes |
| Secret Key | Supabase Secrets | `sk_test_` or `sk_live_` | ❌ NO! |

**Remember**: Public keys go in `.env`, Secret keys go in Supabase Edge Functions secrets!

