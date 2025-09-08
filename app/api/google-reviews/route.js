// Google Reviews API endpoint
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // This is a server-side implementation to fetch Google reviews
    // For Marfinetz Plumbing with place_id: ChIJ5SN41h5KzYkRo5dnBsiFcxM
    
    // Fetch from Google Places API
    const placeId = 'ChIJ5SN41h5KzYkRo5dnBsiFcxM'; // Marfinetz Plumbing place ID
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    // URL to fetch reviews through Google Places API (New)
    const url = `https://places.googleapis.com/v1/places/${placeId}?fields=displayName,rating,reviews,googleMapsUri`;
    
    let response;
    
    // If no API key is set, return an error instead of mock data
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'GOOGLE_PLACES_API_KEY not set',
        message: 'Server is configured to use live Google reviews only.'
      }, { status: 500 });
    } else {
      // Fetch real data from Google Places API (New) with proper headers
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'displayName,rating,reviews,googleMapsUri'
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Google Places API Error:', res.status, errorText);
        throw new Error(`Google Places API responded with status: ${res.status} - ${errorText}`);
      }
      response = await res.json();
      
      // Check if the response has an error (new API format)
      if (response.error) {
        console.error('Google Places API Error:', response.error);
        throw new Error(`Google Places API: ${response.error.message || 'Unknown error'}`);
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
