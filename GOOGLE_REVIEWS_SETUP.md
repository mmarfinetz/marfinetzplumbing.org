# Google Reviews Integration Setup

This document explains how to fully set up the Google Reviews integration for MMW Contracting website.

## Requirements

- Google Cloud account
- Google Places API key

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or use an existing one
3. Enable billing for your project

## Step 2: Enable the Google Places API

1. Go to the [API Library](https://console.cloud.google.com/apis/library) in Google Cloud Console
2. Search for "Places API"
3. Select and enable the Places API for your project

## Step 3: Create API Key

1. Go to [Credentials page](https://console.cloud.google.com/apis/credentials)
2. Click "Create credentials" and select "API key"
3. Once created, restrict the API key to only the Places API for security
4. Set HTTP referrer restrictions to your website's domain

## Step 4: Add API Key to Environment Variables (no hardcoding)

Do NOT commit your key to git. The build script injects it at build time so it never lives in source control.

1. In your deployment provider (e.g., Vercel), add an env var:
   - `GOOGLE_PLACES_API_KEY=your_api_key_here`
2. For local development, create `.env.local` (gitignored) with:
   ```
   GOOGLE_PLACES_API_KEY=your_api_key_here
   ```
3. The `build-for-vercel.sh` script replaces `REPLACE_WITH_YOUR_API_KEY` in `public/index.html` during the build using the env var.
   - If not set, the client-side Places loader is skipped and the reviews script will try the server API fallback.

## Step 5: Deploy Your Website

1. Make sure to add the environment variable to your hosting platform (Vercel, Netlify, etc.)
2. Deploy your website

## Troubleshooting

- If reviews don't load, check the browser console for errors
- Verify the API key is correctly set in the environment variables
- Make sure the Place ID in the API endpoint is correct (currently set to: `ChIJ5SN41h5KzYkRo5dnBsiFcxM`)
- Check Google Cloud Console to ensure you haven't exceeded API quotas
- If concerned about exposing keys: Frontend keys are inherently public, so enforce strict HTTP referrer + API restrictions in Google Cloud. Alternatively, deploy the server API route (`/api/google-reviews`) and use only that path.

## Server-Only Deployment (use API route exclusively)

To avoid exposing any client-side API key and rely solely on the Next.js server API route:

- In your deployment environment (e.g., Vercel), set:
  - `USE_STATIC_EXPORT=false`
- This disables static export in production and deploys a standard Next.js server with API routes enabled.
- Keep `GOOGLE_PLACES_API_KEY` set in server env. The homepage uses a server component that calls `/api/google-reviews` and renders live reviews.

Note: The older static `index.html` path is for the legacy Windows-95 themed page and is separate from the Next app. When using server-only deployment, your Next homepage (`/`) will serve the app router content instead.

## Review Link

The direct link for customers to leave a review is:
```
https://g.page/r/CaM5Z6DIV3MTEAE/review
```

This link is already integrated in the "Leave a Review" button in the testimonials window.
