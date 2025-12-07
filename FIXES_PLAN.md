# Implementation Plan: Complete Multi-Language & Payment Integration

## Issues to Address

### 1. ✅ Full Website Translation
- Expand translation files to cover ALL pages
- Add translation keys for Services, About, Projects, etc.
- Ensure all static text uses `t()` function

### 2. ✅ Services Page Currency Conversion + Paystack
- Convert all pricing to use RegionContext
- Integrate Paystack payment for service plans
- Add "Choose Plan" functionality

### 3. ✅ Cart Blank Screen Fix
- Debug CartContext initialization
- Fix navigation to /cart
- Ensure proper loading states

### 4. ✅ Product Quantity Price Update
- Fix ProductDetail page quantity selector
- Update total price calculation
- Ensure real-time price updates

### 5. ✅ Paystack Secret Key Configuration
- Document where to add secret key
- Create Supabase Edge Function for payment processing
- Secure API key handling

## Implementation Order

1. Fix Cart blank screen (Critical)
2. Fix Product quantity price update (Critical)
3. Add Services page currency + payment (High Priority)
4. Expand translations (Medium Priority)
5. Document Paystack secret key setup (Documentation)

---

## Detailed Steps

### Step 1: Fix Cart Context & Blank Screen
**Files**: `CartContext.tsx`, `Cart.tsx`
- Add error boundaries
- Fix async loading
- Add fallback UI

### Step 2: Fix Product Detail Quantity
**Files**: `ProductDetail.tsx`
- Fix quantity state management
- Update price calculation
- Add convertPrice integration

### Step 3: Services Page Enhancement
**Files**: `Services.tsx`
- Add useRegion hook
- Convert all prices
- Add Paystack integration
- Create payment modal

### Step 4: Expand Translations
**Files**: All locale JSON files
- Add services translations
- Add common UI elements
- Add error messages

### Step 5: Paystack Configuration
**Files**: `.env`, `supabase/functions/`
- Document secret key location
- Create Edge Function
- Add payment verification

