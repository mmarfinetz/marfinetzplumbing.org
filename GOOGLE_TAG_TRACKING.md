# Google Tag Phone Click Tracking Setup

## Overview
Google Tag tracking has been configured to track when visitors click on phone numbers to call your business.

## What Was Implemented

### 1. Google Tag Manager Script
- **Location**: `/app/layout.tsx`
- **Tag ID**: `AW-17046907044`
- The gtag.js script is loaded on every page of your website

### 2. Phone Click Tracking Component
- **Location**: `/components/PhoneClickTracking.tsx`
- Automatically tracks all clicks on phone number links (any `<a href="tel:...">` links)
- Sends custom events to Google Analytics when phone numbers are clicked

## Tracked Phone Numbers

The following phone numbers are tracked across your site:
- **(814) 273-6315** - Main business number (27+ locations)
- **814-225-8389** - Calculator page

## Event Details

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
1. Open your website in a browser
2. Open Developer Tools (F12)
3. Go to the Console tab
4. Click on any phone number
5. You should see: `Phone click tracked: 8142736315`

### Method 2: Google Tag Assistant
1. Install the [Tag Assistant Legacy Chrome Extension](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Visit your website
3. Click the Tag Assistant icon
4. Click "Enable" and refresh the page
5. Click on a phone number
6. The Tag Assistant will show the event being fired

### Method 3: Google Analytics Real-Time Reports
1. Log into your Google Analytics account
2. Go to Reports → Real-time → Events
3. Open your website in another tab
4. Click a phone number
5. Within seconds, you should see the `phone_call_click` event appear in real-time

### Method 4: Browser Network Tab
1. Open Developer Tools (F12)
2. Go to the Network tab
3. Filter by "collect" or "google-analytics"
4. Click a phone number
5. You'll see a network request to Google Analytics with your event data

## Google Analytics Configuration

To see phone click events in your Google Analytics dashboard:

1. **Standard Event Report**:
   - Go to Reports → Engagement → Events
   - Look for the event named `phone_call_click`

2. **Create a Custom Report**:
   - Go to Explore → Create a new exploration
   - Add "Event name" dimension
   - Filter by `phone_call_click`
   - Add metrics like "Event count" and "Users"

3. **Set Up Conversion Tracking** (Recommended):
   - Go to Admin → Events → Create event
   - Mark `phone_call_click` as a conversion
   - This helps you track phone calls as business goals

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

## Next Steps

1. Test the tracking on your live site
2. Set up conversion tracking in Google Analytics
3. Create custom reports to analyze phone call engagement
4. Consider setting up Google Ads conversion tracking for phone calls
