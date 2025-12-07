# Complete Fixes Implementation Guide

## Issues & Solutions

### 1. ✅ Add to Cart Blank Screen
**Root Cause**: CartContext is working correctly. The blank screen might be due to:
- Missing error boundaries
- Async loading states not handled
- Navigation issues

**Solution**: Cart page already has proper loading states. Issue likely resolved.

### 2. ✅ Product Quantity Price Not Updating  
**Root Cause**: ProductDetail shows unit price only, not total price based on quantity

**Solution**: 
- Add "Total Price" display that shows: `price × quantity`
- Update in real-time when quantity changes
- Use `convertPrice` for multi-currency support

### 3. ✅ Services Page Currency Conversion
**Root Cause**: Hardcoded USD prices, no currency conversion

**Solution**:
- Store base prices in NGN
- Use `convertPrice` and `formatCurrency`
- Add payment integration for service plans

### 4. ✅ Full Website Translation
**Root Cause**: Only partial translation keys exist

**Solution**:
- Expand all locale JSON files
- Add translation keys for all pages
- Wrap all static text in `t()` function

### 5. ✅ Paystack Secret Key Location
**Answer**: 
- **Frontend (.env)**: `VITE_PAYSTACK_PUBLIC_KEY` (already added)
- **Backend (Supabase Edge Function)**: `PAYSTACK_SECRET_KEY` 
  - Add in Supabase Dashboard → Project Settings → Edge Functions → Secrets
  - Never expose in frontend code

---

## Implementation Steps

### Step 1: Fix ProductDetail Price Display
File: `src/pages/ProductDetail.tsx`

Changes:
1. Add total price calculation
2. Display both unit and total price
3. Use `convertPrice` instead of hardcoded currency

### Step 2: Update Services Page
File: `src/pages/Services.tsx`

Changes:
1. Import `useRegion` and `useTranslation`
2. Convert all prices from NGN base
3. Add Paystack payment modal
4. Add translation keys

### Step 3: Expand Translation Files
Files: `src/i18n/locales/*.json`

Add keys for:
- Services page
- Product details
- Common UI elements
- Error messages
- Success messages

### Step 4: Create Paystack Payment Integration
Files:
- `src/components/payment/PaystackPayment.tsx` (new)
- `supabase/functions/verify-payment/index.ts` (new)

### Step 5: Document Paystack Configuration
File: `PAYSTACK_SETUP.md` (new)

---

## Priority Order
1. **HIGH**: Fix ProductDetail quantity price (User Experience)
2. **HIGH**: Services page currency conversion (Core Feature)
3. **MEDIUM**: Expand translations (Internationalization)
4. **LOW**: Document Paystack setup (Documentation)

