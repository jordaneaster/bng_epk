export const artistInfo = {
  name: "BNG NappSakk",
  tagline: "Hip-Hop Visionary | Performer | Fashion Icon",
  bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. Donec in efficitur ipsum, in dignissim lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce nec malesuada mi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.",
  // Note: The longBio string contains HTML <strong> tags for bold text.
  // The UI component rendering this string is responsible for interpreting these tags (e.g., using dangerouslySetInnerHTML or v-html).
  // The drop cap effect is a visual style and should be applied via CSS by targeting the first letter of the rendered paragraph (e.g., using the ::first-letter pseudo-element). It should not be encoded in this data string.
  longBio: "Bng NappSakk is a rising force in hip-hop, rooted deeply in the streets of Wilkinsburg, Pennsylvania, where he cut his teeth freestyling at house parties and block-to-block cyphers. His mantra, \"The more you shine ✨ the more shadows you cast,\" reflects not only the challenges he’s overcome growing up in a close-knit community just outside Pittsburgh, but also his understanding of what it takes to stand out on a global stage. His latest single, <strong>\"BAPE,\"</strong> channels that Wilkinsburg grit—melding hard-hitting bars with a celebratory nod to iconic streetwear culture. The track is <strong>now streaming on Apple Music and Spotify</strong>, and its visuals pay homage to the neighborhoods that shaped him. Beyond music, Bng NappSakk is building invaluable industry connections. A standout moment was his music-and-business meeting with legendary rapper Jadakiss, underlining his commitment to both artistic growth and entrepreneurial savvy. Yet even as he networks with East Coast greats, he never forgets his local roots—often returning to Wilkinsburg for pop-up shows, youth workshops, and community fundraisers. With a steadily growing discography and a clear vision forged in Pennsylvanian streets, Bng NappSakk continues to push boundaries and put Wilkinsburg on the hip-hop map."
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
