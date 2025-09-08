import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plumbing Services | Marfinetz Plumbing | Erie County, Crawford County, Conneaut OH',
  description: 'Professional plumbing services including sewer camera inspection, drain cleaning, water heater repair, and emergency services in Pennsylvania and Ohio.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
};

export default function ServicesPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="service-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Professional Plumbing Services</h1>
            <p className="hero-subtitle">Comprehensive solutions for all your plumbing needs</p>
            <p className="hero-description">Serving Erie County, Crawford County PA, and Conneaut OH with expert plumbing services.</p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services">
        <div className="container">
          <div className="services-grid">
            {/* Sewer Camera Inspection */}
            <div className="service-card featured">
              <div className="service-thumb">
                <img src="/img/Sewer-Camera-Inspection.png" alt="Sewer Camera Inspection" />
              </div>
              <h3>Sewer Camera Inspection</h3>
              <p>Advanced video inspection technology to diagnose sewer line problems without destructive digging.</p>
              <ul className="service-features">
                <li>High-definition video inspection</li>
                <li>Locate blockages and breaks</li>
                <li>Identify tree root intrusions</li>
                <li>Document pipe condition</li>
              </ul>
              <a href="/services/sewer-camera-inspection" className="btn btn-primary">Learn More</a>
            </div>

            {/* Drain Cleaning */}
            <div className="service-card">
              <div className="service-thumb">
                <img src="/img/Drain-Snake.jpg" alt="Drain Cleaning Services" />
              </div>
              <h3>Drain Cleaning & Snaking</h3>
              <p>Professional drain cleaning services to clear stubborn clogs and restore proper flow.</p>
              <ul className="service-features">
                <li>High-pressure water jetting</li>
                <li>Professional drain snaking</li>
                <li>Kitchen and bathroom drains</li>
                <li>Preventive maintenance</li>
              </ul>
              <a href="/services/drain-cleaning" className="btn btn-outline">Request Service</a>
            </div>

            {/* Sewer Line Repair */}
            <div className="service-card">
              <div className="service-thumb">
                <img src="/img/Sewer-Line-Problems_iStock-1326402307.jpg" alt="Sewer Line Repair" />
              </div>
              <h3>Sewer Line Repair</h3>
              <p>Expert repair and replacement of damaged sewer lines with minimal disruption to your property.</p>
              <ul className="service-features">
                <li>Trenchless repair options</li>
                <li>Traditional excavation</li>
                <li>Pipe lining and replacement</li>
                <li>Emergency repairs</li>
              </ul>
              <a href="/services/sewer-line-repair" className="btn btn-outline">Get Quote</a>
            </div>

            {/* Water Heater Services */}
            <div className="service-card">
              <div className="service-icon">
                <img src="/img/heater.png" alt="Water Heater Services" />
              </div>
              <h3>Water Heater Services</h3>
              <p>Installation, repair, and maintenance of traditional and tankless water heaters.</p>
              <ul className="service-features">
                <li>Tank and tankless units</li>
                <li>Emergency repairs</li>
                <li>Energy-efficient upgrades</li>
                <li>Regular maintenance</li>
              </ul>
              <a href="/services/water-heater-repair" className="btn btn-outline">Learn More</a>
            </div>

            {/* Emergency Services */}
            <div className="service-card">
              <div className="service-icon">
                <img className="no-stretch" src="/img/msg_warning-0.png" alt="Emergency Plumbing" />
              </div>
              <h3>Emergency Plumbing</h3>
              <p>24/7 emergency plumbing services for burst pipes, major leaks, and other urgent issues.</p>
              <ul className="service-features">
                <li>24/7 availability</li>
                <li>Rapid response time</li>
                <li>Burst pipe repairs</li>
                <li>Major leak stoppage</li>
              </ul>
              <a href="tel:8142736315" className="btn btn-emergency">Call Now: (814) 273-6315</a>
            </div>

            {/* Fixture Installation */}
            <div className="service-card">
              <div className="service-icon">
                <img src="/img/faucet.png" alt="Fixture Installation" />
              </div>
              <h3>Fixture Installation</h3>
              <p>Professional installation of faucets, toilets, sinks, and other plumbing fixtures.</p>
              <ul className="service-features">
                <li>Faucets and sinks</li>
                <li>Toilet installation</li>
                <li>Garbage disposals</li>
                <li>Water filters</li>
              </ul>
              <a href="/contact" className="btn btn-outline">Schedule Service</a>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Need Professional Plumbing Services?</h2>
            <p>Contact Marfinetz Plumbing for reliable, professional service across Pennsylvania and Ohio.</p>
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
