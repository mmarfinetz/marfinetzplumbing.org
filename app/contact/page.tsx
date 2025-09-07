'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

export default function ContactPage() {
  const router = useRouter();

  useEffect(() => {
    // Initialize form message handling
    const handleFormMessage = () => {
      const formMessage = document.getElementById('form-message');
      if (formMessage) {
        formMessage.style.display = 'none';
      }
    };

    handleFormMessage();

    // Add escape key handler to close modal
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        router.push('/');
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [router]);

  const handleClose = () => {
    router.push('/');
  };

  return (
    <div className="contact-page">
      <Script src="/js/lead-capture.js" strategy="afterInteractive" />
      
      {/* Modal Backdrop */}
      <div className="modal-backdrop" onClick={handleClose}>
        {/* Modal Window - onClick stopped to prevent closing when clicking inside */}
        <div className="window contact-modal" onClick={(e) => e.stopPropagation()}>
          <div className="title-bar">
            <div className="title-bar-text">Contact Us - Request Service</div>
            <div className="title-bar-controls">
              <button type="button" className="title-bar-button minimize-button" onClick={handleClose}>_</button>
              <button type="button" className="title-bar-button maximize-button" onClick={handleClose}>□</button>
              <button type="button" className="title-bar-button close-button" onClick={handleClose}>×</button>
            </div>
          </div>
          <div className="window-content" style={{ padding: '20px' }}>
            <form id="lead-capture-form">
              <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Get Your Plumbing Problem Fixed Today!</h3>
              
              <div className="emergency-banner">
                🚨 <strong>Emergency? Call NOW:</strong> <a href="tel:814-273-6315" style={{ color: '#ffff00', fontSize: '16px' }}>(814) 273-6315</a> 🚨
                <br />
                <small>Available 24/7 in Erie County, Crawford County, and Conneaut OH</small>
              </div>
              
              <div className="form-message" id="form-message" style={{ display: 'none' }}></div>
              
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  className="win95-input" 
                  autoComplete="name"
                  placeholder="Enter your full name"
                  minLength={2}
                  title="Please enter your full name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  required 
                  className="win95-input" 
                  autoComplete="tel"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}|[0-9]{10}|\([0-9]{3}\) [0-9]{3}-[0-9]{4}"
                  placeholder="(814) 555-1234"
                  title="Please enter a valid phone number"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  className="win95-input" 
                  autoComplete="email"
                  placeholder="your.email@example.com"
                  title="Please enter a valid email address"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="property_type">Property Type *</label>
                <select id="property_type" name="property_type" required className="win95-select">
                  <option value="">Select Property Type</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="location">Service Address *</label>
                <input type="text" id="location" name="location" required className="win95-input" placeholder="Street address, City, PA" autoComplete="street-address" />
              </div>
              
              <div className="form-group">
                <label htmlFor="urgency">How urgent is this? *</label>
                <select id="urgency" name="urgency" required className="win95-select">
                  <option value="">Select Urgency</option>
                  <option value="emergency">Emergency - Need help NOW!</option>
                  <option value="same_day">Same day service needed</option>
                  <option value="this_week">This week is fine</option>
                  <option value="flexible">I&apos;m flexible on timing</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="problem">Describe your plumbing problem *</label>
                <textarea 
                  id="problem" 
                  name="problem" 
                  required 
                  className="win95-textarea" 
                  rows={4} 
                  placeholder="Please describe the issue you're experiencing in detail..."
                  minLength={10}
                  maxLength={1000}
                  title="Please provide a detailed description of your plumbing issue (minimum 10 characters)"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="preferred_contact">Preferred Contact Method</label>
                <select id="preferred_contact" name="preferred_contact" className="win95-select">
                  <option value="phone">Call me</option>
                  <option value="email">Email me</option>
                  <option value="text">Text me</option>
                </select>
              </div>
              
              <div className="form-buttons">
                <button type="submit" className="win95-button primary" id="lead-submit-button">Submit Request</button>
                <button type="button" className="win95-button" onClick={() => (document.getElementById('lead-capture-form') as HTMLFormElement)?.reset()}>Clear Form</button>
              </div>
              
              <p style={{ textAlign: 'center', marginTop: '20px', color: '#333', fontSize: '12px' }}>
                <strong>Service Areas:</strong> Erie County, Crawford County, and Conneaut OH<br />
                Or call us directly at <a href="tel:814-273-6315" style={{ color: '#0000FF', fontWeight: 'bold' }}>(814) 273-6315</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
