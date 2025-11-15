# i18n Implementation Guide

## ✅ What Has Been Completed

### 1. **i18n Setup** ✅
- ✅ Installed `react-i18next`, `i18next`, `i18next-browser-languagedetector`
- ✅ Created i18n configuration (`src/i18n/config.ts`)
- ✅ Created English translations (`src/i18n/locales/en.json`)
- ✅ Created Yoruba translations (`src/i18n/locales/yo.json`)
- ✅ Integrated i18n with App.tsx
- ✅ Updated RegionContext to support language switching

### 2. **Language Switcher Component** ✅
- ✅ Created `LanguageSwitcher.tsx` component
- ✅ Added to Header (desktop and mobile)
- ✅ Supports icon and full variants
- ✅ Shows current language with flag emoji
- ✅ Dropdown menu with language selection

### 3. **Partial Component Updates** ✅
- ✅ Updated `Shop.tsx` with key translations:
  - Search placeholder
  - "No products found"
  - "Clear filters"
  - "Add to Cart"
  - "Out of Stock"

---

## 📋 How to Use i18n in Components

### Basic Usage

```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <button>{t('common.submit')}</button>
    </div>
  );
};
```

### With Variables

```typescript
// In translation file:
{
  "greeting": "Hello, {{name}}!"
}

// In component:
<p>{t('greeting', { name: user.name })}</p>
```

### With Pluralization

```typescript
// In translation file:
{
  "items": "{{count}} item",
  "items_plural": "{{count}} items"
}

// In component:
<p>{t('items', { count: cartItemCount })}</p>
```

---

## 🔄 Components That Need Translation Updates

### High Priority (User-Facing)

#### 1. **Cart.tsx** (`src/pages/Cart.tsx`)
Replace:
- "Shopping Cart" → `t('cart.title')`
- "Your cart is empty" → `t('cart.empty')`
- "Continue Shopping" → `t('cart.continue_shopping')`
- "Subtotal" → `t('cart.subtotal')`
- "Total" → `t('cart.total')`
- "Proceed to Checkout" → `t('cart.checkout')`
- "Remove" → `t('cart.remove')`
- "Quantity" → `t('cart.quantity')`

#### 2. **ProductDetail.tsx** (`src/pages/ProductDetail.tsx`)
Replace:
- "Add to Cart" → `t('product.add_to_cart')`
- "Buy Now" → `t('product.buy_now')`
- "Description" → `t('product.description')`
- "Specifications" → `t('product.specifications')`
- "Reviews" → `t('product.reviews')`
- "Related Products" → `t('product.related_products')`
- "In Stock" → `t('product.in_stock')`
- "Out of Stock" → `t('product.out_of_stock')`
- "SKU" → `t('product.sku')`
- "Category" → `t('product.category')`
- "Brand" → `t('product.brand')`

#### 3. **Checkout.tsx** (`src/pages/Checkout.tsx`)
Replace:
- "Checkout" → `t('checkout.title')`
- "Shipping Address" → `t('checkout.shipping_address')`
- "Billing Address" → `t('checkout.billing_address')`
- "Payment Method" → `t('checkout.payment_method')`
- "Order Summary" → `t('checkout.order_summary')`
- "Place Order" → `t('checkout.place_order')`
- "Full Name" → `t('checkout.full_name')`
- "Email Address" → `t('checkout.email')`
- "Phone Number" → `t('checkout.phone')`
- "Street Address" → `t('checkout.address')`
- "City" → `t('checkout.city')`
- "State/Province" → `t('checkout.state')`
- "Postal Code" → `t('checkout.postal_code')`
- "Country" → `t('checkout.country')`
- "Same as shipping address" → `t('checkout.same_as_shipping')`

#### 4. **Auth.tsx** (`src/pages/Auth.tsx`)
Replace:
- "Login" → `t('auth.login')`
- "Sign Up" → `t('auth.signup')`
- "Email Address" → `t('auth.email')`
- "Password" → `t('auth.password')`
- "Confirm Password" → `t('auth.confirm_password')`
- "Forgot Password?" → `t('auth.forgot_password')`
- "Remember Me" → `t('auth.remember_me')`
- "Don't have an account?" → `t('auth.no_account')`
- "Already have an account?" → `t('auth.have_account')`

#### 5. **Header.tsx** (`src/components/layout/Header.tsx`)
Replace navigation items:
- "Home" → `t('nav.home')`
- "About" → `t('nav.about')`
- "Solutions" → `t('nav.solutions')`
- "Shop" → `t('nav.shop')`
- "Partners" → `t('nav.partners')`
- "Contact" → `t('nav.contact')`
- "Login" → `t('nav.login')`
- "Sign Up" → `t('nav.signup')`
- "Logout" → `t('nav.logout')`
- "Dashboard" → `t('nav.dashboard')`

#### 6. **Footer.tsx** (`src/components/layout/Footer.tsx`)
Replace:
- "About Us" → `t('footer.about_us')`
- "Contact Us" → `t('footer.contact_us')`
- "Privacy Policy" → `t('footer.privacy_policy')`
- "Terms of Service" → `t('footer.terms_of_service')`
- "Follow Us" → `t('footer.follow_us')`
- "Subscribe to our newsletter" → `t('footer.newsletter')`
- "Subscribe" → `t('footer.subscribe')`
- Copyright text → `t('footer.copyright')`

### Medium Priority (Dashboard Components)

#### 7. **ClientDashboard.tsx**
Replace tab names and labels with `t('dashboard.*')` keys

#### 8. **PartnersDashboard.tsx**
Replace tab names and labels with `t('partner.*')` keys

#### 9. **AdminDashboard.tsx**
Replace tab names and labels with `t('admin.*')` keys

### Low Priority (Static Pages)

#### 10. **Index.tsx** (Homepage)
Replace hero section text with `t('hero.*')` keys

#### 11. **About.tsx**, **Solutions.tsx**, etc.
These can be translated later as they contain more static content

---

## 🌍 Available Translation Keys

All translation keys are defined in:
- `src/i18n/locales/en.json` (English)
- `src/i18n/locales/yo.json` (Yoruba)

### Key Categories:
- `common.*` - Common UI elements (save, cancel, delete, etc.)
- `nav.*` - Navigation items
- `hero.*` - Homepage hero section
- `shop.*` - Shop page
- `cart.*` - Shopping cart
- `product.*` - Product details
- `checkout.*` - Checkout flow
- `dashboard.*` - Dashboard sections
- `auth.*` - Authentication forms
- `partner.*` - Partner dashboard
- `admin.*` - Admin dashboard
- `footer.*` - Footer links
- `errors.*` - Error messages
- `success.*` - Success messages

---

## 🎯 Quick Implementation Steps

### For Each Component:

1. **Import useTranslation hook:**
   ```typescript
   import { useTranslation } from 'react-i18next';
   ```

2. **Get the translation function:**
   ```typescript
   const { t } = useTranslation();
   ```

3. **Replace hardcoded strings:**
   ```typescript
   // Before:
   <h1>Shopping Cart</h1>
   
   // After:
   <h1>{t('cart.title')}</h1>
   ```

4. **Test language switching:**
   - Click the language switcher in the header
   - Verify all translated strings update correctly

---

## 🧪 Testing Checklist

- [ ] Language switcher appears in header (desktop and mobile)
- [ ] Clicking language switcher shows English and Yoruba options
- [ ] Selecting a language updates all translated strings
- [ ] Language preference persists after page reload
- [ ] All translated strings display correctly in both languages
- [ ] No missing translation keys (check browser console)
- [ ] Fallback to English works for missing translations

---

## 📝 Adding New Translations

### 1. Add to English file (`src/i18n/locales/en.json`):
```json
{
  "mySection": {
    "myKey": "My English Text"
  }
}
```

### 2. Add to Yoruba file (`src/i18n/locales/yo.json`):
```json
{
  "mySection": {
    "myKey": "Ọ̀rọ̀ Mi Ní Yorùbá"
  }
}
```

### 3. Use in component:
```typescript
<p>{t('mySection.myKey')}</p>
```

---

## 🚀 Next Steps

1. **Complete High Priority Components** - Update Cart, ProductDetail, Checkout, Auth pages
2. **Update Navigation** - Translate Header and Footer
3. **Update Dashboards** - Translate dashboard components
4. **Test Thoroughly** - Test all pages in both languages
5. **Add More Languages** - Add French, Spanish, etc. as needed

---

## 💡 Tips

- **Keep keys organized** - Use nested objects for related translations
- **Use descriptive keys** - `shop.add_to_cart` is better than `btn1`
- **Avoid hardcoded text** - Always use translation keys
- **Test both languages** - Make sure translations make sense in context
- **Use variables** - For dynamic content like names, counts, etc.
- **Handle pluralization** - Use i18next pluralization features
- **Keep translations short** - Especially for buttons and labels

---

## 📚 Resources

- [react-i18next Documentation](https://react.i18next.com/)
- [i18next Documentation](https://www.i18next.com/)
- [Yoruba Language Resources](https://www.yorubalanguage.org/)

---

**Status:** ✅ Foundation Complete | 🔄 Component Updates In Progress

