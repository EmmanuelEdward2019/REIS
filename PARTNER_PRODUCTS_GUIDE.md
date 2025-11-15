# Partner Products Management Guide

## Overview

This guide explains how to manage partner product listings in the Eagle & Thistle Group platform. Partners can submit products through their application form, and admins can approve/reject these products before they appear in the shop.

---

## 🔄 Product Workflow

### 1. Partner Submits Products
Partners submit product information in their application form (Step 11) in the `productSkus` field as free text. Example format:
```
- Solar Panels: Canadian Solar, JA Solar, Trina Solar (250W-550W)
- Inverters: Huawei, SMA, Fronius (3kW-100kW)
- Batteries: BYD, Pylontech, Tesla Powerwall
```

### 2. Admin Creates Product Records
Since products are submitted as free text, admins need to manually create structured product records in the database. This can be done through:
- **Admin Dashboard** → **Products Tab** → **Add Product** button (coming soon)
- **Direct Database Insert** (for now)

### 3. Admin Reviews & Approves
Once product records are created with `supplier_partner_id` and `source='partner'`:
- Products appear in the **Admin Dashboard → Products Tab**
- Admin can view full product details
- Admin can **Approve** (publishes to shop) or **Reject** (with notes)

### 4. Partner Manages Products
After approval, partners can:
- View their products in **Partners Dashboard → Products Tab**
- Update stock quantity
- Update pricing (NGN and GBP)
- View approval status and notes

---

## 📊 Database Schema

### Products Table Columns (Partner-Related)

| Column | Type | Description |
|--------|------|-------------|
| `supplier_partner_id` | UUID | Foreign key to `partner_profiles.id` |
| `approval_status` | TEXT | `pending`, `approved`, `rejected` |
| `approval_notes` | TEXT | Admin notes (especially for rejections) |
| `approved_by` | UUID | Admin user ID who approved/rejected |
| `approved_at` | TIMESTAMPTZ | When approval/rejection happened |
| `source` | TEXT | `admin`, `partner`, `import` |
| `is_active` | BOOLEAN | Whether product is visible in shop |

---

## 🛠️ How to Create Partner Products (Manual Process)

### Step 1: Find Partner Profile ID

```sql
-- Find partner profile by company name or email
SELECT id, company_name, email, user_id
FROM partner_profiles
WHERE company_name ILIKE '%company name%'
OR email = 'partner@email.com';
```

### Step 2: Insert Product Record

```sql
-- Insert a new partner product
INSERT INTO products (
  name,
  description,
  category,
  subcategory,
  brand,
  sku,
  price_ngn,
  price_gbp,
  stock_quantity,
  specifications,
  images,
  supplier_partner_id,
  source,
  approval_status,
  is_active
) VALUES (
  'Canadian Solar 550W Monocrystalline Panel',
  'High-efficiency monocrystalline solar panel with 25-year warranty. Ideal for residential and commercial installations.',
  'Solar Panels',
  'Monocrystalline',
  'Canadian Solar',
  'CS-550W-MONO-2024',
  125000.00,
  150.00,
  50,
  '{"wattage": "550W", "efficiency": "21.2%", "warranty": "25 years", "dimensions": "2278x1134x35mm", "weight": "27.5kg"}'::jsonb,
  '["https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800"]'::jsonb,
  'partner-profile-uuid-here',
  'partner',
  'pending',
  false
);
```

### Step 3: Admin Reviews in Dashboard

1. Go to **Admin Dashboard**
2. Click **Products** tab
3. See pending products in the table
4. Click **View** (eye icon) to see full details
5. Click **Approve** (green checkmark) or **Reject** (red X)
6. Add notes if rejecting

---

## ✅ Admin Product Approval Interface

### Features

**Search & Filter:**
- Search by product name, partner company, or brand
- Filter by status: All, Pending, Approved, Rejected

**Product Table Columns:**
- Product name and brand
- Partner company and contact person
- Category
- Price (NGN)
- Stock quantity
- Approval status badge
- Submitted date
- Action buttons

**Actions:**
- **View Details**: See full product information including specifications, partner info
- **Approve**: Set status to `approved`, activate product, record admin ID and timestamp
- **Reject**: Set status to `rejected`, add rejection notes, record admin ID and timestamp

**Approval Dialog:**
- Shows product name
- Optional notes field for approval
- Required notes field for rejection
- Confirm/Cancel buttons

---

## 🏪 Partner Product Management Interface

### Features

**Product List:**
- All products submitted by the partner
- Status badges: Pending Approval, Active, Inactive, Rejected
- Stock quantity with low stock warning (< 10 units)
- Prices in both NGN and GBP

**Edit Product (Approved Products Only):**
- Update stock quantity
- Update price (NGN)
- Update price (GBP)
- Cannot change name, description, category, etc. (contact support)

**Rejection Notes:**
- If product is rejected, partner can click eye icon to view rejection reason
- Partner should contact support to resubmit

---

## 🔐 Security & Permissions

### Row Level Security (RLS) Policies

**Partners Can:**
- Insert products with their own `supplier_partner_id`
- View their own products (any status)
- View all active products (for shop browsing)
- Update stock and pricing for their own approved products

**Admins Can:**
- View all products (any status, any partner)
- Update any product (approval status, notes, etc.)
- Delete any product

**Public Can:**
- View only active, approved products in the shop

---

## 📝 Product Approval Best Practices

### When to Approve:
✅ Product information is complete and accurate
✅ Images are high quality and relevant
✅ Pricing is reasonable and competitive
✅ Stock quantity is realistic
✅ Specifications are detailed and correct
✅ Partner is verified and in good standing

### When to Reject:
❌ Incomplete product information
❌ Poor quality or missing images
❌ Unrealistic pricing (too high or suspiciously low)
❌ Duplicate products already in catalog
❌ Product doesn't match platform categories
❌ Partner has compliance issues
❌ Product violates platform policies

### Rejection Notes Examples:
- "Product images are missing. Please upload high-quality product photos."
- "Price seems too high compared to market rates. Please review pricing."
- "Product description is incomplete. Please add detailed specifications."
- "This product is already listed by another supplier. Please contact support."
- "Product category doesn't match our platform offerings."

---

## 🚀 Future Enhancements

### Planned Features:
1. **Bulk Product Import**: CSV upload for partners to submit multiple products
2. **Product Templates**: Pre-filled forms for common product types
3. **Automated Approval**: AI-powered product validation and auto-approval for trusted partners
4. **Product Analytics**: Track views, sales, and performance metrics
5. **Inventory Sync**: Real-time inventory updates from partner systems
6. **Price Comparison**: Automatic market price comparison and alerts
7. **Product Reviews**: Customer reviews and ratings for partner products

---

## 📞 Support

For questions or issues with partner products:
- **Admin Support**: Contact platform administrator
- **Partner Support**: Email support@eagleandthistle.com
- **Technical Issues**: Check database logs and RLS policies

---

## 🔗 Related Documentation

- [Payment Setup Guide](PAYMENT_SETUP.md)
- [Partner Application Process](src/pages/BecomeAPartner.tsx)
- [Product Database Schema](supabase/migrations/20250928000000_create_ecommerce_tables.sql)
- [Partner Products Migration](supabase/migrations/20250931000000_link_products_to_partners.sql)

