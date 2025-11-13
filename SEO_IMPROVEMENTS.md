# SEO Improvements for Marfinetz Plumbing

## ✅ Implemented Improvements

### 1. **XML Sitemap** (`app/sitemap.ts`)
- Auto-generated sitemap at `/sitemap.xml`
- Includes all major pages with priority and change frequency
- Helps Google crawl and index your site efficiently
- **Action Required**: Submit to Google Search Console after deployment

### 2. **Robots.txt** (`app/robots.ts`)
- Auto-generated at `/robots.txt`
- Allows all pages except dashboard and API routes
- Points search engines to your sitemap
- Follows SEO best practices

### 3. **Structured Data (Schema.org)**
- Added LocalBusiness/Plumber schema to `app/layout.tsx`
- Tells Google you're a plumber serving specific areas
- Includes:
  - Business name, phone, website
  - Service areas (Erie County, Crawford County, Conneaut OH)
  - 24/7 availability
  - Service catalog (sewer camera, emergency, drain cleaning)
- **Benefit**: Increases chances of appearing in Google Local Pack

### 4. **Open Graph Tags**
- Added Facebook/LinkedIn sharing metadata
- When someone shares your site, it shows professional title and description
- Better social media visibility

### 5. **Twitter Card Tags**
- Optimized for Twitter sharing
- Professional preview when links are shared

### 6. **Meta Keywords**
- Added targeted keywords for local search
- Focuses on: Erie PA plumber, sewer camera, emergency plumbing

---

## 🚀 Additional SEO Recommendations

### **High Priority (Do These Next)**

#### 1. **Google Business Profile**
- Claim/verify your Google Business Profile
- Add business hours, photos, services
- Respond to reviews
- **Impact**: Critical for local SEO and Google Maps

#### 2. **Local Citations**
- List your business on:
  - Yelp
  - Angi (formerly Angie's List)
  - HomeAdvisor
  - Better Business Bureau
  - Yellow Pages
- **Impact**: Builds trust and local rankings

#### 3. **Get More Reviews**
- Google Reviews are crucial for local SEO
- Send review requests after successful jobs
- Add "Leave a Review" link to your website
- **Impact**: Reviews directly affect local rankings

#### 4. **Add Service Pages**
You mentioned these services on homepage but they don't have dedicated pages:
- `/services/drain-cleaning`
- `/services/sewer-line-repair`
- `/services/emergency-plumbing`
- `/services/water-heater`
- `/services/leak-detection`

**Each page should have:**
- 800+ words of unique content
- Local keywords (e.g., "drain cleaning in Erie PA")
- Clear call-to-action
- Images with alt text
- FAQ section

#### 5. **Create Location-Specific Pages**
For each city you serve:
- `/service-areas/erie-pa/sewer-camera-inspection`
- `/service-areas/meadville-pa` (Crawford County seat)
- `/service-areas/harborcreek-pa`
- `/service-areas/fairview-pa`

**Each should have:**
- Unique content about serving that area
- Local landmarks/references
- City-specific phone number (if available)
- Embedded Google Map

#### 6. **Blog for SEO Content**
Create helpful content that ranks for search queries:
- "How to Tell If Your Sewer Line Is Broken"
- "When Do You Need a Sewer Camera Inspection?"
- "Cost of Sewer Line Repair in Erie PA"
- "Emergency Plumbing Checklist for Homeowners"
- "Signs You Need Drain Cleaning"

**Benefits:**
- Ranks for informational keywords
- Builds authority
- Gets backlinks
- Converts readers to customers

#### 7. **Page Speed Optimization**
- Compress images (especially homepage hero images)
- Use Next.js Image component instead of `<img>`
- Enable lazy loading
- Minimize CSS/JS

**Test with:**
- Google PageSpeed Insights
- GTmetrix

#### 8. **Mobile Optimization**
- Ensure buttons are easy to tap
- Test on real mobile devices
- Make phone number click-to-call (already done ✓)

---

### **Medium Priority**

#### 9. **Add FAQ Schema**
Create FAQ pages with Schema.org FAQ markup:
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does sewer camera inspection cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Prices vary based on..."
      }
    }
  ]
}
```

#### 10. **Video Content**
- Record sewer camera inspection videos
- Upload to YouTube with local keywords
- Embed on your website
- **Impact**: Video results appear in Google Search

#### 11. **Backlink Building**
- Get mentioned in local news
- Partner with real estate agents (offer inspection discounts)
- Sponsor local events
- Write guest posts for local blogs

#### 12. **Internal Linking**
- Link from homepage to service pages
- Link from service pages to related services
- Link to local area pages from service pages
- Use descriptive anchor text (not "click here")

---

### **Technical SEO Checklist**

#### Done ✓
- [x] XML Sitemap
- [x] Robots.txt
- [x] Structured Data (LocalBusiness)
- [x] Open Graph tags
- [x] Meta descriptions on key pages
- [x] Mobile-responsive design
- [x] HTTPS (already using)
- [x] Click-to-call phone numbers

#### To Do
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Set up Google Business Profile
- [ ] Add breadcrumb navigation
- [ ] Add service-specific structured data
- [ ] Optimize images (alt text, compression, WebP format)
- [ ] Add canonical tags (if needed)
- [ ] Create 404 error page with helpful links
- [ ] Add customer review schema to reviews page

---

## 📊 How to Measure Success

### Google Search Console
1. Add your site: https://search.google.com/search-console
2. Submit sitemap: `https://marfinetzplumbing.org/sitemap.xml`
3. Monitor:
   - Search impressions
   - Click-through rate
   - Average position
   - Mobile usability issues

### Track These Metrics
- **Organic traffic** (Google Analytics)
- **Keyword rankings** (Google Search Console or Ahrefs/SEMrush)
- **Phone calls from organic search** (Google Analytics phone click events)
- **Google Business Profile views**
- **Local pack rankings** (check manually in incognito)

### Target Keywords to Rank For
1. "plumber Erie PA" (high competition)
2. "sewer camera inspection Erie PA" (low competition, high intent)
3. "emergency plumber Erie County" (high intent)
4. "drain cleaning Crawford County PA" (medium competition)
5. "sewer line repair near me" (local intent)

---

## 🎯 Quick Wins (Do This Week)

1. **Submit sitemap to Google Search Console** (5 mins)
2. **Claim Google Business Profile** (30 mins)
3. **Add your business to Yelp** (15 mins)
4. **Ask your last 5 customers for Google reviews** (20 mins)
5. **Add alt text to all images** (1 hour)

---

## Long-Term Strategy (Next 3-6 Months)

### Month 1-2
- Create missing service pages
- Optimize existing pages for keywords
- Build 10 local citations
- Get 10 Google reviews

### Month 3-4
- Launch blog with 4-8 articles
- Create location-specific pages
- Get featured in local news
- Build 10 more citations

### Month 5-6
- Create video content
- Build backlinks
- Advanced structured data
- Expand to more service areas

---

## Competitive Advantage

Your **sewer camera inspection** service is a differentiator. Most local plumbers don't emphasize this. Focus SEO efforts on:
- "sewer camera inspection [city name]"
- "video pipe inspection [city name]"
- "find sewer line problems [city name]"

These have **lower competition** and **higher conversion rates** than generic "plumber" keywords.

---

## Need Help?

The most impactful next steps are:
1. Google Business Profile setup
2. Create missing service pages
3. Get reviews
4. Submit sitemap

These will have the biggest impact on local search rankings.
