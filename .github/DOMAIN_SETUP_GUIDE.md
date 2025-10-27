# Domain & Email Setup Guide for omerakben.com

This guide walks you through configuring your domain with Vercel and setting up Resend for transactional emails.

## 🎯 Overview

We need to configure:
1. **Vercel** - Host the Next.js application on omerakben.com
2. **Resend** - Send transactional emails (contact forms, notifications)
3. **Squarespace DNS** - Point domain to Vercel and verify Resend

---

## Part 1: Vercel Domain Configuration

### Step 1: Add Domain to Vercel

1. Go to your Vercel project: https://vercel.com/omerakben/omerakben-com
2. Navigate to **Settings** → **Domains**
3. Add both domains:
   - `omerakben.com`
   - `www.omerakben.com`

### Step 2: Get Vercel DNS Records

After adding the domains, Vercel will show you the required DNS records:

**For apex domain (omerakben.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 3: Configure Squarespace DNS

1. Go to Squarespace DNS Settings (you already have this open)
2. **Remove or modify** the existing `_domainconnect` CNAME that points to Squarespace
3. **Add Vercel DNS records:**

   **A Record (apex domain):**
   - Host: `@`
   - Type: `A`
   - Value: `76.76.21.21`
   - TTL: `1 hour` (or `3600`)

   **CNAME Record (www):**
   - Host: `www`
   - Type: `CNAME`
   - Value: `cname.vercel-dns.com`
   - TTL: `1 hour`

4. **Save** the DNS changes

### Step 4: Wait for DNS Propagation

- DNS changes typically take 10-60 minutes to propagate
- Check status in Vercel dashboard - it should change from "Invalid Configuration" to "Valid"
- You can check DNS propagation at: https://www.whatsmydns.net/#A/omerakben.com

---

## Part 2: Resend Email Domain Setup

### Step 1: Add Domain to Resend

1. Go to Resend Dashboard: https://resend.com/domains
2. Click **Add Domain**
3. Enter: `omerakben.com`
4. Select region: `US East (N. Virginia)` (recommended for best performance)
5. Click **Add**

### Step 2: Get Resend DNS Records

After adding the domain, Resend will provide DNS records. You'll see something like:

```
SPF Record:
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all

DKIM Record:
Type: CNAME
Name: resend._domainkey
Value: resend._domainkey.u.resend.com

DMARC Record (optional but recommended):
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@omerakben.com
```

### Step 3: Add Resend DNS Records to Squarespace

Go back to Squarespace DNS Settings and add:

1. **SPF Record (TXT)**
   - Host: `@`
   - Type: `TXT`
   - Value: `v=spf1 include:_spf.resend.com ~all`

2. **DKIM Record (CNAME)**
   - Host: `resend._domainkey`
   - Type: `CNAME`
   - Value: `resend._domainkey.u.resend.com`

3. **DMARC Record (TXT)** - Optional but recommended
   - Host: `_dmarc`
   - Type: `TXT`
   - Value: `v=DMARC1; p=none; rua=mailto:dmarc@omerakben.com`

### Step 4: Verify Domain in Resend

1. Go back to Resend Dashboard → Domains
2. Click on `omerakben.com`
3. Click **Verify Domain**
4. Wait for verification (usually 5-15 minutes)
5. Status should change from "Pending" to "Verified" ✅

---

## Part 3: Configure Environment Variables

### Vercel Environment Variables

1. Go to Vercel project: https://vercel.com/omerakben/omerakben-com/settings/environment-variables
2. Add the following for **Production** environment:

```env
OPENAI_API_KEY=sk-proj-U6bQrJq... (your full key from .env)
UPSTASH_REDIS_REST_URL=https://shining-bobcat-5247.upstash.io
UPSTASH_REDIS_REST_TOKEN=ARR_AAImcDE... (your full token)
UPSTASH_VECTOR_REST_URL=https://oriented-dogfish-26492-us1-vector.upstash.io
UPSTASH_VECTOR_REST_TOKEN=ABoFMG9yaWVu... (your full token)
RESEND_API_KEY=re_VAMAwJxv_ESjFzQ29wQ13gDB6b4yxLRzG
```

3. **Important**: Set these for all environments if you want preview deployments to work

### GitHub Actions Secrets

1. Go to GitHub repository: https://github.com/omerakben/omer-akben/settings/secrets/actions
2. Verify all secrets are set:
   - ✅ `OPENAI_API_KEY`
   - ✅ `UPSTASH_REDIS_REST_URL`
   - ✅ `UPSTASH_REDIS_REST_TOKEN`
   - ✅ `UPSTASH_VECTOR_REST_URL`
   - ✅ `UPSTASH_VECTOR_REST_TOKEN`
   - ✅ `RESEND_API_KEY` (add this if missing)

---

## Part 4: Implement Contact Form Email

### Step 1: Install Resend SDK

```bash
npm install resend
```

### Step 2: Create Email API Route

Create `src/app/api/contact/send/route.ts`:

```typescript
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip ?? 'anonymous';
    const rateLimitResult = await rateLimit(ip, 'contact-form', {
      limit: 3,
      window: 3600, // 3 submissions per hour
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, email, message, subject } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'contact@omerakben.com', // Must be verified domain
      to: 'akbenof@gmail.com', // Your personal email
      replyTo: email, // User's email for easy reply
      subject: subject || `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="margin: 20px 0;">
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || 'No subject provided'}</p>
          </div>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #666;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
          
          <p style="color: #666; font-size: 12px;">
            This email was sent from the contact form at omerakben.com
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[contact:POST] Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      emailId: data?.id,
    });

  } catch (error) {
    console.error('[contact:POST] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Step 3: Update Contact Page (Optional)

If you want to add a contact form to your contact page, you can create a form component that calls the new API route.

---

## Part 5: Testing & Verification

### Test Checklist

1. **Vercel Deployment**
   - [ ] Visit https://omerakben.com (should load your site)
   - [ ] Visit https://www.omerakben.com (should redirect to apex domain)
   - [ ] Check HTTPS is working (🔒 padlock in browser)

2. **Resend Email**
   - [ ] Domain status shows "Verified" in Resend dashboard
   - [ ] Send a test email:
     ```bash
     curl -X POST https://omerakben.com/api/contact/send \
       -H "Content-Type: application/json" \
       -d '{
         "name": "Test User",
         "email": "test@example.com",
         "message": "This is a test message",
         "subject": "Test Subject"
       }'
     ```
   - [ ] Check your email at akbenof@gmail.com for the test message

3. **DNS Propagation**
   - Check A record: `dig omerakben.com +short` (should return 76.76.21.21)
   - Check CNAME: `dig www.omerakben.com +short` (should return cname.vercel-dns.com)
   - Check SPF: `dig txt omerakben.com +short` (should show SPF record)
   - Check DKIM: `dig cname resend._domainkey.omerakben.com +short`

---

## Part 6: Trigger Production Deployment

After all environment variables are set in Vercel:

```bash
# Make a small change to trigger deployment
git commit --allow-empty -m "chore: trigger production deployment after env setup"
git push origin main
```

Or manually trigger deployment in Vercel dashboard:
1. Go to **Deployments** tab
2. Click **...** on the latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache** = No

---

## 🔍 Troubleshooting

### Vercel Domain Shows "Invalid Configuration"

**Solution:**
- Wait 10-30 minutes for DNS propagation
- Verify A record is set to 76.76.21.21
- Remove conflicting DNS records in Squarespace
- Try clicking "Refresh" in Vercel domain settings

### Resend Domain Verification Failed

**Solution:**
- Check all 3 DNS records are added correctly (SPF, DKIM, DMARC)
- Wait 15-30 minutes for DNS propagation
- Click "Verify Domain" again in Resend dashboard
- Check DNS records: `dig txt omerakben.com` and `dig cname resend._domainkey.omerakben.com`

### Build Fails on Vercel

**Solution:**
- Check environment variables are set correctly
- Look at build logs in Vercel dashboard
- Ensure all required secrets are in Production environment
- Check GitHub Actions is passing first

### Emails Not Sending

**Solution:**
- Verify Resend domain status is "Verified"
- Check `from` address matches your verified domain (e.g., `contact@omerakben.com`)
- Check Vercel function logs for errors
- Verify RESEND_API_KEY is set in Vercel environment variables

---

## 📊 Final DNS Configuration Summary

After setup, your Squarespace DNS should have:

```
# Vercel (Website Hosting)
@ → A → 76.76.21.21
www → CNAME → cname.vercel-dns.com

# Resend (Email)
@ → TXT → v=spf1 include:_spf.resend.com ~all
resend._domainkey → CNAME → resend._domainkey.u.resend.com
_dmarc → TXT → v=DMARC1; p=none; rua=mailto:dmarc@omerakben.com

# Keep Google Workspace records (if you have them)
@ → MX → aspmx.l.google.com (priority 1)
@ → MX → alt1.aspmx.l.google.com (priority 5)
# ... other Google MX records
```

---

## ✅ Success Criteria

You'll know everything is working when:

- ✅ `https://omerakben.com` loads your portfolio
- ✅ `https://www.omerakben.com` redirects to apex domain
- ✅ Vercel dashboard shows "Valid" for both domains
- ✅ Resend dashboard shows "Verified" for omerakben.com
- ✅ Test email successfully received at akbenof@gmail.com
- ✅ GitHub Actions workflow passes ✅
- ✅ All quality gates green

---

## 📞 Need Help?

If you encounter issues:
1. Check Vercel deployment logs
2. Check GitHub Actions workflow run
3. Verify DNS propagation: https://www.whatsmydns.net
4. Check Resend domain status
5. Review Vercel function logs for API errors

Happy deploying! 🚀
