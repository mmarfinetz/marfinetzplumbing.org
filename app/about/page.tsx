import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Marfinetz Plumbing | Licensed Plumbers | Erie County, PA',
  description: 'Learn about Marfinetz Plumbing, your trusted local plumbing professionals serving Erie County, Crawford County PA, and Conneaut OH since [year].',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
};

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1>About Marfinetz Plumbing</h1>
            <p className="hero-subtitle">Your Trusted Local Plumbing Professionals</p>
            <p className="hero-description">Proudly serving Erie County, Crawford County PA, and Conneaut OH with reliable, professional plumbing services.</p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="our-story">
        <div className="container">
          <div className="content-grid">
            <div className="content-text">
              <h2>Our Story</h2>
              <p>Marfinetz Plumbing has been serving the tri-state area with professional plumbing services, specializing in advanced sewer camera inspection technology and comprehensive plumbing solutions.</p>
              <p>We understand that plumbing problems can be stressful and disruptive to your daily life. That&apos;s why we&apos;re committed to providing fast, reliable, and honest service that you can trust.</p>
              <p>Our team of licensed professionals brings years of experience and the latest technology to every job, ensuring that we can diagnose problems accurately and provide long-lasting solutions.</p>
            </div>
            <div className="content-image">
              <img src="/img/with-padding-1.png" alt="Marfinetz Plumbing Team" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="our-values">
        <div className="container">
          <div className="section-header">
            <h2>Our Values</h2>
            <p>The principles that guide everything we do</p>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <img src="/img/icons/experience.svg" alt="Quality Icon" />
              </div>
              <h3>Quality Workmanship</h3>
              <p>We take pride in our work and never cut corners. Every job is completed to the highest standards.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <img src="/img/icons/pricing.svg" alt="Honesty Icon" />
              </div>
              <h3>Transparent Pricing</h3>
              <p>No hidden fees, no surprise charges. We provide upfront, honest pricing for all our services.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <img src="/img/icons/guarantee.svg" alt="Reliability Icon" />
              </div>
              <h3>Reliable Service</h3>
              <p>When you call us, we&apos;ll be there. We show up on time and get the job done right the first time.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <img src="/img/icons/location.svg" alt="Community Icon" />
              </div>
              <h3>Local Community</h3>
              <p>We&apos;re proud to serve our local community and build lasting relationships with our customers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Overview */}
      <section className="services-overview">
        <div className="container">
          <div className="section-header">
            <h2>What We Do</h2>
            <p>Comprehensive plumbing services for your home and business</p>
          </div>
          <div className="services-list">
            <div className="service-item">
              <h3>Sewer Camera Inspection</h3>
              <p>Advanced video technology to diagnose sewer line problems without destructive digging.</p>
            </div>
            <div className="service-item">
              <h3>Drain Cleaning</h3>
              <p>Professional drain cleaning and snaking services to clear stubborn blockages.</p>
            </div>
            <div className="service-item">
              <h3>Emergency Services</h3>
              <p>24/7 emergency plumbing services for burst pipes, major leaks, and other urgent issues.</p>
            </div>
            <div className="service-item">
              <h3>Fixture Installation</h3>
              <p>Installation and repair of faucets, toilets, water heaters, and other plumbing fixtures.</p>
            </div>
          </div>
          <div className="cta-button">
            <a href="/services" className="btn btn-primary">View All Services</a>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Work With Us?</h2>
            <p>Contact Marfinetz Plumbing today for professional, reliable plumbing services.</p>
            <div className="cta-buttons">
              <a href="tel:8142736315" className="btn btn-primary">Call (814) 273-6315</a>
              <a href="/contact" className="btn btn-secondary">Get In Touch</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
