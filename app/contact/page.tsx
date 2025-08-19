'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import type { Metadata } from 'next';

export default function ContactPage() {
  useEffect(() => {
    // Initialize form message handling
    const handleFormMessage = () => {
      const formMessage = document.getElementById('form-message');
      if (formMessage) {
        formMessage.style.display = 'none';
      }
    };

    handleFormMessage();
  }, []);

  return (
    <>
      <Script src="/js/lead-capture.js" strategy="afterInteractive" />
      
      <div className="contact-page-container">
        <style jsx global>{`
          .contact-page-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            position: relative;
            z-index: 10;
          }

          .win95-window {
            background: #c0c0c0;
            border: 2px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
            box-shadow: inset 1px 1px 0 0 #ffffff, 
                        1px 1px 0 0 #000000,
                        2px 2px 2px 0 rgba(0,0,0,0.1);
            position: relative;
            z-index: 20;
            width: 90%;
            max-width: 600px;
            max-height: 85vh;
            overflow: hidden;
            margin: 0 auto;
          }

          .win95-title-bar {
            background: linear-gradient(to right, #000080, #1084d0);
            color: white;
            padding: 2px 4px;
            font-size: 12px;
            font-weight: bold;
            display: flex;
            align-items: center;
            height: 20px;
            font-family: "MS Sans Serif", Tahoma, sans-serif;
          }

          .win95-title-bar::before {
            content: '';
            display: inline-block;
            width: 16px;
            height: 16px;
            background-image: url('/logo.svg');
            background-size: contain;
            background-repeat: no-repeat;
            margin-right: 4px;
            filter: brightness(2);
          }

          .win95-content {
            padding: 20px;
            background: #c0c0c0;
            max-height: calc(85vh - 30px);
            overflow-y: auto;
            overflow-x: hidden;
          }

          .win95-form {
            font-family: "MS Sans Serif", Tahoma, sans-serif;
            font-size: 11px;
          }

          .win95-form h3 {
            margin-top: 0;
            font-size: 14px;
            font-weight: bold;
          }

          .form-group {
            margin-bottom: 15px;
          }

          .form-group label {
            display: block;
            margin-bottom: 4px;
            font-weight: normal;
          }

          .win95-input,
          .win95-select,
          .win95-textarea {
            width: 100%;
            padding: 2px 4px;
            border: 2px solid;
            border-color: #808080 #ffffff #ffffff #808080;
            background: white;
            font-family: "MS Sans Serif", Tahoma, sans-serif;
            font-size: 11px;
          }

          .win95-textarea {
            resize: vertical;
            min-height: 60px;
          }

          .win95-button {
            background: #c0c0c0;
            border: 2px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
            padding: 4px 16px;
            font-family: "MS Sans Serif", Tahoma, sans-serif;
            font-size: 11px;
            cursor: pointer;
            min-width: 75px;
            text-align: center;
          }

          .win95-button:active {
            border-color: #808080 #ffffff #ffffff #808080;
            padding: 5px 15px 3px 17px;
          }

          .win95-button.primary {
            font-weight: bold;
          }

          .form-buttons {
            display: flex;
            gap: 8px;
            margin-top: 20px;
          }

          .form-message {
            background: white;
            border: 2px solid;
            border-color: #808080 #ffffff #ffffff #808080;
            padding: 10px;
            margin-bottom: 15px;
            font-size: 11px;
          }

          .form-message.error {
            color: #cc0000;
          }

          .form-message.success {
            color: #008000;
          }

          .emergency-highlight {
            background: #ff4444;
            color: white;
            padding: 15px;
            margin-bottom: 20px;
            border: 2px solid;
            border-color: #ffffff #808080 #808080 #ffffff;
            text-align: center;
            font-weight: bold;
            animation: pulse 2s infinite;
          }

          .emergency-highlight a {
            color: #ffff00;
            text-decoration: none;
            font-size: 16px;
          }

          .emergency-highlight a:hover {
            text-decoration: underline;
          }

          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.8; }
            100% { opacity: 1; }
          }

          @media (max-width: 768px) {
            .contact-page-container {
              padding: 10px;
              min-height: 100vh;
            }

            .win95-window {
              width: 100%;
              max-width: 100%;
              max-height: 90vh;
            }

            .win95-content {
              padding: 15px;
              max-height: calc(90vh - 30px);
              overflow-y: auto;
            }
          }
        `}</style>

        <div className="win95-window">
          <div className="win95-title-bar">
            Contact Us - Request Service
          </div>
          <div className="win95-content">
            <form id="lead-capture-form" className="win95-form">
              <h3>Get Your Plumbing Problem Fixed Today!</h3>
              
              <div className="emergency-highlight">
                🚨 Emergency? Call NOW: <a href="tel:814-273-6315">814-273-6315</a> 🚨
                <br />
                <small>Available 24/7 for urgent plumbing issues</small>
              </div>
              
              <div className="form-message" id="form-message" style={{display: 'none'}}></div>
              
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
              
              <p style={{textAlign: 'center', marginTop: '20px', color: '#666'}}>
                Or call us directly at <a href="tel:814-273-6315" style={{color: '#0000FF'}}>814-273-6315</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}