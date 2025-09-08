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

// No fallback reviews - we want real Google reviews only

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
        
        // If API returns an error, show error state
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Google Reviews API error:', errorData);
          setError(true);
          setLoading(false);
          return;
        }
        
        // If no reviews found
        setError(true);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch Google reviews:', error);
        setError(true);
        setLoading(false);
      }
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
      <div className="reviews-error" style={{ textAlign: 'center', padding: '20px' }}>
        <p style={{ marginBottom: '10px', color: '#666' }}>
          Google reviews are temporarily unavailable.
        </p>
        <p style={{ marginBottom: '15px' }}>
          Please visit our{' '}
          <a 
            href="https://g.page/r/CaM5Z6DIV3MTEAE/review" 
            target="_blank" 
            rel="noopener"
            style={{ color: '#007cba', textDecoration: 'underline' }}
          >
            Google Business Profile
          </a>{' '}
          to read our customer reviews.
        </p>
        <a 
          href="https://g.page/r/CaM5Z6DIV3MTEAE/review" 
          className="btn btn-outline" 
          target="_blank" 
          rel="noopener"
        >
          Write a Review
        </a>
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

