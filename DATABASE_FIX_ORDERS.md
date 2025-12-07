# 🔧 DATABASE SCHEMA FIX - Orders Table

## ❌ Problem
The `orders` table in the database has a column called `total`, but the code expects `total_amount`.

**Error Message:**
```
Could not find the 'total_amount' column of 'orders' in the schema cache
```

## ✅ Solution

You need to run this SQL in your Supabase SQL Editor to add the `total_amount` column:

### Option 1: Add Generated Column (Recommended)

```sql
-- Add total_amount as a generated column that mirrors total
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS total_amount DECIMAL(12, 2) GENERATED ALWAYS AS (total) STORED;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_orders_total_amount ON public.orders(total_amount);
```

### Option 2: Rename Column (Alternative)

```sql
-- Rename total to total_amount
ALTER TABLE public.orders 
RENAME COLUMN total TO total_amount;
```

## 📋 How to Run the SQL

### Method 1: Supabase Dashboard (Easiest)

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Paste the SQL from Option 1 above
6. Click **Run** button
7. You should see "Success. No rows returned"

### Method 2: Supabase CLI

```bash
# Make sure you're in the project directory
cd "C:/Users/USER/Desktop/Eagle and Thistle Cursor/eagle-thistle-ecosystem-21 backup"

# Run the migration
npx supabase db push
```

## 🧪 Verify the Fix

After running the SQL, test the checkout:

1. Add a product to cart
2. Go to checkout
3. Fill in shipping address
4. Click "Place Order"
5. Should work without the column error!

## 📝 What This Does

The SQL adds a `total_amount` column that automatically mirrors the value of the `total` column. This way:
- Existing code that uses `total` still works
- New code that expects `total_amount` also works
- No data migration needed
- Backward compatible

## ⚠️ Already Fixed in Code

I've already updated `Checkout.tsx` to use the correct column names:
- ✅ `subtotal` instead of missing field
- ✅ `tax` instead of missing field  
- ✅ `shipping_fee` instead of missing field
- ✅ `total` for the main total

But other components (OrderConfirmation, ClientOrderHistory, etc.) still expect `total_amount`, so adding the generated column is the best solution.

## 🎯 Quick Fix Summary

**Run this in Supabase SQL Editor:**

```sql
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS total_amount DECIMAL(12, 2) GENERATED ALWAYS AS (total) STORED;

CREATE INDEX IF NOT EXISTS idx_orders_total_amount ON public.orders(total_amount);
```

**That's it!** The checkout will work after this.

