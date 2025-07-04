# Google Analytics Setup Guide

## 🆓 Google Analytics is FREE!

Google Analytics 4 (GA4) is completely free and handles millions of events per month. Perfect for tracking your astrology website's performance.

## 📋 Step-by-Step Setup

### 1. Create Google Analytics Account

1. **Visit**: [analytics.google.com](https://analytics.google.com)
2. **Sign in** with your Google account
3. **Click "Start measuring"**
4. **Account Setup**:
   - Account name: "Orbit and Chill"
   - Keep default data sharing settings
   - Click "Next"

### 2. Create Property

1. **Property Setup**:
   - Property name: "Orbit and Chill Website"
   - Reporting time zone: Your timezone
   - Currency: Your preferred currency
   - Click "Next"

2. **Business Information**:
   - Industry: "Arts & Entertainment" or "Online Communities"
   - Business size: Choose appropriate size
   - Use case: Select "Examine user behavior" and "Measure advertising ROI"
   - Click "Create"

### 3. Set Up Data Stream

1. **Choose Platform**: Select "Web"
2. **Web Stream Setup**:
   - Website URL: Your actual domain (e.g., `https://orbit-and-chill.com`)
   - Stream name: "Main Website"
   - Enhanced measurement: Keep enabled (tracks scrolls, clicks, file downloads, etc.)
   - Click "Create stream"

3. **Copy Measurement ID**: You'll see something like `G-XXXXXXXXXX`

### 4. Add to Environment Variables

Create or update your `.env.local` file:

```env
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Replace `G-XXXXXXXXXX` with your actual Measurement ID!**

### 5. Test Your Setup

1. **Start your development server**: `npm run dev`
2. **Visit your website** in incognito mode
3. **Go to Google Analytics**:
   - Reports → Realtime
   - You should see your visit appear within a few seconds!

## 📊 What You'll Track

### Automatic Tracking (Enabled by Default)
- ✅ Page views
- ✅ Scroll depth
- ✅ File downloads
- ✅ Outbound link clicks
- ✅ Site search (if you have search)
- ✅ Video engagement

### Custom Astrology Events (Already Set Up)
- 🔮 **Chart Generation**: Track when users generate natal charts
- 📝 **Blog Post Views**: Track which astrology articles are popular
- 💬 **Discussion Views**: Track forum engagement
- 👤 **User Registration**: Track Google vs anonymous sign-ups
- 🔍 **Search Usage**: Track what users search for

### Example Usage in Your Code

```typescript
import { trackChartGeneration, trackBlogPost } from '@/lib/analytics';

// Track when someone generates a natal chart
trackChartGeneration('natal');

// Track blog post views
trackBlogPost('Understanding Mars in Scorpio', 'Natal Charts');
```

## 🎯 Key Metrics to Monitor

### Content Performance
- **Top Blog Posts**: Which astrology topics are most popular?
- **Reading Patterns**: How long do users spend on articles?
- **Category Performance**: Natal charts vs. transits vs. compatibility?

### User Behavior
- **Chart Generation Rate**: How many visitors create charts?
- **User Journey**: Blog → Chart Generation → Discussion participation
- **Mobile vs Desktop**: Where are your users coming from?

### Growth Metrics
- **New vs Returning Users**: Building a loyal astrology community
- **Traffic Sources**: Organic search, social media, direct visits
- **Conversion Funnel**: Visitor → Chart Creator → Active User

## 🔧 Advanced Setup (Optional)

### Enhanced E-commerce Tracking
If you plan to sell astrology products/services:

```typescript
// Track purchases
gtag('event', 'purchase', {
  transaction_id: 'T12345',
  value: 25.00,
  currency: 'USD',
  items: [{
    item_id: 'natal_reading',
    item_name: 'Personal Natal Chart Reading',
    category: 'astrology_services',
    quantity: 1,
    price: 25.00
  }]
});
```

### Goal Setup in GA4
1. **Go to**: Admin → Events → Create Event
2. **Custom Events**:
   - "chart_completed" (when someone finishes creating a chart)
   - "email_signup" (newsletter subscriptions)
   - "premium_upgrade" (if you add premium features)

### Audience Segments
Create audiences for:
- **Active Chart Users**: Generated 2+ charts
- **Blog Readers**: Viewed 3+ blog posts
- **Forum Participants**: Posted in discussions

## 🔍 Privacy & GDPR Compliance

### Data Collection
Google Analytics is configured to:
- ✅ Anonymize IP addresses automatically
- ✅ Respect Do Not Track signals
- ✅ Use consent mode (if you add cookie banners)

### What Data is Collected
- **Anonymous user behavior** (page views, time on site)
- **Device information** (mobile/desktop, browser)
- **Traffic sources** (Google search, social media, direct)
- **Geographic location** (country/city level, not precise)

**No Personal Information**: Names, emails, or birth chart data is NOT sent to Google Analytics.

## 🚀 Quick Wins After Setup

### Week 1: Baseline
- Monitor daily active users
- Track top landing pages
- Identify most popular content

### Week 2: Optimization
- See which blog posts drive chart generation
- Identify user drop-off points
- Track mobile vs desktop usage

### Month 1: Growth
- Set up conversion goals
- Create custom reports for astrology metrics
- Use data to guide content strategy

## 🛟 Troubleshooting

### Not Seeing Data?
1. **Check Measurement ID**: Ensure it starts with `G-`
2. **Environment Variables**: Restart dev server after adding .env.local
3. **Ad Blockers**: Test in incognito mode
4. **Real-time Reports**: Data takes a few minutes to appear

### Common Issues
- **Mixed Content**: Ensure your site uses HTTPS
- **Missing Events**: Check browser console for errors
- **Low Data**: GA4 uses data sampling for privacy

## 📈 Expected Results

After proper setup, you should see:
- **Immediate**: Real-time visitor tracking
- **24 hours**: Detailed page view reports
- **1 week**: User behavior patterns
- **1 month**: Comprehensive analytics dashboard

## 🔮 Astrology-Specific Insights

### Content Strategy
- Which zodiac signs get the most searches?
- What time of day do people generate charts?
- Which astrological events drive traffic spikes?

### User Engagement
- Do full moon articles get more engagement?
- Which chart types are most popular?
- How does astrology content perform seasonally?

### Community Growth
- Track progression: Visitor → Chart User → Forum Member
- Identify most engaging discussion topics
- Monitor community health metrics

---

**Next Steps**: Once you have your `G-XXXXXXXXXX` ID, add it to your `.env.local` file and restart your development server. You'll start seeing data within minutes! 🌟