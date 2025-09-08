"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, AlertTriangle, Clock, MapPin } from 'lucide-react';

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
        <div className="emergency-banner" style={{
          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
          color: 'white',
          padding: '1.5rem 0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div className="container">
            <div className="emergency-content" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: '1' }}>
                <div className="emergency-icon" style={{
                  width: '60px',
                  height: '60px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <AlertTriangle className="w-8 h-8" style={{ width: '32px', height: '32px' }} />
                </div>
                <div className="emergency-text">
                  <h2 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Clock className="w-5 h-5" style={{ width: '20px', height: '20px' }} />
                    24/7 Emergency Plumbing Services
                  </h2>
                  <p style={{ 
                    margin: '0.25rem 0 0 0', 
                    opacity: 0.95,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <MapPin className="w-4 h-4" style={{ width: '16px', height: '16px' }} />
                    Available in Erie County, Crawford County, and Conneaut OH
                  </p>
                </div>
              </div>
              <div className="emergency-cta">
                <a href="tel:8142736315" className="btn btn-emergency" style={{
                  background: 'white',
                  color: '#dc2626',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s',
                }}>
                  <Phone className="w-5 h-5" style={{ width: '20px', height: '20px' }} />
                  Call Now: (814) 273-6315
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
