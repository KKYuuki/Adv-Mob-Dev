export interface Song {
  id: string;
  title: string;
  duration: string;
  album?: string;
  year?: string;
}

export interface Artist {
  id: string;
  name: string;
  profileImage: string;
  songs: Song[];
}

export const artists: Artist[] = [
  {
    id: "1",
    name: "The Weeknd",
    profileImage: "Spotify/assets/artist/Weeknd.png",
    songs: [
      { id: "song1", title: "Blinding Lights", duration: "3:20", album: "After Hours", year: "2020" },
      { id: "song2", title: "Save Your Tears", duration: "3:35", album: "After Hours", year: "2020" },
      { id: "song3", title: "Starboy", duration: "3:50", album: "Starboy", year: "2016" },
      { id: "song4", title: "Can't Feel My Face", duration: "3:34", album: "Beauty Behind the Madness", year: "2015" },
    ]
  },
  {
    id: "2", 
    name: "Dua Lipa",
    profileImage: "Spotify/assets/artist/Dua.png",
    songs: [
      { id: "song5", title: "Levitating", duration: "3:23", album: "Future Nostalgia", year: "2020" },
      { id: "song6", title: "Don't Start Now", duration: "3:01", album: "Future Nostalgia", year: "2020" },
      { id: "song7", title: "Physical", duration: "3:13", album: "Future Nostalgia", year: "2020" },
      { id: "song8", title: "New Rules", duration: "3:29", album: "Dua Lipa", year: "2017" },
    ]
  },
  {
    id: "3",
    name: "Olivia Rodrigo",
    profileImage: "Spotify/assets/artist/Olivia.jpg",
    songs: [
      { id: "song9", title: "Good 4 U", duration: "2:58", album: "SOUR", year: "2021" },
      { id: "song10", title: "drivers license", duration: "4:02", album: "SOUR", year: "2021" },
      { id: "song11", title: "deja vu", duration: "3:35", album: "SOUR", year: "2021" },
      { id: "song12", title: "brutal", duration: "2:23", album: "SOUR", year: "2021" },
    ]
  },
  {
    id: "4",
    name: "The Kid LAROI",
    profileImage: "Spotify/assets/artist/LAROI.jpg",
    songs: [
      { id: "song13", title: "Stay", duration: "2:21", album: "Stay", year: "2021" },
      { id: "song14", title: "WITHOUT YOU", duration: "2:35", album: "F*CK LOVE 3", year: "2021" },
      { id: "song15", title: "SO DONE", duration: "2:44", album: "F*CK LOVE 3", year: "2021" },
    ]
  },
  {
    id: "5",
    name: "Justin Bieber",
    profileImage: "Spotify/assets/artist/Justin.jpeg",
    songs: [
      { id: "song16", title: "Peaches", duration: "3:18", album: "Justice", year: "2021" },
      { id: "song17", title: "Sorry", duration: "3:20", album: "Purpose", year: "2015" },
      { id: "song18", title: "Love Yourself", duration: "3:53", album: "Purpose", year: "2015" },
      { id: "song19", title: "What Do You Mean?", duration: "3:26", album: "Purpose", year: "2015" },
    ]
  },
  {
    id: "6",
    name: "Taylor Swift",
    profileImage: "Spotify/assets/artist/Taylor.jpg",
    songs: [
      { id: "song20", title: "Anti-Hero", duration: "3:20", album: "Midnights", year: "2022" },
      { id: "song21", title: "Shake It Off", duration: "3:39", album: "1989", year: "2014" },
      { id: "song22", title: "Blank Space", duration: "3:51", album: "1989", year: "2014" },
      { id: "song23", title: "Lavender Haze", duration: "3:22", album: "Midnights", year: "2022" },
    ]
  },
  {
    id: "7",
    name: "Drake",
    profileImage: "Spotify/assets/artist/Drake.jpg",
    songs: [
      { id: "song24", title: "God's Plan", duration: "3:18", album: "Scorpion", year: "2018" },
      { id: "song25", title: "Hotline Bling", duration: "4:27", album: "Views", year: "2016" },
      { id: "song26", title: "One Dance", duration: "2:54", album: "Views", year: "2016" },
      { id: "song27", title: "In My Feelings", duration: "3:37", album: "Scorpion", year: "2018" },
    ]
  },
  {
    id: "8",
    name: "Billie Eilish",
    profileImage: "Spotify/assets/artist/Billie.jpg",
    songs: [
      { id: "song28", title: "bad guy", duration: "3:14", album: "When We All Fall Asleep, Where Do We Go?", year: "2019" },
      { id: "song29", title: "everything i wanted", duration: "4:03", album: "When We All Fall Asleep, Where Do We Go?", year: "2019" },
      { id: "song30", title: "ocean eyes", duration: "3:20", album: "Don't Smile at Me", year: "2017" },
      { id: "song31", title: "lovely", duration: "3:20", album: "lovely", year: "2018" },
    ]
  }
];

// Helper functions to work with artists data
export const getArtistById = (id: string): Artist | undefined => {
  return artists.find(artist => artist.id === id);
};

export const getAllArtists = (): Artist[] => {
  return artists;
};

export const getSongsByArtistId = (artistId: string): Song[] => {
  const artist = getArtistById(artistId);
  return artist ? artist.songs : [];
};

export const searchArtists = (query: string): Artist[] => {
  return artists.filter(artist => 
    artist.name.toLowerCase().includes(query.toLowerCase())
  );
};
