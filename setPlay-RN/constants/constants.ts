export const DEFAULT_THUMBHASH = "1PcNJYJ3h3d4h3d3h4hwh3";

export const GENRES = [
  "Afro House",
  "Bass House",
  "Breakbeat",
  "Classical",
  "Dancehall",
  "Deep House",
  "Downtempo",
  "Drum and Bass",
  "Dubstep",
  "Electronica",
  "Experimental",
  "Funk",
  "Hip-Hop",
  "House",
  "Indie",
  "Indie Dance",
  "Jazz",
  "Jungle",
  "Latin House",
  "Melodic House",
  "Minimal",
  "Pop",
  "Progressive House",
  "R&B",
  "Reggae",
  "Reggaeton",
  "Rock",
  "Tech House",
  "Techno",
  "Trance",
  "UK Garage",
];

export const SOCIAL_PLATFORMS = [
  { key: "instagram", label: "Instagram", baseUrl: "https://instagram.com/" },
  { key: "facebook", label: "Facebook", baseUrl: "https://facebook.com/" },
  { key: "twitter", label: "Twitter", baseUrl: "https://x.com/" },
  { key: "tiktok", label: "TikTok", baseUrl: "https://tiktok.com/@" },
  { key: "youtube", label: "YouTube", baseUrl: "https://youtube.com/" },
];

export const CREDENTIALS = {
  username: "Krismi",
  cardholderName: "Krismi Armani",
  email: "krismi_armani@gmail.com",
  password: "PassWord_Q12",
  cardNumber: "8129 5678 9012 3947",
  cvv: "863",
  expirationDate: "12/26",
};

export const LOCATIONS = [
  {
    name: "Barbossa, Mtl",
    backgroundPictureUrl: "barbossa.webp",
  },
  {
    name: "Velvet Speakeasy, Mtl",
    // backgroundPicture: require(""),
  },
  {
    name: "Le Salon Daomé, Mtl",
    backgroundPictureUrl: "le-salon-daome.webp",
  },
  {
    name: "Sans Soleil, Mtl",
    backgroundPictureUrl: "sanssoleil.webp",
  },
  {
    name: "Parquette, Mtl",
    backgroundPictureUrl: "parquette.webp",
  },
  {
    name: "NWHR, Mtl",
    // backgroundPicture: require(""),
  },
  {
    name: "Le Belmont, Mtl",
    backgroundPictureUrl: "belmont.webp",
  },
];

export const VENUE_IMAGES: Record<string, any> = {
  "barbossa.webp": require("../assets/images/barbossa.webp"),
  "le-salon-daome.webp": require("../assets/images/le-salon-daome.webp"),
  "sanssoleil.webp": require("../assets/images/sanssoleil.webp"),
  "parquette.webp": require("../assets/images/parquette.webp"),
  "belmont.webp": require("../assets/images/belmont.webp"),
};

export const FALLBACK_IMAGE = {
  uri: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80",
};

export const VENUES = [
  "Nightclub",
  "Arts & Multimedia Venue",
  "After-hours Club",
  "Outdoor Festival/Day Party",
  "Warehouse/Concert Venue",
  "Speakeasy/club",
  "Bar/Club",
  "Wine Bar/Disco",
  "Club/Lounge",
  "Underground Bar/Club",
  "Underground club / community event space",
  "Underground Club / Event Space",
  "Lounge",
  "Concert hall/ large venue",
  "Live music venue",
  "Club",
  "Café / bar with live music",
  "Underground club",
];

export const RATING_CRITERIAS = {
  forProducer: [
    "Was the transition smooth and natural? Did the track fit seamlessly into the set?",
    "Was there a visible positive crowd response when the track was played?",
    "Was the proof video clear, with audible audio and visible crowd?",
    "Did the gig happen as planned — on time, no last-minute cancellations or surprises?",
  ],
  forDJ: [
    "Was the file properly formatted, correct BPM, and ready to play without issues?",
    "Did the submitted track match the genre, BPM, and vibe specified in the gig?",
    "Was the producer responsive, clear, and professional throughout the process?",
    "Did the producer follow through promptly after being selected (paid on time, no ghosting)?",
  ],
};
