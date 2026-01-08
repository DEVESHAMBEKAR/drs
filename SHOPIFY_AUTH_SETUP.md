# Shopify Customer Login Setup Guide

## 🔐 Overview

Your Deep Root Studios website now has a Login/Signup system that integrates with Shopify's Customer Accounts. This allows customers to:
- Create accounts
- Log in to view order history
- Save addresses
- Track orders
- Manage their profile

---

## 📋 How It Works

### **Current Implementation**

The authentication system redirects users to Shopify's hosted customer account pages:

1. **Login**: Redirects to `https://your-store.myshopify.com/account/login`
2. **Signup**: Redirects to `https://your-store.myshopify.com/account/register`
3. **Password Recovery**: Redirects to `https://your-store.myshopify.com/account/login#recover`

### **User Flow**

1. User clicks "LOGIN" button in header
2. Modal opens with login/signup form
3. User enters credentials and submits
4. User is redirected to Shopify's customer account page
5. After authentication, they can be redirected back to your site

---

## ⚙️ Configuration Steps

### **Step 1: Update Your Store Domain**

Open `src/components/AuthModal.jsx` and replace the placeholder domain with your actual Shopify store domain:

**Find these lines (lines 36, 43, 238):**
```javascript
const shopDomain = 'your-store.myshopify.com'; // TODO: Replace with your actual domain
```

**Replace with:**
```javascript
const shopDomain = 'deeprootstudios.myshopify.com'; // Your actual store domain
```

---

### **Step 2: Enable Customer Accounts in Shopify**

1. **Log in to Shopify Admin**
   - Go to `https://admin.shopify.com/`

2. **Navigate to Settings**
   - Click **Settings** (bottom left)

3. **Go to Customer Accounts**
   - Click **Checkout** in the left sidebar
   - Scroll to **Customer accounts** section

4. **Enable Customer Accounts**
   - Select one of these options:
     - **Accounts are optional** (Recommended) - Customers can checkout as guests or create accounts
     - **Accounts are required** - All customers must create accounts
     - **Accounts are disabled** - No customer accounts (not recommended if you want login)

5. **Save Changes**

---

### **Step 3: Customize Customer Account Pages (Optional)**

You can customize the look of Shopify's customer account pages:

1. **Go to Online Store → Themes**
2. **Click "Customize" on your active theme**
3. **Navigate to "Customers" section**
4. **Customize:**
   - Login page
   - Registration page
   - Account page
   - Order history page

---

## 🎨 Features Included

### **AuthModal Component**

✅ **Login Form**
- Email input
- Password input
- "Forgot password?" link
- Redirects to Shopify login

✅ **Signup Form**
- First name
- Last name
- Email
- Password
- Redirects to Shopify registration

✅ **Premium Design**
- Dark theme matching your brand
- Smooth animations
- Form validation
- Error handling
- Loading states

✅ **Header Integration**
- User icon button
- "LOGIN" text on desktop
- Smooth modal transitions

---

## 🔄 Advanced: Custom Authentication (Optional)

If you want to handle authentication directly in your app instead of redirecting to Shopify, you'll need to:

### **Option 1: Shopify Customer Account API (Headless)**

Use Shopify's Customer Account API for a fully custom experience:

1. **Enable Customer Account API**
   - In Shopify Admin → Settings → Apps and sales channels
   - Create a custom app with Customer Account API access

2. **Update AuthModal.jsx**
   - Replace redirect logic with API calls
   - Handle tokens and sessions
   - Store customer data in context

**Example:**
```javascript
const handleLogin = async () => {
    const response = await fetch('https://shopify.dev/api/customer-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: formData.email,
            password: formData.password,
        }),
    });
    const data = await response.json();
    // Handle authentication token
};
```

### **Option 2: Multipass (Shopify Plus Only)**

If you're on Shopify Plus, you can use Multipass for seamless SSO:

1. **Enable Multipass** in Shopify Admin
2. **Generate Multipass tokens** on your backend
3. **Redirect users** with token for automatic login

---

## 🧪 Testing

### **Test Login Flow**

1. **Open your website**: `http://localhost:5173/`
2. **Click "LOGIN"** button in header
3. **Modal should open** with login form
4. **Enter test credentials** (or click "Sign up")
5. **Submit form**
6. **Should redirect** to Shopify customer login page

### **Test Signup Flow**

1. **Click "LOGIN"** button
2. **Click "Don't have an account? Sign up"**
3. **Form switches** to signup mode
4. **Fill in details**
5. **Submit**
6. **Should redirect** to Shopify registration page

---

## 🎯 What Customers Can Do

Once logged in to their Shopify account, customers can:

✅ **View Order History**
- See all past orders
- Track shipments
- View order details

✅ **Manage Addresses**
- Save shipping addresses
- Set default address
- Add multiple addresses

✅ **Update Profile**
- Change email
- Update password
- Edit personal information

✅ **Faster Checkout**
- Saved addresses auto-fill
- Saved payment methods (if enabled)
- Order history reference

---

## 📊 Shopify Admin - Customer Management

### **View Customers**

1. **Go to Customers** in Shopify Admin
2. **See all registered customers**
3. **View customer details:**
   - Order history
   - Total spent
   - Addresses
   - Tags
   - Notes

### **Customer Tags**

You can tag customers for:
- VIP customers
- Wholesale buyers
- Newsletter subscribers
- Special discounts

---

## 🔒 Security Best Practices

### **1. Use HTTPS**
- Always use HTTPS in production
- Shopify handles this automatically for customer pages

### **2. Password Requirements**
- Shopify enforces minimum password strength
- Customers must verify email addresses

### **3. Data Privacy**
- Customer data is stored securely by Shopify
- GDPR compliant
- You can export/delete customer data as needed

---

## 🐛 Troubleshooting

### **Issue: "Login button doesn't work"**

**Check:**
1. ✅ AuthModal is imported in Header.jsx
2. ✅ Modal state is managed correctly
3. ✅ No console errors
4. ✅ Lucide-react is installed

### **Issue: "Redirect doesn't work"**

**Check:**
1. ✅ Store domain is correct in AuthModal.jsx
2. ✅ Customer accounts are enabled in Shopify
3. ✅ URL format is correct

### **Issue: "Can't create account"**

**Check:**
1. ✅ Customer accounts are enabled (not disabled)
2. ✅ Email is valid and not already registered
3. ✅ Password meets Shopify requirements

---

## 🚀 Quick Setup Checklist

- [ ] Update store domain in `AuthModal.jsx` (3 locations)
- [ ] Enable customer accounts in Shopify Admin
- [ ] Test login button in header
- [ ] Test modal open/close
- [ ] Test redirect to Shopify login page
- [ ] Test redirect to Shopify signup page
- [ ] Customize Shopify customer pages (optional)
- [ ] Test full login flow with real account

---

## 📞 Need Help?

If you're stuck:

1. **Check browser console** (F12) for errors
2. **Verify Shopify settings** for customer accounts
3. **Test with a real Shopify account**
4. **Check network tab** to see redirect URLs

---

## ✨ You're All Set!

Your Deep Root Studios website now has:
- ✅ Professional login/signup modal
- ✅ Shopify customer account integration
- ✅ Premium dark design
- ✅ Smooth animations
- ✅ Mobile responsive

Just update the store domain and you're ready to go! 🎉

---

**Built with ❤️ for Deep Root Studios**
