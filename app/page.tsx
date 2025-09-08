import React from 'react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
// Removed live Google Reviews widget – not our business

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Professional Sewer Camera Inspection & Plumbing Services</h1>
            <p className="hero-subtitle">Erie County, Crawford County, and Conneaut OH</p>
            <p className="hero-description">Find and fix plumbing problems fast with our state-of-the-art sewer camera inspection services. No guesswork, no unnecessary digging.</p>
            <div className="hero-cta">
              <a href="/services/sewer-camera-inspection" className="btn btn-primary">Learn About Sewer Inspection</a>
              <a href="/contact" className="btn btn-secondary">Request Service</a>
            </div>
          </div>
          <div className="hero-image">
            <img src="/img/with-padding-1.png" alt="Sewer camera inspection" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <div className="container">
          <div className="section-header">
            <h2>Our Plumbing Services</h2>
            <p>Professional solutions for all your plumbing needs</p>
          </div>
          <div className="services-grid">
            {/* Sewer Camera Inspection Card */}
            <div className="service-card featured">
              <div className="service-thumb">
                <img src="/img/Sewer-Camera-Inspection.png" alt="Sewer Camera Inspection" />
              </div>
              <h3>Sewer Camera Inspection</h3>
              <p>Identify blockages, cracks, and other issues without destructive digging. Our high-definition cameras provide accurate diagnosis of your sewer line problems.</p>
              <ul className="service-features">
                <li>Locate blockages and breaks</li>
                <li>Identify tree root intrusions</li>
                <li>Verify proper pipe installation</li>
                <li>Document pipe condition</li>
              </ul>
              <a href="/services/sewer-camera-inspection" className="btn btn-outline">Learn More</a>
            </div>
            
            {/* Drain Cleaning Card */}
            <div className="service-card">
              <div className="service-thumb">
                <img src="/img/Drain-Snake.jpg" alt="Drain Cleaning & Snaking" />
              </div>
              <h3>Drain Cleaning & Snaking</h3>
              <p>Professional solutions for clogged drains and sewer lines. We use specialized equipment to clear blockages quickly and effectively.</p>
              <a href="/services/drain-cleaning" className="btn btn-outline">Learn More</a>
            </div>
            
            {/* Sewer Line Repair Card */}
            <div className="service-card">
              <div className="service-thumb">
                <img src="/img/Sewer-Line-Problems_iStock-1326402307.jpg" alt="Sewer Line Repair" />
              </div>
              <h3>Sewer Line Repair</h3>
              <p>Expert repair and replacement services for damaged sewer lines, including trenchless options to minimize disruption.</p>
              <a href="/services/sewer-line-repair" className="btn btn-outline">Learn More</a>
            </div>
            
            {/* Emergency Services Card */}
            <div className="service-card">
              <div className="service-icon">
                <img className="no-stretch" src="/img/msg_warning-0.png" alt="Emergency Plumbing Icon" />
              </div>
              <h3>Emergency Plumbing</h3>
              <p>24/7 emergency service for burst pipes, major leaks, sewer backups, and other plumbing emergencies.</p>
              <a href="/services/emergency-plumbing" className="btn btn-outline">Learn More</a>
            </div>
            
            {/* View All Services Button */}
            <div className="view-all">
              <a href="/services" className="btn btn-primary">View All Services</a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Marfinetz Plumbing</h2>
            <p>Trusted plumbing professionals serving the tri-state area</p>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <img src="/img/icons/location.svg" alt="Service Area Icon" />
              </div>
              <h3>Tri-Market Service Area</h3>
              <p>Serving Erie County, Crawford County, and Conneaut OH with fast, reliable service across state lines.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <img src="/img/icons/experience.svg" alt="Experience Icon" />
              </div>
              <h3>Experienced Technicians</h3>
              <p>Our licensed professionals have the expertise to handle any plumbing challenge.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <img src="/img/icons/pricing.svg" alt="Pricing Icon" />
              </div>
              <h3>Transparent Pricing</h3>
              <p>Upfront, honest pricing with no hidden fees or surprise charges.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <img src="/img/icons/guarantee.svg" alt="Guarantee Icon" />
              </div>
              <h3>Satisfaction Guaranteed</h3>
              <p>We stand behind our work with a 100% satisfaction guarantee on all services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas Section */}
      <section className="service-areas">
        <div className="container">
          <div className="section-header">
            <h2>Our Service Areas</h2>
            <p>Providing quality plumbing services across Pennsylvania and Ohio</p>
          </div>
          <div className="areas-grid">
            <div className="area-card">
              <div className="area-image">
                <ImageWithFallback src="/img/erie.png" alt="Erie County, PA" />
              </div>
              <h3>Erie County, PA</h3>
              <p>Comprehensive plumbing services throughout Erie County, including sewer camera inspections.</p>
              <a href="/service-areas/erie-pa" className="btn btn-outline">Erie County Services</a>
            </div>
            <div className="area-card">
              <div className="area-image">
                <ImageWithFallback src="/img/crawford.png" alt="Crawford County, PA" />
              </div>
              <h3>Crawford County, PA</h3>
              <p>Reliable plumbing solutions for Crawford County homes and businesses.</p>
              <a href="/service-areas/crawford-pa" className="btn btn-outline">Crawford County Services</a>
            </div>
            <div className="area-card">
              <div className="area-image">
                <ImageWithFallback src="/img/conneaut.png" alt="Conneaut, OH" />
              </div>
              <h3>Conneaut, OH</h3>
              <p>Cross-border service for our Ohio neighbors with the same quality and reliability.</p>
              <a href="/service-areas/conneaut-oh" className="btn btn-outline">Conneaut Services</a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials section intentionally removed: Google reviews not shown */}

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Need Sewer Line Inspection or Plumbing Services?</h2>
            <p>Contact Marfinetz Plumbing today for fast, reliable service across Erie County, Crawford County, and Conneaut OH.</p>
            <div className="cta-buttons">
              <a href="tel:8142736315" className="btn btn-primary">Call (814) 273-6315</a>
              <a href="/contact" className="btn btn-secondary">Request Service Online</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
