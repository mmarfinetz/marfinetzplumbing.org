import type { Metadata } from 'next'
import './globals.css'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import PhoneClickTracking from '../components/PhoneClickTracking'

export const metadata: Metadata = {
  metadataBase: new URL('https://marfinetzplumbing.org'),
  title: 'Marfinetz Plumbing | Sewer Camera Inspection & Plumbing Services | Erie County, PA',
  description: 'Professional sewer camera inspection and plumbing services in Erie County, Crawford County PA, and Conneaut OH. 24/7 emergency service available. Call (814) 273-6315.',
  keywords: 'plumber Erie PA, sewer camera inspection, drain cleaning, emergency plumbing, Crawford County plumber, Conneaut OH plumbing',
  openGraph: {
    title: 'Marfinetz Plumbing | Sewer Camera Inspection & Plumbing Services',
    description: 'Professional sewer camera inspection and plumbing services in Erie County, Crawford County PA, and Conneaut OH. 24/7 emergency service available.',
    url: 'https://marfinetzplumbing.org',
    siteName: 'Marfinetz Plumbing',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marfinetz Plumbing | Professional Plumbing Services',
    description: '24/7 emergency plumbing and sewer camera inspection in Erie County, Crawford County PA, and Conneaut OH.',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/css/win97.css" />
        <link rel="stylesheet" href="/css/mobile.css" />

        {/* Google tag (gtag.js) - Analytics & Ads */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-B119JLJHDF"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-B119JLJHDF');
              gtag('config', 'AW-17046907044');
            `,
          }}
        />

        {/* Structured Data - Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Plumber',
              name: 'Marfinetz Plumbing',
              description: 'Professional sewer camera inspection and plumbing services in Erie County, Crawford County PA, and Conneaut OH.',
              url: 'https://marfinetzplumbing.org',
              telephone: '+18142736315',
              priceRange: '$$',
              image: 'https://marfinetzplumbing.org/logo.svg',
              address: {
                '@type': 'PostalAddress',
                addressRegion: 'PA',
                addressCountry: 'US',
              },
              areaServed: [
                {
                  '@type': 'City',
                  name: 'Erie',
                  '@id': 'https://en.wikipedia.org/wiki/Erie,_Pennsylvania',
                },
                {
                  '@type': 'AdministrativeArea',
                  name: 'Erie County',
                  containedIn: 'Pennsylvania',
                },
                {
                  '@type': 'AdministrativeArea',
                  name: 'Crawford County',
                  containedIn: 'Pennsylvania',
                },
                {
                  '@type': 'City',
                  name: 'Conneaut',
                  '@id': 'https://en.wikipedia.org/wiki/Conneaut,_Ohio',
                },
              ],
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                  'Sunday',
                ],
                opens: '00:00',
                closes: '23:59',
              },
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Plumbing Services',
                itemListElement: [
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Sewer Camera Inspection',
                      description: 'Professional sewer line video inspection services',
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Emergency Plumbing',
                      description: '24/7 emergency plumbing services',
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Drain Cleaning',
                      description: 'Professional drain cleaning and snaking services',
                    },
                  },
                ],
              },
            }),
          }}
        />
      </head>
      <body>
        <PhoneClickTracking />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
