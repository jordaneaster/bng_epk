import Image from 'next/image';
import Script from 'next/script';
import { createBaseMetadata } from '../../lib/seo';
import { supabase } from '../../lib/supabaseClient';

// Export metadata for this page
export const metadata = createBaseMetadata({
  title: 'Live Events - BNG Music',
  description: 'Check out upcoming shows, concerts, and live events for BNG Music.',
  path: '/live',
  ogImage: '/images/hero-bg.jpg',
});

async function getLiveEvents() {
  try {
    const { data, error } = await supabase
      .from('live_events')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching live events:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Failed to fetch live events:', err);
    return [];
  }
}

export default async function LiveEvents() {
  // Fetch live events from Supabase
  const liveShows = await getLiveEvents();
  
  // Get the next show (first one, if available)
  const nextShow = liveShows && liveShows.length > 0 ? liveShows[0] : null;
  
  // Create Event structured data for upcoming event
  const eventData = nextShow ? {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: `BNG Music Entertainment at ${nextShow.venue}`,
    startDate: nextShow.date,
    location: {
      '@type': 'Place',
      name: nextShow.venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: nextShow.city,
        addressRegion: nextShow.state,
      },
    },
    performer: {
      '@type': 'MusicGroup',
      name: 'BNG Music Entertainment',
    },
    offers: {
      '@type': 'Offer',
      url: nextShow.ticket_link || '',
      price: nextShow.price || '',
      priceCurrency: 'USD',
      availability: nextShow.sold_out ? 
        'https://schema.org/SoldOut' : 
        'https://schema.org/InStock',
    },
    image: nextShow.flyer_image,
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
      <div className="container px-4 py-8">
        <h1 className="text-center mb-8 text-4xl font-bold relative">
          <span className="relative z-10">Live Events</span>
          <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-[var(--color-primary)] rounded-full"></span>
        </h1>
        
        {nextShow ? (
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl shadow-2xl overflow-hidden max-w-5xl mx-auto transform transition-all duration-300 hover:scale-[1.01] mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Flyer Image - Larger and with hover effect */}
              <div className="flex justify-center items-center p-6 bg-black bg-opacity-50">
                <div className="relative max-w-md w-full mx-auto group">
                  <div className="overflow-hidden rounded-lg shadow-xl">
                    <Image 
                      src={nextShow.flyer_image} 
                      alt={`${nextShow.venue} show flyer`}
                      width={400}
                      height={533}
                      className="object-contain rounded-lg transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Event Details with enhanced styling */}
              <div className="flex flex-col justify-center p-8 text-white">
                <div className="animate-fadeIn">
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-8 bg-[var(--color-primary)] mr-3 rounded"></div>
                    <h2 className="text-3xl font-bold">{nextShow.title}</h2>
                  </div>
                  
                  <div className="bg-white/10 p-4 rounded-lg mb-5 backdrop-blur-sm">
                    <p className="text-xl font-semibold mb-2">{nextShow.venue}</p>
                    <div className="flex items-center mb-2">
                      <svg className="live-event-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <rect x="4" y="5" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <path d="M16 3v4M8 3v4M4 11h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <p className="text-lg">{new Date(nextShow.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center mb-2">
                      <svg className="live-event-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <p className="text-lg">{nextShow.time}</p>
                    </div>
                    <div className="flex items-center">
                      <svg className="live-event-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 13a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <path d="M17.7 16.7L13.5 20.9a2 2 0 01-2.8 0l-4.3-4.2a8 8 0 1111.3 0z" stroke="currentColor" strokeWidth="2" fill="none"/>
                      </svg>
                      <p className="text-lg">{nextShow.city}, {nextShow.state}</p>
                    </div>
                  </div>
                  
                  {nextShow.description && (
                    <div className="mb-6 text-gray-300 leading-relaxed">
                      <p>{nextShow.description}</p>
                    </div>
                  )}
                  
                  <div className="mt-auto">
                    {nextShow.sold_out ? (
                      <div className="bg-red-600 text-white py-3 px-6 inline-block rounded-lg font-semibold shadow-lg">SOLD OUT</div>
                    ) : (
                      <a 
                        href={nextShow.ticket_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="relative inline-flex items-center px-8 py-3 overflow-hidden text-lg font-medium text-white bg-[var(--color-primary)] rounded-lg group"
                      >
                        <span className="absolute left-0 block w-full h-0 transition-all bg-opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease bg-[var(--color-primary)] hover:bg-opacity-80"></span>
                        <span className="relative">Get Tickets</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-900 rounded-xl shadow-lg max-w-3xl mx-auto">
            <svg className="w-4 h-4 mx-auto text-gray-600 mb-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M9 9h.01M15 9h.01M9 15a3 3 0 006 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p className="text-center text-xl">No upcoming shows scheduled. Check back soon!</p>
          </div>
        )}
        
        {liveShows && liveShows.length > 1 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8 text-center relative inline-block mx-auto">
              <span className="relative z-10">More Upcoming Events</span>
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-[var(--color-primary)]/70 rounded-full"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {liveShows.slice(1).map((show, index) => (
                <div key={index} 
                  className="border border-gray-700 rounded-lg p-5 hover:shadow-lg transition-all duration-300 bg-gray-900 hover:bg-gray-800 transform hover:-translate-y-1"
                >
                  <div className="flex items-start mb-3">
                    <svg className="live-event-icon mt-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> {/* Adjusted mt-1.5 to mt-1 for better alignment with 12px icon */}
                      <path d="M9 18V5l12-3v13M9 18c0 1.1-1.3 2-3 2s-3-.9-3-2 1.3-2 3-2 3 .9 3 2zM21 15c0 1.1-1.3 2-3 2s-3-.9-3-2 1.3-2 3-2 3 .9 3 2zM9 9l12-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                    <p className="font-semibold text-lg">{show.title}</p>
                  </div>
                  <p className="mb-2 text-gray-300">{show.venue}</p>
                  <p className="mb-2 text-gray-400">{new Date(show.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  <p className="mb-4 text-gray-400">{show.city}, {show.state}</p>
                  {!show.sold_out && (
                    <a 
                      href={show.ticket_link} 
                      className="text-[var(--color-primary)] hover:text-white inline-flex items-center group"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get Tickets
                      <svg className="live-event-icon ml-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> {/* Removed transform classes, relying on live-event-icon for size */}
                        <path d="M5 12h14M14 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
