// Dynamically loads the Google Maps JavaScript API (Places library)
// Reads API key from <meta name="google-places-api-key" content="..."> or window.GOOGLE_PLACES_API_KEY
// Dispatches a `google-maps-loaded` event when ready
(function () {
  function loadScript(src, onload, onerror) {
    var s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.defer = true;
    s.onload = onload;
    s.onerror = onerror || function () {
      console.error('Failed to load Google Maps JavaScript API');
    };
    document.head.appendChild(s);
  }

  function init() {
    try {
      var meta = document.querySelector('meta[name="google-places-api-key"]');
      var key = (window && window.GOOGLE_PLACES_API_KEY) || (meta && meta.getAttribute('content')) || '';

      if (!key || key === 'REPLACE_WITH_YOUR_API_KEY') {
        console.warn('Google Places API key not set. Skipping client-side Places loading.');
        return;
      }

      if (window.__googlePlacesLoading) return;
      window.__googlePlacesLoading = true;

      var src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(key) + '&libraries=places&v=quarterly';
      loadScript(src, function () {
        window.__googlePlacesReady = true;
        window.dispatchEvent(new Event('google-maps-loaded'));
      });
    } catch (e) {
      console.error('Error initializing Google Places loader:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

