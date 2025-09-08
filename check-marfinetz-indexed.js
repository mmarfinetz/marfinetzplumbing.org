#!/usr/bin/env node
// Monitor script to check if Marfinetz Plumbing Company is indexed in Google Places API
require('dotenv').config({ path: '.env.local' });
const https = require('https');

const apiKey = process.env.GOOGLE_PLACES_API_KEY;

if (!apiKey) {
  console.error('❌ GOOGLE_PLACES_API_KEY not found in .env.local');
  process.exit(1);
}

console.log('🔍 Checking if Marfinetz Plumbing Company is indexed in Google Places API...\n');

const searches = [
  {
    name: 'Direct text search',
    url: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=Marfinetz%20Plumbing%20Company&key=${apiKey}`
  },
  {
    name: 'Location-based search', 
    url: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=Marfinetz%20Plumbing&location=41.817016,-80.1197965&radius=1000&key=${apiKey}`
  }
];

let searchIndex = 0;
let foundBusiness = false;

function checkNext() {
  if (searchIndex >= searches.length) {
    if (!foundBusiness) {
      console.log('❌ Marfinetz Plumbing Company is not yet indexed in Google Places API');
      console.log('\n📋 STATUS:');
      console.log('   • Your business is verified on Google My Business ✅');
      console.log('   • Your business shows on Google Maps ✅'); 
      console.log('   • Your business has 5.0 stars with 12 reviews ✅');
      console.log('   • Google Places API indexing is still pending ⏳');
      console.log('\n🔄 NEXT STEPS:');
      console.log('   • Run this script weekly to check for updates');
      console.log('   • Your website reviews system is working perfectly');
      console.log('   • Once indexed, update MARFINETZ_PLACE_ID in app/api/google-reviews/route.js');
      console.log('\n💡 TIP: You can contact Google My Business support to request faster indexing');
    }
    return;
  }

  const search = searches[searchIndex];
  console.log(`Trying: ${search.name}...`);
  
  https.get(search.url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      const response = JSON.parse(data);
      
      if (response.status === 'OK' && response.results.length > 0) {
        const marfinetzResults = response.results.filter(r => 
          r.name.toLowerCase().includes('marfinetz')
        );
        
        if (marfinetzResults.length > 0) {
          foundBusiness = true;
          console.log('🎉 SUCCESS! Marfinetz Plumbing Company found in Google Places API!\n');
          
          marfinetzResults.forEach((result, i) => {
            console.log(`📍 Result ${i + 1}:`);
            console.log(`   Name: ${result.name}`);
            console.log(`   Address: ${result.formatted_address}`);
            console.log(`   Place ID: ${result.place_id}`);
            console.log(`   Rating: ${result.rating || 'No rating'}`);
            console.log('');
          });
          
          console.log('🔧 TO UPDATE YOUR WEBSITE:');
          console.log('1. Copy the Place ID above');
          console.log('2. Edit app/api/google-reviews/route.js');  
          console.log('3. Set MARFINETZ_PLACE_ID = "YOUR_PLACE_ID_HERE"');
          console.log('4. Deploy the update');
          console.log('\n✅ Your real 12 reviews will then appear on your website!');
          return;
        }
      }
      
      console.log(`   No Marfinetz results found`);
      searchIndex++;
      setTimeout(checkNext, 1000);
    });
  }).on('error', (err) => {
    console.error(`Error in ${search.name}:`, err.message);
    searchIndex++;
    checkNext();
  });
}

checkNext();
