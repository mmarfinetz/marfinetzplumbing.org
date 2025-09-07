"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const hideEmergencyBanner = pathname?.startsWith('/contact');

  return (
    <>
      <header className="header">
        <div className="top-bar">
          <div className="container">
            <div className="contact-info">
              <span>Serving Erie County, PA | Crawford County, PA | Conneaut, OH</span>
              <a href="tel:8142736315" className="phone-number">(814) 273-6315</a>
            </div>
          </div>
        </div>
        <nav className="main-nav">
          <div className="container">
            <div className="logo">
              <Link href="/">
                <img src="/logo.svg" alt="Marfinetz Plumbing Logo" />
              </Link>
            </div>
            <ul className="nav-links">
              <li><Link href="/">Home</Link></li>
              <li className="dropdown">
                <Link href="/services">Services</Link>
                <ul className="dropdown-menu">
                  <li><Link href="/services/water-heater-repair">Water Heater Repair</Link></li>
                  <li><Link href="/services/drain-cleaning">Drain Cleaning</Link></li>
                  <li><Link href="/services/leak-repair">Leak Repair</Link></li>
                  <li><Link href="/services/bathroom-repair">Bathroom Repair</Link></li>
                  <li><Link href="/services/kitchen-plumbing">Kitchen Plumbing</Link></li>
                  <li><Link href="/services/commercial-services">Commercial Services</Link></li>
                </ul>
              </li>
              <li className="dropdown">
                <Link href="/service-areas">Service Areas</Link>
                <ul className="dropdown-menu">
                  <li><Link href="/service-areas/erie-pa">Erie County, PA</Link></li>
                  <li><Link href="/service-areas/crawford-pa">Crawford County, PA</Link></li>
                  <li><Link href="/service-areas/conneaut-oh">Conneaut, OH</Link></li>
                </ul>
              </li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/reviews">Reviews</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
            <div className="cta-button">
              <Link href="/contact" className="btn btn-primary">Request Service</Link>
            </div>
            <div className="mobile-menu-toggle">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </nav>
      </header>

      {!hideEmergencyBanner && (
        <div className="emergency-banner">
          <div className="container">
            <div className="emergency-content">
              <div className="emergency-icon">
                <img src="/img/emergency-icon.png" alt="Emergency Plumbing" />
              </div>
              <div className="emergency-text">
                <h2>24/7 Emergency Plumbing Services</h2>
                <p>Available in Erie County, Crawford County, and Conneaut OH</p>
              </div>
              <div className="emergency-cta">
                <a href="tel:8142736315" className="btn btn-emergency">Call Now: (814) 273-6315</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
