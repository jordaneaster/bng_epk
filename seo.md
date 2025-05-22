# BNG Music Entertainment - Tracking & SEO Strategy

## Overview

This document outlines the technical implementation of our tracking, analytics, and SEO strategy. The current implementation combines client-side tracking with server-side conversion tracking to maximize data collection reliability and marketing effectiveness.

## Meta Pixel & Conversion API Implementation

### Dual Tracking Architecture

Our implementation utilizes a dual tracking approach:

1. **Client-Side Meta Pixel**: Traditional browser-based tracking using Facebook's Pixel code
2. **Server-Side Conversions API**: Server-to-server event tracking that operates independently of browser limitations

This dual implementation provides significant benefits:
- Captures events even when browser tracking is blocked or limited
- Improves accuracy of conversion attribution
- Enhances targeting capabilities for ad campaigns
- Builds more reliable audiences for retargeting

### Privacy & Consent Management

Our implementation includes robust privacy features:

- **User Consent Integration**: Both Meta Pixel and Conversions API respect user consent choices
- **Data Hashing**: All personally identifiable information (PII) is hashed before sending to Meta
- **Deduplication**: We use unique event IDs to prevent duplicate counting when events are sent via both client and server
- **Transparent Cookie Notice**: Users are informed about tracking and can opt out

### Event Types & Tracking Capabilities

Our implementation supports the following event types:

#### Standard Meta Events
- PageView
- ViewContent
- AddToCart
- InitiateCheckout
- Purchase
- Lead
- CompleteRegistration

#### Custom Events
- Custom event tracking with parameterized data
- Video interaction tracking
- Social media engagement tracking
- Outbound link tracking
- Form submission tracking

## SEO Implementation

### Metadata Management

We implement comprehensive SEO metadata using both standard techniques and Next.js metadata API:

- **Dynamic Metadata**: Each page has customized metadata based on its content
- **Enhanced Descriptions**: Auto-truncated descriptions that preserve meaning
- **Keyword Optimization**: Structured keyword inclusion in metadata

### Social Media Optimization

- **Open Graph Protocol**: Complete implementation for Facebook/Instagram sharing
- **Twitter Cards**: Large image card format for Twitter sharing
- **Custom Social Images**: Page-specific social sharing images

### Structured Data (JSON-LD)

We implement schema.org structured data for rich search results:

- **MusicGroup Schema**: For artist information
- **MusicAlbum Schema**: For music releases
- **VideoObject Schema**: For video content
- **Article Schema**: For blog posts

## Technical Implementation

### Meta Pixel & Conversions API

The implementation consists of:

1. **Client-Side Pixel Code**: Located in `lib/metaPixel.js`
   - Initializes the pixel with consent awareness
   - Handles page view tracking automatically
   - Provides functions for standard and custom event tracking

2. **Server-Side Conversions API**: API endpoint at `/api/meta-conversion`
   - Processes events from client-side code
   - Securely hashes user data
   - Sends events directly to Meta's servers

3. **Analytics Component**: Located in `components/Analytics.js`
   - Handles loading and initialization of tracking scripts
   - Ensures tracking respects user consent
   - Manages automatic page view tracking

4. **useAnalytics Hook**: Located in `hooks/useAnalytics.js`
   - Provides React components with easy access to tracking functions
   - Centralizes tracking logic
   - Ensures consistent event parameter formatting

### SEO Components

1. **SEO Head Component**: Located in `components/SEOHead.js`
   - Manages meta tags for traditional pages
   - Handles canonical URLs and basic metadata

2. **SEO Utility Functions**: Located in `lib/seo.js`
   - Creates metadata objects for Next.js App Router
   - Generates structured data objects
   - Provides helper functions for metadata formatting

## Environment Configuration

Required environment variables:

```
NEXT_PUBLIC_FB_PIXEL_ID=your_pixel_id
META_ACCESS_TOKEN=your_conversions_api_token
NEXT_PUBLIC_SITE_URL=your_site_url
```

## Best Practices & Usage Guidelines

### When to Use Client-Side vs. Server-Side Events

- **Client-Side Events**: Use for user interactions and general page tracking
- **Server-Side Events**: Critical for high-value conversions, transactions, and form submissions

### Tracking User Data Responsibly

- Only collect necessary user data
- Ensure all PII is properly hashed
- Always respect user consent choices
- Update privacy policy to reflect tracking practices

### Monitoring & Optimization

- Regularly check Meta Events Manager for event data
- Monitor for any tracking discrepancies 
- Verify deduplication is working correctly
- Use Meta's Test Events tool to validate implementation

## Future Enhancements

Potential improvements to the current implementation:

1. Implement automated event value calculation
2. Add advanced matching parameters for improved conversion tracking
3. Integrate conversion value optimization
4. Implement server-side consent management
5. Add support for custom conversions

---

*Last Updated: [Current Date]*