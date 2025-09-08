import React from 'react';
import type { Metadata } from 'next';
// Live Google Reviews removed – not our business

export const metadata: Metadata = {
  title: 'Customer Reviews | Marfinetz Plumbing | Erie County, PA',
  description: 'Read customer reviews and testimonials for Marfinetz Plumbing. See why customers trust us for sewer camera inspection and plumbing services.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
};

export default function ReviewsPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="reviews-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Customer Reviews</h1>
            <p className="hero-subtitle">What our customers say about our plumbing services</p>
            <p className="hero-description">Read real reviews from customers across Erie County, Crawford County PA, and Conneaut OH.</p>
          </div>
        </div>
      </section>

      {/* Live Google Reviews removed intentionally */}

      {/* Featured Testimonials */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>Featured Customer Testimonials</h2>
            <p>Stories from satisfied customers</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p>&quot;Excellent service! Fixed my leaky faucet quickly and professionally. Would recommend to anyone needing plumbing work done.&quot;</p>
              <div className="customer">
                <strong>John D.</strong>
                <span>Erie County, PA</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p>&quot;Marfinetz Plumbing installed a new bathroom vanity for us. The work was done perfectly and they cleaned up everything afterward. Very satisfied!&quot;</p>
              <div className="customer">
                <strong>Sarah M.</strong>
                <span>Crawford County, PA</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="stars">★★★★☆</div>
              <p>&quot;Needed emergency plumbing repair and they responded quickly. Fair pricing and good workmanship. Would use again.&quot;</p>
              <div className="customer">
                <strong>Robert T.</strong>
                <span>Conneaut, OH</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p>&quot;The sewer camera inspection was exactly what we needed before buying our house. Professional service and detailed report.&quot;</p>
              <div className="customer">
                <strong>Lisa K.</strong>
                <span>Erie County, PA</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p>&quot;Fast response for our drain cleaning emergency. They had the right equipment and got the job done quickly.&quot;</p>
              <div className="customer">
                <strong>Mike W.</strong>
                <span>Crawford County, PA</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p>&quot;Honest, fair pricing and quality work. They explained everything clearly and completed the job on schedule.&quot;</p>
              <div className="customer">
                <strong>Jennifer L.</strong>
                <span>Conneaut, OH</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leave a Review */}
      <section className="leave-review">
        <div className="container">
          <div className="review-cta">
            <h2>Leave Us a Review</h2>
            <p>Share your experience with Marfinetz Plumbing and help other customers find quality plumbing services.</p>
            <div className="review-buttons">
              <a href="/contact" className="btn btn-primary">Share Feedback</a>
              <a href="/contact" className="btn btn-secondary">Contact Us</a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Experience Our Quality Service</h2>
            <p>Join our satisfied customers and experience professional plumbing service today.</p>
            <div className="cta-buttons">
              <a href="tel:8142736315" className="btn btn-primary">Call (814) 273-6315</a>
              <a href="/contact" className="btn btn-secondary">Request Service</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
