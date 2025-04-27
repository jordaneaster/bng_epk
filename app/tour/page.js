import Card from '../../components/Card';
import { tourDates } from '../../data/mockData';
import Script from 'next/script';
import { createBaseMetadata } from '../../lib/seo';

// Export metadata for this page
export const metadata = createBaseMetadata({
  title: 'Tour Dates - BNG Music',
  description: 'Check out upcoming tour dates, concerts, and live events for BNG Music.',
  path: '/tour',
  ogImage: '/images/hero-bg.jpg',
});

export default function Tour() {
  // Create Event structured data for upcoming events
  const eventData = tourDates && tourDates.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: `BNG Music Entertainment at ${tourDates[0].venue}`,
    startDate: tourDates[0].date,
    location: {
      '@type': 'Place',
      name: tourDates[0].venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: tourDates[0].city,
      },
    },
    performer: {
      '@type': 'MusicGroup',
      name: 'BNG Music Entertainment.',
    },
    offers: {
      '@type': 'Offer',
      url: tourDates[0].ticketLink || '',
      price: tourDates[0].price || '',
      priceCurrency: 'USD',
      availability: tourDates[0].soldOut ? 
        'https://schema.org/SoldOut' : 
        'https://schema.org/InStock',
    },
  } : null;

  return (
    <>
      {eventData && (
        <Script
          id="schema-event"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventData) }}
        />
      )}
      <div className="container">
        <h1 className="text-center mb-4">Tour Dates</h1>
        
        {/* 
        <div className="grid grid-cols-1 grid-cols-3">
          {tourDates.map((show, index) => (
            <div key={index} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <Card
                title={show.venue}
                date={show.date}
                location={show.city}
                linkUrl={show.soldOut ? null : show.ticketLink}
                linkText={show.soldOut ? 'Sold Out' : 'Get Tickets'}
              />
            </div>
          ))}
        </div>
        */}
        <p className="text-center text-xl mt-8">Tour dates coming soon!</p>
      </div>
    </>
  );
}
