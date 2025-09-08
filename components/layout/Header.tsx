"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, AlertTriangle, Clock, MapPin, Shield } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const hideEmergencyBanner = pathname?.startsWith('/contact');

  return (
    <>
      <header className="header">
        <div className="top-bar">
          <div className="container">
            <div className="contact-info">
              <MapPin className="w-4 h-4" style={{ width: '16px', height: '16px', display: 'inline', marginRight: '4px' }} />
              <span>Serving Erie County, PA | Crawford County, PA | Conneaut, OH</span>
            </div>
          </div>
        </div>
        <nav className="main-nav">
          <div className="container">
            <div className="logo" style={{
              padding: '0.5rem 0'
            }}>
              <Link href="/" style={{
                display: 'inline-block'
              }}>
                <img 
                  src="/img/noBgBlack.png" 
                  alt="Marfinetz Plumbing Logo" 
                  style={{
                    height: '70px',
                    width: 'auto',
                    display: 'block',
                    objectFit: 'contain'
                  }}
                />
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
          background: 'linear-gradient(90deg, #1e40af 0%, #2563eb 100%)',
          color: 'white',
          padding: '0.75rem 0',
          borderBottom: '3px solid #dc2626'
        }}>
          <div className="container">
            <div className="emergency-content" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '2rem',
                flex: '1'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: 'rgba(220, 38, 38, 0.9)',
                  borderRadius: '9999px',
                  fontWeight: 'bold',
                  animation: 'pulse 2s infinite'
                }}>
                  <AlertTriangle className="w-5 h-5" style={{ width: '20px', height: '20px' }} />
                  <span>EMERGENCY</span>
                </div>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock className="w-5 h-5" style={{ width: '20px', height: '20px', color: '#fbbf24' }} />
                    <span>24/7 Available</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Shield className="w-5 h-5" style={{ width: '20px', height: '20px', color: '#fbbf24' }} />
                    <span>Licensed & Insured</span>
                  </div>
                </div>
              </div>
              <div className="emergency-cta">
                <a href="tel:8142736315" className="btn btn-emergency" style={{
                  background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '9999px',
                  fontWeight: 'bold',
                  fontSize: '1.125rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.2s',
                  border: '2px solid transparent'
                }}>
                  <Phone className="w-5 h-5" style={{ width: '20px', height: '20px' }} />
                  (814) 273-6315
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
