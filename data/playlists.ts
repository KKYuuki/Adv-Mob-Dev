export interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  artwork: string;
  followers: string;
  mood: string;
  tracks: PlaylistTrack[];
}

export const playlists: Playlist[] = [
  {
    id: "cosmic-vibes",
    title: "Cosmic Vibes",
    description: "Dreamy synths and downtempo beats for late-night focus sessions.",
    artwork: "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=800",
    followers: "543K",
    mood: "Chillwave",
    tracks: [
      { id: "cv-1", title: "Apex Orbit", artist: "Nova", duration: "3:48" },
      { id: "cv-2", title: "Low Tide", artist: "Sora", duration: "4:12" },
      { id: "cv-3", title: "Quartz", artist: "Boheme", duration: "2:59" },
    ],
  },
  {
    id: "sunset-drive",
    title: "Sunset Drive",
    description: "Feel-good indie pop for long drives under pastel skies.",
    artwork: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
    followers: "1.2M",
    mood: "Indie Pop",
    tracks: [
      { id: "sd-1", title: "Neon Coast", artist: "Harbor", duration: "3:05" },
      { id: "sd-2", title: "Passenger Seat", artist: "Lume", duration: "3:58" },
      { id: "sd-3", title: "Clementine", artist: "Atlas Youth", duration: "4:21" },
    ],
  },
  {
    id: "pulse-room",
    title: "Pulse Room",
    description: "High-energy electronic cuts to keep the heartbeat racing.",
    artwork: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800",
    followers: "789K",
    mood: "EDM",
    tracks: [
      { id: "pr-1", title: "Voltage", artist: "Skywave", duration: "2:57" },
      { id: "pr-2", title: "Ultralight", artist: "Kasai", duration: "3:36" },
      { id: "pr-3", title: "Glasshouse", artist: "Vanta", duration: "4:05" },
    ],
  },
  {
    id: "coffeehouse-corners",
    title: "Coffeehouse Corners",
    description: "Acoustic storytellers for cozy, rainy-day afternoons.",
    artwork: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
    followers: "312K",
    mood: "Acoustic",
    tracks: [
      { id: "cc-1", title: "Tender Lines", artist: "Maeve", duration: "3:11" },
      { id: "cc-2", title: "Chamomile", artist: "Habitat", duration: "4:19" },
      { id: "cc-3", title: "Storybook", artist: "Rivers", duration: "3:55" },
    ],
  },
  {
    id: "midnight-muse",
    title: "Midnight Muse",
    description: "Lo-fi textures and muted drums for study, sleep, or unwinding.",
    artwork: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600",
    followers: "2.4M",
    mood: "Lo-Fi",
    tracks: [
      { id: "mm-1", title: "Lamplight", artist: "Kana", duration: "2:31" },
      { id: "mm-2", title: "Ink & Paper", artist: "Soft Focus", duration: "3:02" },
      { id: "mm-3", title: "Across The Hall", artist: "Tapes", duration: "2:48" },
    ],
  },
];

export const getPlaylistById = (playlistId: string) =>
  playlists.find((playlist) => playlist.id === playlistId);
