export const artistInfo = {
  name: "BNG NappSakk",
  tagline: "Hip-Hop Visionary | Performer | Fashion Icon",
  bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. Donec in efficitur ipsum, in dignissim lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce nec malesuada mi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.",
  // Note: The longBio string contains HTML <strong> tags for bold text.
  // The UI component rendering this string is responsible for interpreting these tags (e.g., using dangerouslySetInnerHTML or v-html).
  // The drop cap effect is a visual style and should be applied via CSS by targeting the first letter of the rendered paragraph (e.g., using the ::first-letter pseudo-element). It should not be encoded in this data string.
  longBio: "BNG Nappsakk is a rising independent hip-hop artist from Wilkinsburg, Pennsylvania, blending raw street perspective with intentional artistry and forward-thinking vision. Just outside Pittsburgh, he built his foundation freestyling at house parties, block cyphers, and grassroots showcases—developing a voice rooted in lived experience, community, and self-determination. His mantra, “The more you shine, the more shadows you cast,” speaks to both his journey and his understanding of visibility in today’s cultural landscape. In the past year, BNG Nappsakk has entered a new phase of growth through a strategic partnership with Rel Carter, Executive Director and A&R at Roc Nation and nephew of JAY-Z. The collaboration focuses on distribution, branding, and long-term artist development, marking a pivotal step forward while maintaining his independent foundation. Musically, BNG Nappsakk continues to sharpen his sound with intention and substance. His latest single, “Not No Rapper,” produced by Zaytoven, the Grammy Award–winning producer behind countless Atlanta hip-hop staples, serves as a defining statement—grounded, self-aware, and uncompromising. The record reinforces his refusal to chase trends, instead prioritizing authenticity and cultural resonance. As a live performer, BNG Nappsakk is actively expanding his national presence through festival appearances, showcases, and curated stages, including multiple performances at SXSW in Austin, Texas, alongside DMG Worldwide and DJConnect Pro. His performances balance high-energy delivery with narrative depth, making him a natural fit for platforms that value both artistry and community. Despite growing national momentum, BNG Nappsakk remains deeply connected to his roots—regularly returning to Wilkinsburg for pop-up shows, youth engagement, and community-driven initiatives. With executive-level backing, a growing catalog, and a clear artistic identity, BNG Nappsakk represents the next generation of independent hip-hop artists operating with both cultural purpose and major-level vision."
};

export const musicTracks = [
  {
    title: "Urban Dreams",
    type: "spotify",
    embedId: "5cY01UgXJIPw1Z4rMJ5GUq", // Example ID
    coverArt: "/images/album1.jpg"
  },
  {
    title: "Midnight Flow",
    type: "apple",
    embedId: "album-name/1234567890", // Example ID
    coverArt: "/images/album2.jpg"
  },
  {
    title: "Street Poetry",
    type: "soundcloud",
    embedId: "123456789", // Example ID
    coverArt: "/images/album3.jpg"
  },
  {
    title: "City Lights",
    type: "spotify",
    embedId: "1HMOHr3R2XVMhGCE5xGzCb", // Example ID
    coverArt: "/images/album4.jpg"
  },
];

export const videos = [
  {
    title: "Summer Tour Highlights",
    videoId: "dQw4w9WgXcQ", // Example YouTube ID
    platform: "youtube",
    description: "Highlights from the 2023 summer tour across major cities.",
    thumbnailUrl: "/images/video1.jpg"
  },
  {
    title: "Official Music Video - Urban Dreams",
    videoId: "jNQXAC9IVRw", // Example YouTube ID
    platform: "youtube",
    description: "The official music video for the hit single 'Urban Dreams'.",
    thumbnailUrl: "/images/video2.jpg"
  },
  {
    title: "Behind The Scenes - Album Recording",
    videoId: "76979871", // Example Vimeo ID
    platform: "vimeo",
    description: "Go behind the scenes of the recording process for the latest album.",
    thumbnailUrl: "/images/video3.jpg"
  },
];

export const tourDates = [
  {
    date: "June 15, 2023",
    venue: "The Echo",
    city: "Los Angeles, CA",
    ticketLink: "https://example.com/tickets",
    soldOut: false,
  },
  {
    date: "June 22, 2023",
    venue: "Bottom of the Hill",
    city: "San Francisco, CA",
    ticketLink: "https://example.com/tickets",
    soldOut: false,
  },
  {
    date: "July 5, 2023",
    venue: "The Mercury Lounge",
    city: "New York, NY",
    ticketLink: "https://example.com/tickets",
    soldOut: true,
  },
  {
    date: "July 10, 2023",
    venue: "Empty Bottle",
    city: "Chicago, IL",
    ticketLink: "https://example.com/tickets",
    soldOut: false,
  },
  {
    date: "July 15, 2023",
    venue: "The Crocodile",
    city: "Seattle, WA",
    ticketLink: "https://example.com/tickets",
    soldOut: false,
  },
];

export const pressItems = [
  {
    title: "Breaking New Ground with Album Release",
    publication: "Rolling Stone",
    date: "May 15, 2023",
    excerpt: "A groundbreaking new album that pushes the boundaries of modern hip-hop.",
    link: "https://example.com/article1",
    logo: "/images/press/rollingstone.png"
  },
  {
    title: "10 Artists to Watch in 2023",
    publication: "Complex",
    date: "January 5, 2023",
    excerpt: "The rising star makes our annual list of artists set to dominate the year.",
    link: "https://example.com/article2",
    logo: "/images/press/complex.png"
  },
  {
    title: "Interview: The Making of 'Urban Dreams'",
    publication: "Pitchfork",
    date: "April 20, 2023",
    excerpt: "We sat down to discuss the creative process behind the latest hit single.",
    link: "https://example.com/article3",
    logo: "/images/press/pitchfork.png"
  },
];

export const photos = [
  { url: "/images/gallery/photo1.jpg", alt: "Live performance at Coachella" },
  { url: "/images/gallery/photo2.jpg", alt: "Studio session" },
  { url: "/images/gallery/photo3.jpg", alt: "Press photoshoot" },
  { url: "/images/gallery/photo4.jpg", alt: "Backstage with the crew" },
  { url: "/images/gallery/photo5.jpg", alt: "Festival performance" },
  { url: "/images/gallery/photo6.jpg", alt: "Album cover shoot" },
  { url: "/images/gallery/photo7.jpg", alt: "Fan meetup" },
  { url: "/images/gallery/photo8.jpg", alt: "Radio interview" },
  { url: "/images/gallery/photo9.jpg", alt: "Award ceremony" },
];

export const socialLinks = {
  spotify: "https://open.spotify.com/artist/7DTwqaiSpmjzxnoBrRJeXe",
  appleMusic: "https://music.apple.com/us/artist/bng-nappsakk/1599225835",
  soundcloud: "https://soundcloud.com/search?q=bng%20nappsakk",
  youtube: "https://www.youtube.com/@bngnappsakk",
  instagram: "https://instagram.com/p/DIjZF9FRTyG",
  twitter: "https://x.com/BNG_Nappsakk",
  facebook: "https://facebook.com/napp.sakk.9",
  tiktok: "https://tiktok.com/@bng_nappsakk",
};

// Press Kit URL (Update this with the actual path or URL)
// Place your PDF in the /public folder and use the relative path like below
export const pressKitUrl = '/BNG_Nappsakk_Press_Kit.pdf'; // Example path, replace with your actual filename

// Add this new data for live shows
export const liveShows = [
  {
    id: 1,
    title: "BNG Live Performance",
    venue: "The Music Hall",
    date: "2023-12-15T20:00:00",
    time: "8:00 PM",
    city: "Atlanta",
    state: "GA",
    description: "Join us for an unforgettable night of music and entertainment featuring BNG Music!",
    ticketLink: "https://ticketmaster.com/event/123456",
    price: "25.00",
    soldOut: false,
    flyerImage: "/images/shows/atlanta-flyer.jpg"
  }
];
