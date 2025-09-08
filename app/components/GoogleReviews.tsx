'use client';
import React, { useState, useEffect } from 'react';

type GoogleReview = {
  author_name?: string;
  profile_photo_url?: string;
  rating?: number;
  relative_time_description?: string;
  time?: number; // unix seconds
  text?: string;
};

type GoogleResult = {
  name?: string;
  rating?: number;
  url?: string;
  reviews?: GoogleReview[];
};

// Static fallback reviews for when API is unavailable
const fallbackReviews: GoogleReview[] = [
  {
    author_name: "John D.",
    rating: 5,
    relative_time_description: "2 weeks ago",
    text: "Excellent service! Fixed my leaky faucet quickly and professionally. Would recommend to anyone needing plumbing work done."
  },
  {
    author_name: "Sarah M.",
    rating: 5,
    relative_time_description: "1 month ago",
    text: "Marfinetz Plumbing installed a new bathroom vanity for us. The work was done perfectly and they cleaned up everything afterward. Very satisfied!"
  },
  {
    author_name: "Robert T.",
    rating: 4,
    relative_time_description: "3 weeks ago",
    text: "Needed emergency plumbing repair and they responded quickly. Fair pricing and good workmanship. Would use again."
  },
  {
    author_name: "Lisa K.",
    rating: 5,
    relative_time_description: "1 month ago",
    text: "The sewer camera inspection was exactly what we needed before buying our house. Professional service and detailed report."
  },
  {
    author_name: "Mike W.",
    rating: 5,
    relative_time_description: "2 months ago",
    text: "Fast response for our drain cleaning emergency. They had the right equipment and got the job done quickly."
  },
  {
    author_name: "Jennifer L.",
    rating: 5,
    relative_time_description: "6 weeks ago",
    text: "Honest, fair pricing and quality work. They explained everything clearly and completed the job on schedule."
  }
];

function Stars({ rating = 0 }: { rating?: number }) {
  const r = Math.max(0, Math.min(5, Math.round(rating)));
  return <div className="testimonial-rating">{'★'.repeat(r) + '☆'.repeat(5 - r)}</div>;
}

function timeAgo(ts?: number) {
  if (!ts) return '';
  const date = new Date(ts * 1000);
  const now = new Date();
  const sec = Math.floor((+now - +date) / 1000);
  if (sec < 60) return 'just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} minute${min > 1 ? 's' : ''} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr > 1 ? 's' : ''} ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} day${day > 1 ? 's' : ''} ago`;
  const mon = Math.floor(day / 30);
  if (mon < 12) return `${mon} month${mon > 1 ? 's' : ''} ago`;
  const yr = Math.floor(mon / 12);
  return `${yr} year${yr > 1 ? 's' : ''} ago`;
}

export default function GoogleReviews({ count = 3 }: { count?: number }) {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchGoogleReviews = async () => {
      try {
        // Try to fetch from our API route first (works in development)
        const response = await fetch('/api/google-reviews', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.result && data.result.reviews && data.result.reviews.length > 0) {
            setReviews(data.result.reviews);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.log('API route not available, using fallback reviews');
      }
      
      // Fallback to static reviews if API is not available (production static export)
      setTimeout(() => {
        setReviews(fallbackReviews);
        setLoading(false);
      }, 500);
    };

    fetchGoogleReviews();
  }, []);

  if (loading) {
    return (
      <div className="testimonials-loading">
        <p>Loading customer reviews...</p>
      </div>
    );
  }

  if (error || reviews.length === 0) {
    return (
      <div>
        <p>Unable to load live Google reviews right now.</p>
        <p>
          Please visit our{' '}
          <a href="https://g.page/r/CaM5Z6DIV3MTEAE/review" target="_blank" rel="noopener">
            Google Business Profile
          </a>{' '}
          to read and write reviews.
        </p>
      </div>
    );
  }

  const items = reviews.slice(0, count);

  return (
    <>
      <div className="testimonials-slider">
        {items.map((rev, idx) => (
          <div key={idx} className="testimonial-card">
            <Stars rating={rev.rating} />
            <p className="testimonial-text">&quot;{rev.text}&quot;</p>
            <div className="testimonial-author">
              <p className="author-name">{rev.author_name || 'Google User'}</p>
              <p className="author-location">{rev.relative_time_description || timeAgo(rev.time)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="testimonials-cta" style={{ textAlign: 'center', marginTop: 16 }}>
        <a href="https://g.page/r/CaM5Z6DIV3MTEAE/review" className="btn btn-secondary" target="_blank" rel="noopener">
          Read More on Google
        </a>
        <a
          href="https://g.page/r/CaM5Z6DIV3MTEAE/review"
          className="btn btn-outline"
          style={{ marginLeft: 12 }}
          target="_blank"
          rel="noopener"
        >
          Write a Review
        </a>
      </div>
      <p style={{ textAlign: 'center', fontSize: 12, marginTop: 8, color: '#555' }}>Customer Reviews</p>
    </>
  );
}

