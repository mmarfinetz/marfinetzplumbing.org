import React from 'react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plumbing & Sewer Services in Erie County, PA | Marfinetz Plumbing',
  description: 'Professional plumbing and sewer camera inspection services in Erie County, PA. Fast response and reliable service. Call (814) 273-6315.',
}

export default function EriePA() {
  return (
    <main>
      <section className="location-hero">
        <div className="container">
          <div className="location-hero-content">
            <h1>Professional Plumbing Services in Erie County, PA</h1>
            <p className="location-hero-subtitle">Trusted Local Plumbing & Sewer Solutions</p>
            <p className="location-hero-description">We provide comprehensive plumbing services across Erie County, including sewer camera inspections, drain cleaning, repairs, and emergency service.</p>
            <div className="location-hero-cta">
              <a href="tel:8142736315" className="btn btn-primary">Call (814) 273-6315</a>
              <a href="/contact" className="btn btn-secondary">Request Service</a>
            </div>
          </div>
          <div className="location-hero-image">
            <ImageWithFallback src="/img/erie.png" alt="Erie County, Pennsylvania" />
          </div>
        </div>
      </section>

      <section className="location-services">
        <div className="container">
          <div className="section-header">
            <h2>Our Services in Erie County</h2>
            <p>Comprehensive plumbing solutions for homes and businesses</p>
          </div>
          <div className="services-grid">
            <div className="service-card featured">
              <div className="service-icon">
                <img src="/img/inspection.png" alt="Sewer Camera Icon" />
              </div>
              <h3>Sewer Camera Inspection</h3>
              <p>Find blockages and damage precisely with our high-definition camera inspections.</p>
              <a href="/services/sewer-camera-inspection" className="btn btn-outline">Learn More</a>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <img src="/img/pipe2.png" alt="Drain Cleaning Icon" />
              </div>
              <h3>Drain Cleaning & Snaking</h3>
              <p>Effective clearing for stubborn clogs in sinks, tubs, and sewer lines.</p>
              <a href="/services/drain-cleaning" className="btn btn-outline">Learn More</a>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <img src="/img/pipe3.png" alt="Sewer Line Repair Icon" />
              </div>
              <h3>Sewer Line Repair</h3>
              <p>Expert repairs and replacements, including trenchless options to minimize disruption.</p>
              <a href="/services/sewer-line-repair" className="btn btn-outline">Learn More</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
