import React from 'react';
import type { Metadata } from 'next';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

export const metadata: Metadata = {
  title: 'Service Areas | Marfinetz Plumbing | Erie County, Crawford County, Conneaut OH',
  description: 'Marfinetz Plumbing serves Erie County PA, Crawford County PA, and Conneaut OH with professional sewer camera inspection and plumbing services.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
};

export default function ServiceAreasPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="service-areas-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Our Service Areas</h1>
            <p className="hero-subtitle">Professional plumbing services across Pennsylvania and Ohio</p>
            <p className="hero-description">We proudly serve customers throughout our tri-state region with reliable, professional plumbing services.</p>
          </div>
        </div>
      </section>

      {/* Primary Service Areas */}
      <section className="primary-areas">
        <div className="container">
          <div className="section-header">
            <h2>Primary Service Areas</h2>
            <p>Our main coverage areas for all plumbing services</p>
          </div>
          <div className="areas-grid">
            <div className="area-card featured">
              <div className="area-image">
                <ImageWithFallback src="/img/erie.png" alt="Erie County, PA" />
              </div>
              <h3>Erie County, Pennsylvania</h3>
              <p>Complete plumbing services throughout Erie County including sewer camera inspection, drain cleaning, emergency repairs, and fixture installation.</p>
              <div className="area-highlights">
                <h4>Areas We Serve:</h4>
                <ul>
                  <li>Erie City</li>
                  <li>Millcreek</li>
                  <li>Lower Macungie</li>
                  <li>Summit Township</li>
                  <li>Harborcreek</li>
                  <li>And surrounding communities</li>
                </ul>
              </div>
              <a href="/service-areas/erie-pa" className="btn btn-primary">Erie County Services</a>
            </div>

            <div className="area-card featured">
              <div className="area-image">
                <ImageWithFallback src="/img/crawford.png" alt="Crawford County, PA" />
              </div>
              <h3>Crawford County, Pennsylvania</h3>
              <p>Reliable plumbing solutions for Crawford County homes and businesses with the same professional standards and quality service.</p>
              <div className="area-highlights">
                <h4>Areas We Serve:</h4>
                <ul>
                  <li>Meadville</li>
                  <li>Titusville</li>
                  <li>Linesville</li>
                  <li>Cambridge Springs</li>
                  <li>Saegertown</li>
                  <li>And surrounding communities</li>
                </ul>
              </div>
              <a href="/service-areas/crawford-pa" className="btn btn-primary">Crawford County Services</a>
            </div>

            <div className="area-card featured">
              <div className="area-image">
                <ImageWithFallback src="/img/conneaut.png" alt="Conneaut, OH" />
              </div>
              <h3>Conneaut, Ohio</h3>
              <p>Cross-border service for our Ohio neighbors with the same quality, reliability, and professional standards you expect from Marfinetz Plumbing.</p>
              <div className="area-highlights">
                <h4>Areas We Serve:</h4>
                <ul>
                  <li>Conneaut</li>
                  <li>Kingsville</li>
                  <li>North Kingsville</li>
                  <li>Pierpont</li>
                  <li>And surrounding areas</li>
                </ul>
              </div>
              <a href="/service-areas/conneaut-oh" className="btn btn-primary">Conneaut Services</a>
            </div>
          </div>
        </div>
      </section>

      {/* Service Coverage Map */}
      <section className="coverage-info">
        <div className="container">
          <div className="coverage-content">
            <div className="coverage-text">
              <h2>Tri-State Coverage Area</h2>
              <p>Marfinetz Plumbing is uniquely positioned to serve customers across state lines, providing consistent, professional plumbing services throughout our region.</p>
              <div className="coverage-benefits">
                <h3>Why Choose Our Regional Service?</h3>
                <ul>
                  <li><strong>Consistent Standards:</strong> Same quality service across all areas</li>
                  <li><strong>Local Knowledge:</strong> We understand regional plumbing challenges</li>
                  <li><strong>Fast Response:</strong> Strategic coverage for quicker service calls</li>
                  <li><strong>Licensed & Insured:</strong> Properly licensed for Pennsylvania and Ohio</li>
                </ul>
              </div>
            </div>
            <div className="coverage-stats">
              <div className="stat-card">
                <h3>3</h3>
                <p>Counties Served</p>
              </div>
              <div className="stat-card">
                <h3>2</h3>
                <p>States Covered</p>
              </div>
              <div className="stat-card">
                <h3>24/7</h3>
                <p>Emergency Service</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Information */}
      <section className="service-info">
        <div className="container">
          <div className="section-header">
            <h2>Services Available in All Areas</h2>
            <p>Complete plumbing solutions wherever you&apos;re located</p>
          </div>
          <div className="services-grid">
            <div className="service-item">
              <div className="service-icon">
                <img src="/img/Sewer-Camera-Inspection.png" alt="Sewer Camera Inspection" />
              </div>
              <h3>Sewer Camera Inspection</h3>
              <p>Advanced video inspection technology available in all service areas.</p>
            </div>
            <div className="service-item">
              <div className="service-icon">
                <img src="/img/Drain-Snake.jpg" alt="Drain Cleaning" />
              </div>
              <h3>Drain Cleaning</h3>
              <p>Professional drain cleaning and snaking services across all locations.</p>
            </div>
            <div className="service-item">
              <div className="service-icon">
                <img src="/img/msg_warning-0.png" alt="Emergency Services" />
              </div>
              <h3>Emergency Services</h3>
              <p>24/7 emergency plumbing response throughout our entire service area.</p>
            </div>
            <div className="service-item">
              <div className="service-icon">
                <img src="/img/heater.png" alt="Water Heater Services" />
              </div>
              <h3>All Plumbing Services</h3>
              <p>Complete plumbing solutions for residential and commercial properties.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Schedule Service?</h2>
            <p>Contact Marfinetz Plumbing for professional service in your area.</p>
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
