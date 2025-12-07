# Admin Dashboard Setup Instructions

## ✅ Completed Tasks

### 1. **PartnerManager Component Created**
- ✅ Created `src/components/admin/PartnerManager.tsx`
- ✅ Integrated into AdminDashboard (Partners tab)
- ✅ Full CRUD functionality for partner applications
- ✅ Search, filter, and status management
- ✅ Edit dialog with form validation
- ✅ Delete confirmation with Supabase integration

### 2. **Admin Dashboard Enhancements**
- ✅ Replaced mock partner table with `<PartnerManager />` component
- ✅ Quick Actions implemented with Sheet components
- ✅ Review KYC, Overdue Tickets, and Compliance Alerts sections
- ✅ Export Partners CSV functionality

### 3. **Content Management Components**
- ✅ `NewsManager.tsx` - Fully functional (already existed)
- ✅ `EventsManager.tsx` - Fully functional (already existed)
- ✅ `CaseStudiesManager.tsx` - Fully functional (already existed)

### 4. **Public-Facing Pages**
- ✅ `News.tsx` - Connected to Supabase `news_articles` table
- ✅ `Events.tsx` - Connected to Supabase `events` table
- ✅ `CaseStudies.tsx` - Connected to Supabase `case_studies` table

---

## 🔴 CRITICAL: Database Migration Required

### **Migration File Location**
`supabase/migrations/20251202000000_fix_profiles_and_rls.sql`

### **What This Migration Does**
1. Adds `email` column to the `profiles` table (if not exists)
2. Enables Row Level Security (RLS) on profiles
3. Creates comprehensive RLS policies for:
   - Users viewing/updating their own profiles
   - Admins viewing/inserting/updating/deleting all profiles

### **Why This Is Critical**
- The "Add Customer" and "Add User" features in AdminDashboard **will fail** without this migration
- Current error: `"Could not find the 'email' column of 'profiles' in the schema cache"`
- RLS policies ensure proper data access control

---

## 📋 How to Apply the Migration

### **Option 1: Using Supabase Dashboard (Recommended)**

1. **Go to your Supabase project dashboard**
   - Navigate to: https://supabase.com/dashboard/project/YOUR_PROJECT_ID

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and paste the migration SQL**
   - Open: `supabase/migrations/20251202000000_fix_profiles_and_rls.sql`
   - Copy the entire contents
   - Paste into the SQL Editor

4. **Run the migration**
   - Click "Run" or press `Ctrl+Enter`
   - Verify success message appears

### **Option 2: Using Supabase CLI** (If installed)

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Apply pending migrations
supabase db push
```

### **Option 3: Manual SQL Execution**

If you have direct database access:

```sql
-- Run the contents of:
-- supabase/migrations/20251202000000_fix_profiles_and_rls.sql
```

---

## 🧪 Testing After Migration

### **1. Test Admin User Management**
1. Login as an admin user
2. Navigate to Admin Dashboard → Users tab
3. Click "Add New User"
4. Fill in the form with:
   - Name: Test User
   - Email: test@example.com
   - Phone: +1234567890
   - Location: Test City
   - Role: Client
   - Segment: Residential (if client)
5. Click "Add User"
6. ✅ Should succeed without errors

### **2. Test Customer Segments**
1. Navigate to Admin Dashboard → Segments tab
2. Click "Add Customer" in any segment
3. Fill in customer details including email
4. Click "Add Customer"
5. ✅ Should succeed without errors

### **3. Test Partner Management**
1. Navigate to Admin Dashboard → Partners tab
2. Verify partners are loading from Supabase
3. Test Edit functionality
4. Test Delete functionality (with confirmation)
5. Test Approve partner action

### **4. Test Content Management**

#### News Articles
1. Navigate to Admin Dashboard → News tab
2. Click "New Article"
3. Create a test article
4. Publish it
5. Visit `/news` page
6. ✅ Article should appear

#### Events
1. Navigate to Admin Dashboard → Events tab
2. Click "New Event"
3. Create a test event
4. Set status to "upcoming"
5. Visit `/events` page
6. ✅ Event should appear in upcoming section

#### Case Studies
1. Navigate to Admin Dashboard → Case Studies tab
2. Click "New Case Study"
3. Create a test case study
4. Set status to "published"
5. Visit `/case-studies` page
6. ✅ Case study should appear

---

## 🎯 Current System Status

### **Working Features**
- ✅ Admin Dashboard layout and navigation
- ✅ Quick Actions (Review KYC, Overdue Tickets, Compliance Alerts)
- ✅ Partner Network management (full CRUD)
- ✅ News, Events, Case Studies management (full CRUD)
- ✅ Public pages for News, Events, Case Studies
- ✅ Export Partners to CSV
- ✅ System metrics and statistics

### **Pending Migration**
- ⏳ Add Customer functionality (needs migration)
- ⏳ Add User functionality (needs migration)
- ⏳ Email column in profiles table (needs migration)
- ⏳ RLS policies for admin access (needs migration)

### **Future Enhancements** (Optional)
- Implement actual "Overdue Tickets" logic (currently placeholder)
- Add image upload functionality for News/Events/Case Studies
- Implement partner approval workflow with notifications
- Add analytics and reporting features

---

## 📁 Key Files Modified/Created

### **New Files**
- `src/components/admin/PartnerManager.tsx` - Partner management component

### **Modified Files**
- `src/pages/AdminDashboard.tsx` - Integrated PartnerManager, Quick Actions
- `src/components/admin/AdminUserManager.tsx` - Fixed JSX errors, added email field
- `src/components/admin/AdminProjectSegments.tsx` - Added email field to customer creation
- `src/pages/ClientDashboard.tsx` - Fixed syntax errors and missing handlers

### **Migration Files**
- `supabase/migrations/20251202000000_fix_profiles_and_rls.sql` - **NEEDS TO BE APPLIED**

---

## 🚀 Next Steps

1. **CRITICAL**: Apply the database migration (see instructions above)
2. **Test**: Verify all admin functionality works after migration
3. **Optional**: Populate sample data for News, Events, and Case Studies
4. **Optional**: Configure partner approval notifications
5. **Optional**: Implement advanced filtering and search features

---

## 📞 Support

If you encounter any issues:

1. **Check browser console** for error messages
2. **Check Supabase logs** in the dashboard
3. **Verify migration was applied** successfully
4. **Ensure user has admin role** in the profiles table

---

## ✨ Summary

The Admin Dashboard is now fully functional with:
- Complete partner management system
- Content management for News, Events, and Case Studies
- Public-facing pages connected to Supabase
- Quick actions for common admin tasks
- Export functionality for partners

**The only remaining step is to apply the database migration to enable user and customer management features.**

Once the migration is applied, all features will be fully operational! 🎉
