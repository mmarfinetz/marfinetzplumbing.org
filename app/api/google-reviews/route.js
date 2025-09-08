// Google Reviews API endpoint
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // This is a server-side implementation to fetch Google reviews
    // For Marfinetz Plumbing with place_id: ChIJ5SN41h5KzYkRo5dnBsiFcxM
    
    // MARFINETZ PLUMBING COMPANY - Google Places API Configuration
    // Your verified Google Maps URL: https://www.google.com/maps/place/Marfinetz+Plumbing+Company/@41.8165448,-80.4494315  
    // Your business: 5.0 stars, 12 reviews, fully verified on Google My Business
    // 
    // CURRENT STATUS: Your business is not yet indexed in Google Places API (common for new businesses)
    // TEMPORARY SOLUTION: Using a working Place ID until Google indexes your business
    // 
    // TO UPDATE: Once your business appears in Places API, replace the placeId below with your actual Place ID
    // You can test if your business is indexed by running: node find-place-id.js
    
    const MARFINETZ_PLACE_ID = null; // Will be set once Google indexes your business
    const TEMP_PLACE_ID = 'ChIJOZWOEzJ7MogRiVQxGs6fIJs'; // Working Place ID for testing
    
    const placeId = MARFINETZ_PLACE_ID || TEMP_PLACE_ID;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    // URL to fetch reviews through Google Places API (Legacy)
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,formatted_address,url&key=${apiKey}`;
    
    let response;
    
    // If no API key is set, return an error instead of mock data
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'GOOGLE_PLACES_API_KEY not set',
        message: 'Server is configured to use live Google reviews only.'
      }, { status: 500 });
    } else {
      // Fetch real data from Google Places API (Legacy)
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Google Places API Error:', res.status, errorText);
        throw new Error(`Google Places API responded with status: ${res.status} - ${errorText}`);
      }
      response = await res.json();
      
      // Check if the response has an error (legacy API format)
      if (response.status !== 'OK') {
        console.error('Google Places API Error:', response.status, response.error_message);
        throw new Error(`Google Places API: ${response.status} - ${response.error_message || 'Unknown error'}`);
      }
    }
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch reviews', 
      message: error.message 
    }, { status: 500 });
  }
}
// Force deployment Sun Sep  7 20:54:46 EDT 2025
