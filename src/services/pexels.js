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

/**
 * Fetch wallpapers (Pexels fetch with local fallback)
 * @param {string} query Search query (optional)
 * @param {string} orientation 'portrait' or 'landscape'
 * @param {number} page Page number
 * @returns {Promise<{photos: Array, isFallback: boolean, total_results: number}>}
 */
export async function getWallpapers({ query = '', orientation = 'landscape', page = 1 } = {}) {
  const perPage = 32;
  const isSearch = !!query;

  try {
    let data;
    if (isSearch) {
      data = await fetchFromPexels('search', {
        query,
        orientation,
        page,
        per_page: perPage
      });
    } else {
      data = await fetchFromPexels('curated', {
        orientation,
        page,
        per_page: perPage
      });
    }

    return {
      photos: data.photos || [],
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
    const startIndex = (page - 1) * perPage;
    const paginatedPhotos = sourceList.slice(startIndex, startIndex + perPage);

    return {
      photos: paginatedPhotos,
      total_results: sourceList.length,
      isFallback: true,
      errorType: error.message // 'API_KEY_MISSING' or 'API_KEY_INVALID' etc
    };
  }
}
