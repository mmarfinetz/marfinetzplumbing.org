import React from 'react';
import { headers } from 'next/headers';

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

async function fetchReviews(): Promise<GoogleResult | null> {
  try {
    const h = headers();
    const host = h.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const base = `${protocol}://${host}`;
    const res = await fetch(`${base}/api/google-reviews`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.result ?? null;
  } catch (e) {
    return null;
  }
}

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

export default async function GoogleReviews({ count = 3 }: { count?: number }) {
  const result = await fetchReviews();
  const reviews = result?.reviews ?? [];

  if (!result || reviews.length === 0) {
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
            <p className="testimonial-text">“{rev.text}”</p>
            <div className="testimonial-author">
              <p className="author-name">{rev.author_name || 'Google User'}</p>
              <p className="author-location">{rev.relative_time_description || timeAgo(rev.time)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="testimonials-cta" style={{ textAlign: 'center', marginTop: 16 }}>
        <a href={result.url || 'https://www.google.com/'} className="btn btn-secondary" target="_blank" rel="noopener">
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
      <p style={{ textAlign: 'center', fontSize: 12, marginTop: 8, color: '#555' }}>Powered by Google</p>
    </>
  );
}

