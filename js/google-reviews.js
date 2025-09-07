// Google Reviews loader with Google Places (client) + API fallback
let reviewsLoaded = false;

function loadGoogleReviews() {
  if (reviewsLoaded) return;

  const reviewsContainer = document.getElementById('google-reviews');
  if (!reviewsContainer) return;

  reviewsContainer.innerHTML = '<div class="loading-reviews">Loading reviews...</div>';

  // Prefer client-side Places library to avoid CORS and show live data on static hosting
  if (window.google && google.maps && google.maps.places) {
    fetchReviewsViaPlaces(reviewsContainer);
    return;
  }

  // If Places script is still loading, wait for it, then try again. Fallback to API after timeout.
  if (window.__googlePlacesLoading) {
    const onReady = () => {
      window.removeEventListener('google-maps-loaded', onReady);
      if (!reviewsLoaded) loadGoogleReviews();
    };
    window.addEventListener('google-maps-loaded', onReady, { once: true });

    // Safety fallback if Places never becomes available
    setTimeout(() => {
      if (!reviewsLoaded) fetchReviewsViaApi(reviewsContainer);
    }, 6000);
    return;
  }

  // No client library enqueued – try server API route (works in Next dev or server hosting)
  fetchReviewsViaApi(reviewsContainer);
}

function fetchReviewsViaPlaces(container) {
  try {
    const placeId = 'ChIJ5SN41h5KzYkRo5dnBsiFcxM'; // Marfinetz Plumbing
    const svc = new google.maps.places.PlacesService(document.createElement('div'));
    svc.getDetails(
      { placeId, fields: ['name', 'rating', 'reviews', 'url'] },
      function (place, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
          console.warn('Places getDetails failed:', status);
          // Fallback to server API
          return fetchReviewsViaApi(container);
        }
        if (!place.reviews || !place.reviews.length) {
          container.innerHTML = '<p>No reviews available at this time.</p>';
          return;
        }
        reviewsLoaded = true;
        renderReviews(container, {
          name: place.name,
          rating: place.rating,
          url: place.url,
          reviews: place.reviews,
        });
      }
    );
  } catch (e) {
    console.error('Error using Places library:', e);
    fetchReviewsViaApi(container);
  }
}

function fetchReviewsViaApi(container) {
  const API_URL = '/api/google-reviews';
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);

  fetch(API_URL, { signal: controller.signal, headers: { Accept: 'application/json' } })
    .then((res) => {
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error('Bad response: ' + res.status);
      return res.json();
    })
    .then((data) => {
      if (!data || !data.result || !data.result.reviews) throw new Error('Invalid data format');
      const { name, rating, url, reviews } = data.result;
      if (!reviews.length) {
        container.innerHTML = '<p>No reviews available at this time.</p>';
        return;
      }
      reviewsLoaded = true;
      renderReviews(container, { name, rating, url, reviews });
    })
    .catch((err) => {
      console.error('Error fetching Google reviews:', err);
      container.innerHTML = `
        <div class="review-error">
          <p>Unable to load reviews at this time.</p>
          <p>Please check out our <a href="https://g.page/r/CaM5Z6DIV3MTEAE/review" target="_blank" rel="noopener">Google Business Profile</a>.</p>
        </div>
      `;
    });
}

function renderReviews(container, data) {
  const reviews = data.reviews.slice(0, 5);
  let html = '';

  reviews.forEach((review) => {
    const rating = Math.max(0, Math.min(5, review.rating || 0));
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    const ts = review.time ? new Date(review.time * 1000) : new Date();
    const timeAgo = review.relative_time_description || formatTimeAgo(ts);
    const photo = review.profile_photo_url || 'img/wxp_186.png';

    html += `
      <div class="google-review">
        <div class="review-header">
          <img src="${photo}" alt="${review.author_name || 'Reviewer'}" class="review-avatar" loading="lazy" />
          <div class="review-user">
            <div class="review-name">${review.author_name || 'Google User'}</div>
            <div class="review-rating">${stars}</div>
            <div class="review-time">${timeAgo}</div>
          </div>
        </div>
        <div class="review-text">${review.text || ''}</div>
      </div>
    `;
  });

  html += `
    <div class="reviews-footer">
      <a href="${data.url}" target="_blank" rel="noopener">View all reviews on Google</a>
      <a href="https://g.page/r/CaM5Z6DIV3MTEAE/review" target="_blank" rel="noopener" style="margin-left:12px;">Write a review</a>
      <p class="reviews-rating">Overall rating: ${data.rating || '—'} ★</p>
      <div class="reviews-attribution">Powered by Google</div>
    </div>
  `;

  container.innerHTML = html;
}

// Helper function to format time ago
function formatTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}
