# Google Tag Tracking Setup

## Overview
Google Tag tracking has been configured to track important user actions on your website:
- **Phone number clicks** - When visitors click to call your business
- **Contact form submissions** - When visitors submit the contact form

## What Was Implemented

### 1. Google Tag Manager Script
- **Location**: `/app/layout.tsx`
- **Tag ID**: `AW-17046907044`
- The gtag.js script is loaded on every page of your website

### 2. Phone Click Tracking Component
- **Location**: `/components/PhoneClickTracking.tsx`
- Automatically tracks all clicks on phone number links (any `<a href="tel:...">` links)
- Sends custom events to Google Analytics when phone numbers are clicked

### 3. Contact Form Tracking
- **Location**: `/public/js/lead-capture.js`
- Tracks successful contact form submissions
- Sends conversion events to Google Ads
- Includes lead data such as urgency level, property type, and contact preferences

## Tracked Phone Numbers

The following phone numbers are tracked across your site:
- **(814) 273-6315** - Main business number (27+ locations)
- **814-225-8389** - Calculator page

## Event Details

### Phone Click Events

When someone clicks a phone number, the following event is sent to Google Analytics:

```javascript
{
  event: 'phone_call_click',
  event_category: 'engagement',
  event_label: '8142736315', // The actual phone number clicked
  phone_number: '8142736315',
  value: 1
}
```

### Contact Form Submission Events

When someone successfully submits the contact form, TWO events are sent to Google Analytics:

**1. Form Submission Event** (for tracking):
```javascript
{
  event: 'form_submission',
  event_category: 'lead_generation',
  event_label: 'contact_form',
  urgency: 'emergency', // or 'same_day', 'this_week', 'flexible'
  property_type: 'residential', // or 'commercial', 'industrial'
  preferred_contact: 'phone', // or 'email', 'text'
  value: 1
}
```

**2. Conversion Event** (for Google Ads):
```javascript
{
  event: 'conversion',
  send_to: 'AW-17046907044/conversion_label',
  value: 1.0,
  currency: 'USD',
  transaction_id: 'unique_tracking_id'
}
```

**Note**: You'll need to update the `conversion_label` in `/public/js/lead-capture.js` with your actual conversion label from Google Ads. To get this:
1. Go to Google Ads → Goals → Conversions
2. Create a new conversion action (if you haven't already)
3. Copy the conversion label
4. Update line 289 in `/public/js/lead-capture.js`

## Where Phone Numbers Are Tracked

Phone click tracking works on:
- Header emergency button
- Footer contact info
- Contact page (multiple locations)
- All service pages
- Service area pages (Erie PA, Crawford PA, Conneaut OH)
- About page
- Reviews page
- Calculator page

## How to Verify Tracking Is Working

### Method 1: Browser Console

**For Phone Clicks:**
1. Open your website in a browser
2. Open Developer Tools (F12)
3. Go to the Console tab
4. Click on any phone number
5. You should see: `Phone click tracked: 8142736315`

**For Contact Form Submissions:**
1. Open your website in a browser
2. Open Developer Tools (F12)
3. Go to the Console tab
4. Navigate to the contact form page
5. Fill out and submit the form
6. You should see: `Form submission tracked in Google Analytics` along with the urgency and property type

### Method 2: Google Tag Assistant
1. Install the [Tag Assistant Legacy Chrome Extension](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Visit your website
3. Click the Tag Assistant icon
4. Click "Enable" and refresh the page
5. Click on a phone number
6. The Tag Assistant will show the event being fired

### Method 3: Google Analytics Real-Time Reports

**For Phone Clicks:**
1. Log into your Google Analytics account
2. Go to Reports → Real-time → Events
3. Open your website in another tab
4. Click a phone number
5. Within seconds, you should see the `phone_call_click` event appear in real-time

**For Contact Form Submissions:**
1. Log into your Google Analytics account
2. Go to Reports → Real-time → Events
3. Open your website in another tab
4. Submit a contact form
5. Within seconds, you should see both `form_submission` and `conversion` events appear in real-time

### Method 4: Browser Network Tab
1. Open Developer Tools (F12)
2. Go to the Network tab
3. Filter by "collect" or "google-analytics"
4. Click a phone number
5. You'll see a network request to Google Analytics with your event data

## Google Analytics Configuration

### Viewing Events in Google Analytics

1. **Standard Event Report**:
   - Go to Reports → Engagement → Events
   - Look for the events:
     - `phone_call_click` - Phone number clicks
     - `form_submission` - Contact form submissions
     - `conversion` - Conversion events for Google Ads

2. **Create a Custom Report**:
   - Go to Explore → Create a new exploration
   - Add "Event name" dimension
   - Filter by `phone_call_click` or `form_submission`
   - Add metrics like "Event count" and "Users"
   - Add custom dimensions for urgency, property_type, etc.

3. **Set Up Conversion Tracking** (Recommended):
   - Go to Admin → Events
   - Mark both `phone_call_click` and `form_submission` as conversions
   - This helps you track these as business goals in your reports

### Google Ads Conversion Setup

For the conversion tracking to work properly in Google Ads:

1. **Create a Conversion Action**:
   - Go to Google Ads → Goals → Conversions
   - Click the "+" button to create a new conversion
   - Select "Website" as the conversion source
   - Choose "Submit lead form" as the conversion goal
   - Name it "Contact Form Submission"
   - Set the value (recommended: assign a value based on your average lead value)
   - Click "Create and continue"

2. **Get the Conversion Label**:
   - After creating the conversion, Google Ads will show you a tag snippet
   - Look for the line that says `send_to: 'AW-17046907044/XXXXXXXXXX'`
   - Copy the part after the `/` (the conversion label)
   - Update line 289 in `/public/js/lead-capture.js` with this conversion label

3. **Verify in Google Ads**:
   - After setting up, submit a test form
   - Go to Google Ads → Goals → Conversions
   - Check the "Status" column - it should show recent conversions within a few hours

## Integration with Existing Lead Tracking

This Google Tag tracking works alongside your existing lead tracking system:
- **Existing System**: Tracks clicks in your internal dashboard (25 points per phone click)
- **Google Analytics**: Tracks clicks in Google Analytics for marketing analysis
- Both systems work independently and complement each other

## Troubleshooting

If tracking isn't working:

1. **Check if gtag is loaded**:
   - Open console and type: `typeof gtag`
   - Should return: `"function"`

2. **Check dataLayer**:
   - Open console and type: `window.dataLayer`
   - Should return an array with tracking data

3. **Verify Tag ID**:
   - Make sure `AW-17046907044` is the correct ID for your account

4. **Check for ad blockers**:
   - Some ad blockers prevent Google Analytics from loading
   - Test in an incognito window or with ad blockers disabled

## Files Modified

- `/app/layout.tsx` - Added Google Tag script and PhoneClickTracking component
- `/components/PhoneClickTracking.tsx` - New file for tracking phone clicks
- `/public/js/lead-capture.js` - Added Google Tag event tracking for contact form submissions

## Next Steps

1. **Test the tracking on your live site**:
   - Click phone numbers to verify phone click tracking
   - Submit a test contact form to verify form submission tracking
   - Check the browser console for tracking confirmation messages

2. **Set up Google Ads conversion action**:
   - Follow the "Google Ads Conversion Setup" instructions above
   - Get your conversion label and update `/public/js/lead-capture.js` line 289
   - This is CRITICAL for tracking conversions in Google Ads

3. **Mark events as conversions in Google Analytics**:
   - Go to Admin → Events
   - Mark `phone_call_click` as a conversion
   - Mark `form_submission` as a conversion

4. **Create custom reports**:
   - Analyze phone call engagement by page, time of day, etc.
   - Track contact form conversion rates
   - Monitor lead quality by urgency level and property type

5. **Monitor and optimize**:
   - Check real-time reports regularly
   - Set up alerts for conversion tracking issues
   - Review conversion data to optimize your marketing campaigns
