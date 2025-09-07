import React from 'react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plumbing & Sewer Services in Crawford County, PA | Marfinetz Plumbing',
  description: 'Trusted plumbing and sewer services in Crawford County, PA. Camera inspections, drain cleaning, repairs, and emergencies. Call (814) 273-6315.',
}

export default function CrawfordPA() {
  return (
    <main>
      <section className="location-hero">
        <div className="container">
          <div className="location-hero-content">
            <h1>Reliable Plumbing Services in Crawford County, PA</h1>
            <p className="location-hero-subtitle">Quality Workmanship Across Crawford County</p>
            <p className="location-hero-description">From inspections to repairs, our team serves Crawford County with fast response and professional results.</p>
            <div className="location-hero-cta">
              <a href="tel:8142736315" className="btn btn-primary">Call (814) 273-6315</a>
              <a href="/contact" className="btn btn-secondary">Request Service</a>
            </div>
          </div>
          <div className="location-hero-image">
            <ImageWithFallback src="/img/crawford.png" alt="Crawford County, Pennsylvania" />
          </div>
        </div>
      </section>

      <section className="location-services">
        <div className="container">
          <div className="section-header">
            <h2>Our Services in Crawford County</h2>
            <p>Plumbing solutions for residential and commercial customers</p>
          </div>
          <div className="services-grid">
            <div className="service-card featured">
              <div className="service-icon">
                <img src="/img/inspection.png" alt="Sewer Camera Icon" />
              </div>
              <h3>Sewer Camera Inspection</h3>
              <p>Diagnose sewer issues quickly and accurately without unnecessary digging.</p>
              <a href="/services/sewer-camera-inspection" className="btn btn-outline">Learn More</a>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <img src="/img/pipe2.png" alt="Drain Cleaning Icon" />
              </div>
              <h3>Drain Cleaning & Snaking</h3>
              <p>Clear tough clogs and restore proper flow to your drains.</p>
              <a href="/services/drain-cleaning" className="btn btn-outline">Learn More</a>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <img src="/img/pipe3.png" alt="Sewer Line Repair Icon" />
              </div>
              <h3>Sewer Line Repair</h3>
              <p>Targeted repairs and replacements to fix broken or collapsed lines.</p>
              <a href="/services/sewer-line-repair" className="btn btn-outline">Learn More</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
