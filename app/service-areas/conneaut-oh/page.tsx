import React from 'react';
import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Wrench, Droplets, Shield, Clock, MapPin, CheckCircle2, AlertCircle, Users, TreePine, Snowflake, Home, Layers, Star, Quote } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Plumbing & Sewer Services in Conneaut, OH | Marfinetz Plumbing',
  description: 'Professional plumbing and sewer camera inspection services in Conneaut, Ohio. Fast response times and quality service across state lines. Call (814) 273-6315.',
}

export default function ConneautOH() {
  return (
    <main>
      {/* Location Hero Section */}
      <section className="location-hero">
        <div className="container">
          <div className="location-hero-content">
            <h1>Professional Plumbing Services in Conneaut, Ohio</h1>
            <p className="location-hero-subtitle">Quality Plumbing & Sewer Services Across State Lines</p>
            <p className="location-hero-description">Marfinetz Plumbing proudly serves Conneaut, Ohio with the same high-quality plumbing services we provide in Pennsylvania. Our strategic location allows us to offer fast response times and reliable service to our Ohio neighbors.</p>
            <div className="location-hero-cta">
              <a href="tel:8142736315" className="btn btn-primary">Call (814) 273-6315</a>
              <a href="/contact" className="btn btn-secondary">Request Service</a>
            </div>
          </div>
          <div className="location-hero-image">
            <div className="hero-image-container" style={{
              background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
              borderRadius: '12px',
              padding: '3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
              <Wrench className="w-32 h-32 text-white" style={{ width: '128px', height: '128px' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Services in Conneaut Section */}
      <section className="location-services">
        <div className="container">
          <div className="section-header">
            <h2>Our Services in Conneaut</h2>
            <p>Comprehensive plumbing solutions for Ohio residents</p>
          </div>
          <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            {/* Sewer Camera Inspection Card */}
            <Card className="transform transition-transform hover:scale-105 hover:shadow-xl">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Sewer Camera Inspection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Our high-definition sewer camera inspections help Conneaut homeowners identify blockages, cracks, and other issues without destructive digging.</p>
                <a href="/services/sewer-camera-inspection" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                  Learn More →
                </a>
              </CardContent>
            </Card>
            
            {/* Drain Cleaning Card */}
            <Card className="transform transition-transform hover:scale-105 hover:shadow-xl">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Droplets className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Drain Cleaning & Snaking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Professional solutions for clogged drains and sewer lines in Conneaut homes and businesses.</p>
                <a href="/services/drain-cleaning" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                  Learn More →
                </a>
              </CardContent>
            </Card>
            
            {/* Sewer Line Repair Card */}
            <Card className="transform transition-transform hover:scale-105 hover:shadow-xl">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Wrench className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Sewer Line Repair</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Expert repair and replacement services for damaged sewer lines in Conneaut, including trenchless options.</p>
                <a href="/services/sewer-line-repair" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                  Learn More →
                </a>
              </CardContent>
            </Card>
            
            {/* Emergency Services Card */}
            <Card className="transform transition-transform hover:scale-105 hover:shadow-xl">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Emergency Plumbing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">24/7 emergency service for Conneaut residents facing burst pipes, major leaks, sewer backups, and other plumbing emergencies.</p>
                <a href="/services/emergency-plumbing" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                  Learn More →
                </a>
              </CardContent>
            </Card>
            
          </div>
          {/* View All Services Button */}
          <div className="text-center mt-8">
            <a href="/services" className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              View All Services
            </a>
          </div>
        </div>
      </section>

      {/* Conneaut Service Area Section */}
      <section className="service-area-map">
        <div className="container">
          <div className="section-header">
            <h2>Our Conneaut Service Area</h2>
            <p>Fast response times throughout Conneaut and surrounding areas</p>
          </div>
          <div className="map-container">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47942.30129019611!2d-80.59999999999999!3d41.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8832a2a4b2a2a2a3%3A0x1a1a1a1a1a1a1a1a!2sConneaut%2C%20OH!5e0!3m2!1sen!2sus!4v1617304829000!5m2!1sen!2sus" width="100%" height="450" style={{border:0}} allowFullScreen={true} loading="lazy"></iframe>
          </div>
          <div className="neighborhoods">
            <h3>Neighborhoods We Serve in Conneaut</h3>
            <div className="neighborhoods-grid">
              <ul>
                <li>Downtown Conneaut</li>
                <li>Conneaut Harbor</li>
                <li>Amboy</li>
                <li>South Ridge</li>
              </ul>
              <ul>
                <li>North Kingsville</li>
                <li>East Conneaut</li>
                <li>West Conneaut</li>
                <li>Lakeside</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Common Plumbing Issues in Conneaut Section */}
      <section className="common-issues">
        <div className="container">
          <div className="section-header">
            <h2>Common Plumbing Issues in Conneaut</h2>
            <p>Local challenges we help solve</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
                  <Home className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle className="text-lg">Aging Infrastructure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">Many Conneaut homes have older plumbing systems that are prone to leaks, corrosion, and failures. Our sewer camera inspections can identify these issues before they become major problems.</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <TreePine className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Tree Root Intrusion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">Conneaut&apos;s mature trees can cause significant damage to sewer lines. Our camera inspections can identify root intrusions and help target repairs precisely.</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-brown-500 hover:shadow-lg transition-shadow" style={{ borderLeftColor: '#8B4513' }}>
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                  <Layers className="w-6 h-6 text-orange-700" />
                </div>
                <CardTitle className="text-lg">Soil Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">The clay-heavy soil in parts of Conneaut can put pressure on pipes and cause shifting that leads to cracks and breaks. We can identify these issues with our camera equipment.</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <Snowflake className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Winter Freezing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">Conneaut&apos;s cold winters can lead to frozen and burst pipes. We provide emergency services and preventative maintenance to protect your plumbing system.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials from Conneaut Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>What Conneaut Customers Say</h2>
            <p>Read reviews from our Ohio clients</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Testimonial 1 */}
            <Card className="relative overflow-hidden hover:shadow-xl transition-shadow">
              <div className="absolute top-4 right-4 text-gray-200">
                <Quote className="w-8 h-8 rotate-180" />
              </div>
              <CardHeader>
                <div className="flex space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 italic mb-4">&ldquo;I was worried about hiring a company from across state lines, but Marfinetz Plumbing arrived quickly and solved our sewer backup problem. Their camera inspection found the exact location of the blockage.&rdquo;</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">Robert T.</p>
                  <p className="text-sm text-gray-500">Conneaut, OH</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Testimonial 2 */}
            <Card className="relative overflow-hidden hover:shadow-xl transition-shadow">
              <div className="absolute top-4 right-4 text-gray-200">
                <Quote className="w-8 h-8 rotate-180" />
              </div>
              <CardHeader>
                <div className="flex space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 italic mb-4">&ldquo;We had multiple plumbers look at our recurring drain problems without success. MMW&apos;s camera inspection found tree roots that other companies missed. Problem solved!&rdquo;</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">Jennifer L.</p>
                  <p className="text-sm text-gray-500">Conneaut Harbor, OH</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Testimonial 3 */}
            <Card className="relative overflow-hidden hover:shadow-xl transition-shadow">
              <div className="absolute top-4 right-4 text-gray-200">
                <Quote className="w-8 h-8 rotate-180" />
              </div>
              <CardHeader>
                <div className="flex space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 italic mb-4">&ldquo;Fast response time even though we&apos;re in Ohio. Their sewer camera inspection saved us thousands in unnecessary repairs by pinpointing the exact problem area.&rdquo;</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">Michael D.</p>
                  <p className="text-sm text-gray-500">North Kingsville, OH</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us for Conneaut Section */}
      <section className="why-choose-us">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Marfinetz Plumbing in Conneaut</h2>
            <p>The benefits of our cross-border service</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Cross-Border Expertise</h3>
              <p className="text-gray-600">We&apos;re licensed and insured to work in both Pennsylvania and Ohio, providing seamless service across state lines.</p>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Response Times</h3>
              <p className="text-gray-600">Our strategic location allows us to reach Conneaut customers quickly, even for emergency services.</p>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Local Knowledge</h3>
              <p className="text-gray-600">We understand Conneaut&apos;s unique plumbing challenges and infrastructure issues.</p>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Same Quality Service</h3>
              <p className="text-gray-600">Ohio customers receive the same high-quality service and attention as our Pennsylvania clients.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Need Plumbing Services in Conneaut?</h2>
            <p>Contact Marfinetz Plumbing today for fast, reliable service across state lines.</p>
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
