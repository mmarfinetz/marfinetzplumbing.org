// Google Reviews API endpoint
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // This is a server-side implementation to fetch Google reviews
    // For Marfinetz Plumbing with place_id: ChIJ5SN41h5KzYkRo5dnBsiFcxM
    
    // Fetch from Google Places API
    const placeId = 'ChIJ5SN41h5KzYkRo5dnBsiFcxM'; // Marfinetz Plumbing place ID
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    // URL to fetch reviews through Google Places API (legacy) with server referrer
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,url&key=${apiKey}`;
    
    let response;
    
    // If no API key is set, return an error instead of mock data
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'GOOGLE_PLACES_API_KEY not set',
        message: 'Server is configured to use live Google reviews only.'
      }, { status: 500 });
    } else {
      // Fetch real data from Google Places API with proper headers
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Referer': 'https://marfinetzplumbing.org',
          'User-Agent': 'Marfinetz-Plumbing-Website/1.0'
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Google Places API Error:', res.status, errorText);
        throw new Error(`Google Places API responded with status: ${res.status} - ${errorText}`);
      }
      response = await res.json();
      
      // Check if the response has an error
      if (response.status === 'REQUEST_DENIED') {
        console.error('Google Places API Request Denied:', response.error_message);
        throw new Error(`Google Places API: ${response.error_message}`);
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
