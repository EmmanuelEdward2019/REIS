# Payment Gateway Setup Guide

This guide explains how to set up Paystack (for NGN payments) and Stripe (for GBP payments) for the Eagle & Thistle Group e-commerce platform.

---

## 🔐 Environment Variables

Add the following to your `.env` file:

```env
# Payment Gateway Keys
VITE_PAYSTACK_PUBLIC_KEY="pk_test_your_paystack_public_key_here"
VITE_STRIPE_PUBLIC_KEY="pk_test_your_stripe_public_key_here"
```

---

## 💳 Paystack Setup (NGN Payments - Nigeria)

### 1. Create Paystack Account
1. Go to [https://paystack.com](https://paystack.com)
2. Sign up for a free account
3. Complete business verification (required for live mode)

### 2. Get API Keys
1. Log in to Paystack Dashboard
2. Go to **Settings** → **API Keys & Webhooks**
3. Copy your **Public Key** (starts with `pk_test_` for test mode)
4. Add to `.env` file as `VITE_PAYSTACK_PUBLIC_KEY`

### 3. Test Mode
- Use test cards provided by Paystack for testing
- Test Card: `4084084084084081`
- CVV: Any 3 digits
- Expiry: Any future date
- PIN: `0000`
- OTP: `123456`

### 4. Webhook Setup (Optional - for payment verification)
1. In Paystack Dashboard, go to **Settings** → **API Keys & Webhooks**
2. Add webhook URL: `https://your-domain.com/api/webhooks/paystack`
3. Select events: `charge.success`, `charge.failed`
4. Copy webhook secret and store securely

### 5. Go Live
1. Complete business verification in Paystack Dashboard
2. Switch to **Live Mode** in dashboard
3. Copy **Live Public Key** (starts with `pk_live_`)
4. Update `.env` with live key for production

---

## 💳 Stripe Setup (GBP Payments - UK)

### 1. Create Stripe Account
1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for a free account
3. Complete business verification

### 2. Get API Keys
1. Log in to Stripe Dashboard
2. Go to **Developers** → **API Keys**
3. Copy your **Publishable Key** (starts with `pk_test_` for test mode)
4. Add to `.env` file as `VITE_STRIPE_PUBLIC_KEY`

### 3. Test Mode
- Use test cards provided by Stripe for testing
- Test Card: `4242 4242 4242 4242`
- CVV: Any 3 digits
- Expiry: Any future date
- ZIP: Any 5 digits

### 4. Backend Setup Required
Stripe requires a backend endpoint to create Payment Intents. You need to:

#### Option A: Supabase Edge Functions
Create a Supabase Edge Function:

```typescript
// supabase/functions/create-payment-intent/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

serve(async (req) => {
  try {
    const { amount, currency, orderId, customerEmail } = await req.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        order_id: orderId,
      },
      receipt_email: customerEmail,
    })

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

Deploy:
```bash
supabase functions deploy create-payment-intent
supabase secrets set STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

Update `src/utils/payment.ts`:
```typescript
const response = await fetch(
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify(paymentData),
  }
);
```

#### Option B: Custom Backend
If you have a separate backend (Node.js, Python, etc.), create an endpoint:

```javascript
// Example Node.js/Express endpoint
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, orderId, customerEmail } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { order_id: orderId },
      receipt_email: customerEmail,
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

### 5. Webhook Setup (for payment confirmation)
1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook signing secret and store securely

### 6. Go Live
1. Complete business verification in Stripe Dashboard
2. Switch to **Live Mode** in dashboard
3. Copy **Live Publishable Key** (starts with `pk_live_`)
4. Update `.env` with live key for production

---

## 🔄 Current Implementation Status

### ✅ Completed
- [x] Paystack integration for NGN payments
- [x] Payment utilities and helpers
- [x] Order creation with payment tracking
- [x] Payment reference generation
- [x] Paystack popup integration
- [x] Payment success/failure handling
- [x] Order status updates after payment
- [x] Payment transaction records

### 🚧 Pending (Stripe)
- [ ] Backend endpoint for Payment Intent creation
- [ ] Stripe checkout form integration in Checkout page
- [ ] Webhook handlers for payment verification
- [ ] Payment confirmation emails

---

## 🧪 Testing Payment Flow

### Test Paystack Payment (NGN)
1. Set region to Nigeria (NGN)
2. Add products to cart
3. Go to checkout
4. Fill in shipping address
5. Click "Place Order"
6. Paystack popup will appear
7. Use test card: `4084084084084081`
8. Complete payment
9. Order status updates to "paid"
10. Redirects to order confirmation

### Test Stripe Payment (GBP) - Coming Soon
1. Set region to UK (GBP)
2. Add products to cart
3. Go to checkout
4. Fill in shipping address
5. Click "Place Order"
6. Stripe payment form will appear (after backend setup)
7. Use test card: `4242 4242 4242 4242`
8. Complete payment
9. Order status updates to "paid"
10. Redirects to order confirmation

---

## 📊 Database Schema

### Orders Table
```sql
- payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
- payment_method: 'paystack' | 'stripe'
- payment_reference: TEXT (unique reference from gateway)
```

### Payment Transactions Table
```sql
- order_id: UUID (FK to orders)
- transaction_reference: TEXT (gateway transaction ID)
- payment_method: 'paystack' | 'stripe'
- amount: DECIMAL
- currency: TEXT
- status: 'success' | 'failed' | 'pending'
- gateway_response: JSONB (full response from gateway)
```

---

## 🔒 Security Best Practices

1. **Never expose secret keys** - Only use public keys in frontend
2. **Validate on backend** - Always verify payments on server-side
3. **Use webhooks** - Don't rely solely on client-side callbacks
4. **Store transaction records** - Keep audit trail of all payments
5. **Handle errors gracefully** - Provide clear error messages to users
6. **Test thoroughly** - Use test mode extensively before going live
7. **Monitor transactions** - Set up alerts for failed payments

---

## 📞 Support

- **Paystack Support**: [https://paystack.com/support](https://paystack.com/support)
- **Stripe Support**: [https://support.stripe.com](https://support.stripe.com)
- **Documentation**: 
  - Paystack: [https://paystack.com/docs](https://paystack.com/docs)
  - Stripe: [https://stripe.com/docs](https://stripe.com/docs)

---

## 🚀 Next Steps

1. **Get API Keys**: Sign up for Paystack and Stripe accounts
2. **Add to .env**: Update environment variables with your keys
3. **Run Migration**: Deploy the payment_reference migration
4. **Test Paystack**: Test NGN payments with test cards
5. **Setup Stripe Backend**: Create Payment Intent endpoint
6. **Test Stripe**: Test GBP payments with test cards
7. **Setup Webhooks**: Configure webhook endpoints for verification
8. **Go Live**: Switch to live keys after thorough testing

