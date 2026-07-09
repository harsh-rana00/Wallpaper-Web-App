// Pexels API Service for Wallpaper Web App

const LOCAL_STORAGE_KEY = 'PEXELS_API_KEY';

export const getApiKey = () => {
  return localStorage.getItem(LOCAL_STORAGE_KEY) || 'msDT6dvaWLbFkZoljiWOy7QiKh1bRUj78qLjjE4l1ohsbViuHkmnqOtl';
};

export const setApiKey = (key) => {
  if (key) {
    localStorage.setItem(LOCAL_STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
};

export const hasApiKey = () => {
  return !!getApiKey();
};

// Fallback Curated Wallpapers Database
// High-resolution premium images from Unsplash to use as mock data if API key is not present
const FALLBACK_WALLPAPERS = {
  portrait: [
    {
      id: 'f-p-1',
      width: 1080,
      height: 1920,
      url: 'https://unsplash.com/photos/abstract-painting-Y1rf7M7-S2A',
      photographer: 'Sven Brandsma',
      photographer_url: 'https://unsplash.com/@svenbrandsma',
      src: {
        large2x: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000&auto=format&fit=crop',
        original: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000&auto=format&fit=crop',
        portrait: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000&auto=format&fit=crop',
        medium: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop'
      },
      category: 'Abstract',
      avg_color: '#344e6c'
    },
    {
      id: 'f-p-2',
      width: 1080,
      height: 1920,
      url: 'https://unsplash.com/photos/cyberpunk-street-scene-T77_T_M8B8A',
      photographer: 'Carl Raw',
      photographer_url: 'https://unsplash.com/@karbon',
      src: {
        large2x: '/wallpapers/cyberpunk_city.png',
        original: '/wallpapers/cyberpunk_city.png',
        portrait: '/wallpapers/cyberpunk_city.png',
        medium: '/wallpapers/cyberpunk_city.png'
      },
      category: 'Cyberpunk',
      avg_color: '#1a102f'
    },
    {
      id: 'f-p-3',
      width: 1080,
      height: 1920,
      url: 'https://unsplash.com/photos/milky-way-galaxy-oMpwt14eeUM',
      photographer: 'Benjamin Voros',
      photographer_url: 'https://unsplash.com/@vorosbenis711',
      src: {
        large2x: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=1000&auto=format&fit=crop',
        original: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=1000&auto=format&fit=crop',
        portrait: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=1000&auto=format&fit=crop',
        medium: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=600&auto=format&fit=crop'
      },
      category: 'Space',
      avg_color: '#0b0c16'
    },
    {
      id: 'f-p-4',
      width: 1080,
      height: 1920,
      url: 'https://unsplash.com/photos/foggy-forest-i9FLJ1P1pFQ',
      photographer: 'Kalen Emsley',
      photographer_url: 'https://unsplash.com/@kalenemsley',
      src: {
        large2x: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=1000&auto=format&fit=crop',
        original: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=1000&auto=format&fit=crop',
        portrait: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=1000&auto=format&fit=crop',
        medium: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=600&auto=format&fit=crop'
      },
      category: 'Nature',
      avg_color: '#42574e'
    },
    {
      id: 'f-p-5',
      width: 1080,
      height: 1920,
      url: 'https://unsplash.com/photos/pink-and-purple-smoke-d1UP16J6X04',
      photographer: 'Joel Filipe',
      photographer_url: 'https://unsplash.com/@joelfilipe',
      src: {
        large2x: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
        original: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
        portrait: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
        medium: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop'
      },
      category: 'Minimalist',
      avg_color: '#d2afdb'
    },
    {
      id: 'f-p-6',
      width: 1080,
      height: 1920,
      url: 'https://unsplash.com/photos/city-streetlights-during-nighttime-8-a6b6jD9Yw',
      photographer: 'Zhu Hongzhi',
      photographer_url: 'https://unsplash.com/@zhuhongzhi',
      src: {
        large2x: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1000&auto=format&fit=crop',
        original: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1000&auto=format&fit=crop',
        portrait: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1000&auto=format&fit=crop',
        medium: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=600&auto=format&fit=crop'
      },
      category: 'City',
      avg_color: '#111827'
    },
    {
      id: 'f-p-7',
      width: 1080,
      height: 1920,
      url: 'https://unsplash.com/photos/vaporwave-sunset-art-H4aLp1d9sAw',
      photographer: 'Denis Forigo',
      photographer_url: 'https://unsplash.com/@denis_forigo',
      src: {
        large2x: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000&auto=format&fit=crop',
        original: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000&auto=format&fit=crop',
        portrait: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000&auto=format&fit=crop',
        medium: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop'
      },
      category: 'Anime',
      avg_color: '#5b1f63'
    },
    {
      id: 'f-p-8',
      width: 1080,
      height: 1920,
      url: 'https://unsplash.com/photos/starry-night-sky-yZ-Z-M8v1Aw',
      photographer: 'Ales Krivec',
      photographer_url: 'https://unsplash.com/@aleskrivec',
      src: {
        large2x: 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?q=80&w=1000&auto=format&fit=crop',
        original: 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?q=80&w=1000&auto=format&fit=crop',
        portrait: 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?q=80&w=1000&auto=format&fit=crop',
        medium: 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?q=80&w=600&auto=format&fit=crop'
      },
      category: 'Aesthetic',
      avg_color: '#0c0f1d'
    },
    {
      id: 'f-p-9',
      width: 1080,
      height: 1920,
      url: 'https://unsplash.com/photos/vaporwave-neon-palm-tree-yZ-Z-M8v1Aw',
      photographer: 'Steve Johnson',
      photographer_url: 'https://unsplash.com/@steve_j',
      src: {
        large2x: '/wallpapers/minimal_hills.png',
        original: '/wallpapers/minimal_hills.png',
        portrait: '/wallpapers/minimal_hills.png',
        medium: '/wallpapers/minimal_hills.png'
      },
      category: 'Aesthetic',
      avg_color: '#2e1245'
    },
    {
      id: 'f-p-10',
      width: 1080,
      height: 1920,
      url: 'https://unsplash.com/photos/milky-way-oMpwt14eeUM',
      photographer: 'Ales Krivec',
      photographer_url: 'https://unsplash.com/@aleskrivec',
      src: {
        large2x: '/wallpapers/cosmic_nebula.png',
        original: '/wallpapers/cosmic_nebula.png',
        portrait: '/wallpapers/cosmic_nebula.png',
        medium: '/wallpapers/cosmic_nebula.png'
      },
      category: 'Space',
      avg_color: '#080c18'
    },
    {
      id: 'f-p-11',
      width: 1080,
      height: 1920,
      url: 'https://unsplash.com/photos/minimalist-architecture-H4aLp1d9sAw',
      photographer: 'Simone Hutsch',
      photographer_url: 'https://unsplash.com/@heysimone',
      src: {
        large2x: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop',
        original: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop',
        portrait: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop',
        medium: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop'
      },
      category: 'Minimalist',
      avg_color: '#e5e5e5'
    },
    {
      id: 'f-p-12',
      width: 1080,
      height: 1920,
      url: 'https://unsplash.com/photos/green-mountain-near-body-of-water-yZ-Z-M8v1Aw',
      photographer: 'Bailey Zindel',
      photographer_url: 'https://unsplash.com/@baileyzindel',
      src: {
        large2x: '/wallpapers/crystal_cave.png',
        original: '/wallpapers/crystal_cave.png',
        portrait: '/wallpapers/crystal_cave.png',
        medium: '/wallpapers/crystal_cave.png'
      },
      category: 'Nature',
      avg_color: '#2e3a2e'
    }
  ],
  landscape: [
    {
      id: 'f-l-1',
      width: 1920,
      height: 1080,
      url: 'https://unsplash.com/photos/aerial-view-of-green-forest-g39p1k19w0A',
      photographer: 'Andreas Gucklhorn',
      photographer_url: 'https://unsplash.com/@drvondust',
      src: {
        large2x: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1600&auto=format&fit=crop',
        original: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2000&auto=format&fit=crop',
        landscape: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200&auto=format&fit=crop',
        medium: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop'
      },
      category: 'Nature',
      avg_color: '#344738'
    },
    {
      id: 'f-l-2',
      width: 1920,
      height: 1080,
      url: 'https://unsplash.com/photos/milky-way-above-snow-capped-mountain-i9FLJ1P1pFQ',
      photographer: 'Kalen Emsley',
      photographer_url: 'https://unsplash.com/@kalenemsley',
      src: {
        large2x: 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?q=80&w=1600&auto=format&fit=crop',
        original: 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?q=80&w=2000&auto=format&fit=crop',
        landscape: 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?q=80&w=1200&auto=format&fit=crop',
        medium: 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?q=80&w=800&auto=format&fit=crop'
      },
      category: 'Space',
      avg_color: '#13192f'
    },
    {
      id: 'f-l-3',
      width: 1920,
      height: 1080,
      url: 'https://unsplash.com/photos/pink-and-blue-abstract-art-d1UP16J6X04',
      photographer: 'Joel Filipe',
      photographer_url: 'https://unsplash.com/@joelfilipe',
      src: {
        large2x: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
        original: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop',
        landscape: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
        medium: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'
      },
      category: 'Abstract',
      avg_color: '#cb9fd5'
    },
    {
      id: 'f-l-4',
      width: 1920,
      height: 1080,
      url: 'https://unsplash.com/photos/cyberpunk-tokyo-street-scene-T77_T_M8B8A',
      photographer: 'Carl Raw',
      photographer_url: 'https://unsplash.com/@karbon',
      src: {
        large2x: '/wallpapers/cyberpunk_city.png',
        original: '/wallpapers/cyberpunk_city.png',
        landscape: '/wallpapers/cyberpunk_city.png',
        medium: '/wallpapers/cyberpunk_city.png'
      },
      category: 'Cyberpunk',
      avg_color: '#150621'
    },
    {
      id: 'f-l-5',
      width: 1920,
      height: 1080,
      url: 'https://unsplash.com/photos/black-and-gray-high-rise-building-T77_T_M8B8A',
      photographer: 'Sven Brandsma',
      photographer_url: 'https://unsplash.com/@svenbrandsma',
      src: {
        large2x: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop',
        original: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop',
        landscape: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
        medium: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop'
      },
      category: 'Minimalist',
      avg_color: '#2e2e38'
    },
    {
      id: 'f-l-6',
      width: 1920,
      height: 1080,
      url: 'https://unsplash.com/photos/cityscape-during-night-time-8-a6b6jD9Yw',
      photographer: 'Zhu Hongzhi',
      photographer_url: 'https://unsplash.com/@zhuhongzhi',
      src: {
        large2x: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1600&auto=format&fit=crop',
        original: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2000&auto=format&fit=crop',
        landscape: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1200&auto=format&fit=crop',
        medium: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=800&auto=format&fit=crop'
      },
      category: 'City',
      avg_color: '#0c0f18'
    },
    {
      id: 'f-l-7',
      width: 1920,
      height: 1080,
      url: 'https://unsplash.com/photos/tokyo-tower-at-nighttime-H4aLp1d9sAw',
      photographer: 'Alex Knight',
      photographer_url: 'https://unsplash.com/@alexknight',
      src: {
        large2x: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1600&auto=format&fit=crop',
        original: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=2000&auto=format&fit=crop',
        landscape: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
        medium: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop'
      },
      category: 'Aesthetic',
      avg_color: '#1a1926'
    },
    {
      id: 'f-l-8',
      width: 1920,
      height: 1080,
      url: 'https://unsplash.com/photos/vaporwave-neon-landscape-H4aLp1d9sAw',
      photographer: 'Denis Forigo',
      photographer_url: 'https://unsplash.com/@denis_forigo',
      src: {
        large2x: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1600&auto=format&fit=crop',
        original: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=2000&auto=format&fit=crop',
        landscape: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200&auto=format&fit=crop',
        medium: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop'
      },
      category: 'Anime',
      avg_color: '#491b5c'
    },
    {
      id: 'f-l-9',
      width: 1920,
      height: 1080,
      url: 'https://unsplash.com/photos/vaporwave-neon-tokyo-street-yZ-Z-M8v1Aw',
      photographer: 'Alex Knight',
      photographer_url: 'https://unsplash.com/@alexknight',
      src: {
        large2x: '/wallpapers/minimal_hills.png',
        original: '/wallpapers/minimal_hills.png',
        landscape: '/wallpapers/minimal_hills.png',
        medium: '/wallpapers/minimal_hills.png'
      },
      category: 'Aesthetic',
      avg_color: '#231238'
    },
    {
      id: 'f-l-10',
      width: 1920,
      height: 1080,
      url: 'https://unsplash.com/photos/nebula-galaxy-oMpwt14eeUM',
      photographer: 'Vincentiu Solomon',
      photographer_url: 'https://unsplash.com/@vincentiusolomon',
      src: {
        large2x: '/wallpapers/cosmic_nebula.png',
        original: '/wallpapers/cosmic_nebula.png',
        landscape: '/wallpapers/cosmic_nebula.png',
        medium: '/wallpapers/cosmic_nebula.png'
      },
      category: 'Space',
      avg_color: '#080816'
    },
    {
      id: 'f-l-11',
      width: 1920,
      height: 1080,
      url: 'https://unsplash.com/photos/minimalist-workspace-desk-H4aLp1d9sAw',
      photographer: 'Domenico Loia',
      photographer_url: 'https://unsplash.com/@domenicoloia',
      src: {
        large2x: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1600&auto=format&fit=crop',
        original: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2000&auto=format&fit=crop',
        landscape: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1200&auto=format&fit=crop',
        medium: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=800&auto=format&fit=crop'
      },
      category: 'Minimalist',
      avg_color: '#d4d4d8'
    },
    {
      id: 'f-l-12',
      width: 1920,
      height: 1080,
      url: 'https://unsplash.com/photos/nature-beach-ocean-sea-sunset-yZ-Z-M8v1Aw',
      photographer: 'Sean Oulashin',
      photographer_url: 'https://unsplash.com/@oulashin',
      src: {
        large2x: '/wallpapers/crystal_cave.png',
        original: '/wallpapers/crystal_cave.png',
        landscape: '/wallpapers/crystal_cave.png',
        medium: '/wallpapers/crystal_cave.png'
      },
      category: 'Nature',
      avg_color: '#d97706'
    }
  ]
};

const GENERATED_UNSPLASH_DATA = [
  { unsplashId: 'photo-1507525428034-b723cf961d3e', photographer: 'Sean Oulashin', username: 'seano', category: 'Nature', avgColor: '#1d3e56' },
  { unsplashId: 'photo-1447752875215-b2761acb3c5d', photographer: 'Charlotte Coneybeer', username: 'charlotteconeybeer', category: 'Forest', avgColor: '#3d4435' },
  { unsplashId: 'photo-1470071459604-3b5ec3a7fe05', photographer: 'Daniel Mirlea', username: 'dmirlea', category: 'Landscape', avgColor: '#32402c' },
  { unsplashId: 'photo-1501854140801-50d01698950b', photographer: 'Q.C. Studio', username: 'qcstudio', category: 'Mountains', avgColor: '#3a5441' },
  { unsplashId: 'photo-1441974231531-c6227db76b6e', photographer: 'Jay Mantri', username: 'jaymantri', category: 'Forest', avgColor: '#455928' },
  { unsplashId: 'photo-1523712999610-f77fbcfc3843', photographer: 'Bailey Zindel', username: 'baileyzindel', category: 'Nature', avgColor: '#2b3e4f' },
  { unsplashId: 'photo-1434725039720-abb26e552c93', photographer: 'Dan Otis', username: 'danotis', category: 'Landscape', avgColor: '#415231' },
  { unsplashId: 'photo-1472214222541-d510753a4907', photographer: 'Andreas Gücklhorn', username: 'polaroidmeister', category: 'Nature', avgColor: '#4d5939' },
  { unsplashId: 'photo-1506744038136-46273834b3fb', photographer: 'Ansel Adams', username: 'anseladams', category: 'Mountains', avgColor: '#2e4157' },
  { unsplashId: 'photo-1513836279014-a89f7a76ae86', photographer: 'Veeterzy', username: 'veeterzy', category: 'Forest', avgColor: '#3c4d32' },
  { unsplashId: 'photo-1502082553048-f009c37129b9', photographer: 'Sven Brandsma', username: 'svenbrandsma', category: 'Minimalist', avgColor: '#2d3319' },
  { unsplashId: 'photo-1448375240586-882707db888b', photographer: 'Sebastian Unrau', username: 'sebastian_unrau', category: 'Forest', avgColor: '#3a442e' },
  { unsplashId: 'photo-1518495973542-4542c06a5843', photographer: 'Ales Krivec', username: 'akrivec', category: 'Nature', avgColor: '#5c523d' },
  { unsplashId: 'photo-1473448912268-2022ce9509d8', photographer: 'Jeremy Thomas', username: 'jeremythomas', category: 'Forest', avgColor: '#583f2a' },
  { unsplashId: 'photo-1500627869374-13ad9960a116', photographer: 'Nathan Dumlao', username: 'nathandumlao', category: 'Floral', avgColor: '#2e5c46' },
  { unsplashId: 'photo-1469474968028-56623f02e42e', photographer: 'David Marcu', username: 'davidmarcu', category: 'Landscape', avgColor: '#4f553c' },
  { unsplashId: 'photo-1511497584788-876760111969', photographer: 'Lukasz Szmigiel', username: 'szmigieldesign', category: 'Forest', avgColor: '#414f36' },
  { unsplashId: 'photo-1505761671935-60b3a7424954', photographer: 'Luke Stackpoole', username: 'lpcs', category: 'City', avgColor: '#0a0d17' },
  { unsplashId: 'photo-1486406146926-c627a92ad1ab', photographer: 'Ryunosuke Kikuno', username: 'ryunosuke_kikuno', category: 'Architecture', avgColor: '#1d273a' },
  { unsplashId: 'photo-1496568818309-53d7f75e74c3', photographer: 'Jezael Melgoza', username: 'jezael', category: 'Cyberpunk', avgColor: '#100a1a' },
  { unsplashId: 'photo-1504608524841-42fe6f032b4b', photographer: 'Claudio Testa', username: 'claudiotesta', category: 'Space', avgColor: '#030208' },
  { unsplashId: 'photo-1462331940025-496dfbfc7564', photographer: 'NASA', username: 'nasa', category: 'Space', avgColor: '#1b0e2d' },
  { unsplashId: 'photo-1518770660439-4636190af475', photographer: 'Alexandre Debiève', username: 'alexandre_debieve', category: 'Cyber', avgColor: '#0a1a2b' },
  { unsplashId: 'photo-1451187580459-43490279c0fa', photographer: 'Manuel Cosentino', username: 'manuelcosentino', category: 'Abstract', avgColor: '#0e2b4f' },
  { unsplashId: 'photo-1531297484001-80022131f5a1', photographer: 'Jannis Lucas', username: 'jannislucas', category: 'Futuristic', avgColor: '#181d26' },
  { unsplashId: 'photo-1516321318423-f06f85e504b3', photographer: 'Fakurian Design', username: 'fakurian', category: 'Aesthetic', avgColor: '#1e0c2f' },
  { unsplashId: 'photo-1506318137071-a8e063b4bec0', photographer: 'Astro', username: 'astro', category: 'Cosmic', avgColor: '#080512' },
  { unsplashId: 'photo-1483728642387-6c3bdd6c93e5', photographer: 'Dino Reichmuth', username: 'dinoreichmuth', category: 'Mountains', avgColor: '#3d4b5a' },
  { unsplashId: 'photo-1501785888041-af3ef285b470', photographer: 'Henrique M.', username: 'henrique_m', category: 'Water', avgColor: '#2b4d5a' },
  { unsplashId: 'photo-1480714378408-67cf0d13bc1b', photographer: 'Lerone Pieters', username: 'neilson', category: 'Urban', avgColor: '#1c2838' },
  { unsplashId: 'photo-1526080652727-5b77f74eacd2', photographer: 'Keith Hardy', username: 'keithhardy', category: 'Desert', avgColor: '#5c4832' },
  { unsplashId: 'photo-1509042239860-f550ce710b93', photographer: 'David Clode', username: 'davidclode', category: 'Floral', avgColor: '#5c223c' },
  { unsplashId: 'photo-1518837695005-2083093ee35b', photographer: 'Sasha Slobodiana', username: 'sashaslobodiana', category: 'Ocean', avgColor: '#2e4c5b' },
  { unsplashId: 'photo-1504384308090-c894fdcc538d', photographer: 'Caspar Camille Rubin', username: 'casparrubin', category: 'Sci-Fi', avgColor: '#1a222f' },
  { unsplashId: 'photo-1506187396773-75c7c244b23e', photographer: 'Lars van de Goor', username: 'larsvandegoor', category: 'Forest', avgColor: '#2e3a24' },
  { unsplashId: 'photo-1518098268026-4e66a1a9c2e4', photographer: 'Paweł Czerwiński', username: 'pawel_czerwinski', category: 'Abstract', avgColor: '#4f3c5b' },
  { unsplashId: 'photo-1509198397868-475647b2a1e5', photographer: 'Vincentiu Solomon', username: 'vincentiusolomon', category: 'Galactic', avgColor: '#0b0c1b' },
  { unsplashId: 'photo-1454789548928-9efd52dc4031', photographer: 'NASA Hubble', username: 'hubble', category: 'Cosmic', avgColor: '#100a20' }
];

GENERATED_UNSPLASH_DATA.forEach((item, index) => {
  const num = index + 13;
  
  FALLBACK_WALLPAPERS.portrait.push({
    id: `f-p-${num}`,
    width: 1080,
    height: 1920,
    url: `https://unsplash.com/photos/${item.unsplashId}`,
    photographer: item.photographer,
    photographer_url: `https://unsplash.com/@${item.username}`,
    src: {
      large2x: `https://images.unsplash.com/photo-${item.unsplashId.replace('photo-', '')}?q=80&w=1000&auto=format&fit=crop&ar=9:16`,
      original: `https://images.unsplash.com/photo-${item.unsplashId.replace('photo-', '')}?q=80&w=1440&auto=format&fit=crop&ar=9:16`,
      portrait: `https://images.unsplash.com/photo-${item.unsplashId.replace('photo-', '')}?q=80&w=1080&auto=format&fit=crop&ar=9:16`,
      medium: `https://images.unsplash.com/photo-${item.unsplashId.replace('photo-', '')}?q=80&w=600&auto=format&fit=crop&ar=9:16`
    },
    category: item.category,
    avg_color: item.avgColor
  });

  FALLBACK_WALLPAPERS.landscape.push({
    id: `f-l-${num}`,
    width: 1920,
    height: 1080,
    url: `https://unsplash.com/photos/${item.unsplashId}`,
    photographer: item.photographer,
    photographer_url: `https://unsplash.com/@${item.username}`,
    src: {
      large2x: `https://images.unsplash.com/photo-${item.unsplashId.replace('photo-', '')}?q=80&w=1200&auto=format&fit=crop&ar=16:10`,
      original: `https://images.unsplash.com/photo-${item.unsplashId.replace('photo-', '')}?q=80&w=1920&auto=format&fit=crop&ar=16:10`,
      portrait: `https://images.unsplash.com/photo-${item.unsplashId.replace('photo-', '')}?q=80&w=1000&auto=format&fit=crop&ar=16:10`,
      medium: `https://images.unsplash.com/photo-${item.unsplashId.replace('photo-', '')}?q=80&w=600&auto=format&fit=crop&ar=16:10`
    },
    category: item.category,
    avg_color: item.avgColor
  });
});

// Base Fetch Function
async function fetchFromPexels(endpoint, params = {}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API_KEY_MISSING');
  }

  const urlParams = new URLSearchParams(params);
  const response = await fetch(`https://api.pexels.com/v1/${endpoint}?${urlParams.toString()}`, {
    headers: {
      Authorization: apiKey
    }
  });

  if (response.status === 401) {
    throw new Error('API_KEY_INVALID');
  }

  if (!response.ok) {
    throw new Error(`API_ERROR_${response.status}`);
  }

  return await response.json();
}

let currentSessionPageOffset = 1;

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getRecentlyShown() {
  try {
    return JSON.parse(sessionStorage.getItem('aero_recently_shown') || '[]');
  } catch {
    return [];
  }
}

function addRecentlyShown(ids) {
  try {
    let current = getRecentlyShown();
    current = [...new Set([...ids, ...current])].slice(0, 60);
    sessionStorage.setItem('aero_recently_shown', JSON.stringify(current));
  } catch (e) {
    console.error(e);
  }
}

function processAndDeduplicatePhotos(photos) {
  if (!photos || photos.length === 0) return [];
  
  const recentlyShown = getRecentlyShown();
  const fresh = [];
  const old = [];
  
  photos.forEach(photo => {
    if (recentlyShown.includes(String(photo.id))) {
      old.push(photo);
    } else {
      fresh.push(photo);
    }
  });

  const shuffledFresh = shuffleArray(fresh);
  const shuffledOld = shuffleArray(old);
  const finalPhotos = [...shuffledFresh, ...shuffledOld];
  
  // Record these photo IDs as recently shown
  const newIds = finalPhotos.map(p => String(p.id));
  addRecentlyShown(newIds);
  
  return finalPhotos;
}

/**
 * Fetch wallpapers (Pexels fetch with local fallback)
 * @param {string} query Search query (optional)
 * @param {string} orientation 'portrait' or 'landscape'
 * @param {number} page Page number
 * @returns {Promise<{photos: Array, isFallback: boolean, total_results: number}>}
 */
export async function getWallpapers({ query = '', orientation = 'landscape', page = 1 } = {}) {
  const perPage = 52;
  const isSearch = !!query;

  // Set the random page offset on the first page load
  if (page === 1) {
    if (!isSearch) {
      // Pick a random page between 1 and 20 for curated feed
      currentSessionPageOffset = Math.floor(Math.random() * 20) + 1;
    } else {
      currentSessionPageOffset = 1;
    }
  }

  const pageToRequest = currentSessionPageOffset + (page - 1);

  try {
    let data;
    if (isSearch) {
      data = await fetchFromPexels('search', {
        query,
        orientation,
        page: pageToRequest,
        per_page: perPage
      });
    } else {
      data = await fetchFromPexels('curated', {
        orientation,
        page: pageToRequest,
        per_page: perPage
      });
    }

    const rawPhotos = data.photos || [];
    const processedPhotos = processAndDeduplicatePhotos(rawPhotos);

    return {
      photos: processedPhotos,
      total_results: data.total_results || 0,
      isFallback: false
    };

  } catch (error) {
    console.warn('Pexels API Error, falling back to local curated data:', error.message);
    
    // Simulate API pagination using fallback local wallpapers
    const type = orientation === 'portrait' ? 'portrait' : 'landscape';
    let sourceList = FALLBACK_WALLPAPERS[type];

    // Filter by query if applicable
    if (query) {
      const q = query.toLowerCase();
      sourceList = sourceList.filter(p => 
        p.category.toLowerCase().includes(q) || 
        p.photographer.toLowerCase().includes(q)
      );
    }

    // Paginate local results
    const startIndex = (pageToRequest - 1) * perPage;
    const paginatedPhotos = sourceList.slice(startIndex, startIndex + perPage);
    const processedPhotos = processAndDeduplicatePhotos(paginatedPhotos);

    return {
      photos: processedPhotos,
      total_results: sourceList.length,
      isFallback: true,
      errorType: error.message
    };
  }
}
