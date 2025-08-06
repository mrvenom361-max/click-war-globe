import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Country } from '@/types/game';
import { getCountryColorClass } from '@/lib/country-codes';

// Fix for default markers in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface WorldMapProps {
  countries: Country[];
  userCountryCode: string;
  maxScore: number;
}

export function WorldMap({ countries, userCountryCode, maxScore }: WorldMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 1,
      maxZoom: 6,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      dragging: true,
    });

    // Add OpenStreetMap tiles with dark theme
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors, © CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map.current);

    // Create markers layer
    markersLayer.current = L.layerGroup().addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !markersLayer.current) return;

    // Clear existing markers
    markersLayer.current.clearLayers();

    // Country coordinates (approximate centers)
    const countryCoords: Record<string, [number, number]> = {
      'US': [39.8283, -98.5795],
      'CN': [35.8617, 104.1954],
      'IN': [20.5937, 78.9629],
      'BR': [-14.2350, -51.9253],
      'RU': [61.5240, 105.3188],
      'JP': [36.2048, 138.2529],
      'DE': [51.1657, 10.4515],
      'GB': [55.3781, -3.4360],
      'FR': [46.6034, 1.8883],
      'IT': [41.8719, 12.5674],
      'CA': [56.1304, -106.3468],
      'AU': [-25.2744, 133.7751],
      'ES': [40.4637, -3.7492],
      'MX': [23.6345, -102.5528],
      'KR': [35.9078, 127.7669],
      'NL': [52.1326, 5.2913],
      'SE': [60.1282, 18.6435],
      'PL': [51.9194, 19.1451],
      'TR': [38.9637, 35.2433],
      'SA': [23.8859, 45.0792],
      'ZA': [-30.5595, 22.9375],
      'AR': [-38.4161, -63.6167],
      'EG': [26.0975, 30.0444],
      'TH': [15.8700, 100.9925],
      'ID': [-0.7893, 113.9213],
      'NG': [9.0820, 8.6753],
      'BD': [23.6850, 90.3563],
      'VN': [14.0583, 108.2772],
      'PH': [12.8797, 121.7740],
      'PK': [30.3753, 69.3451],
      'MY': [4.2105, 101.9758],
      'UZ': [41.3775, 64.5853],
      'AF': [33.9391, 67.7100],
      'PE': [-9.1900, -75.0152],
      'UY': [-32.5228, -55.7658],
      'NP': [28.3949, 84.1240],
      'YE': [15.5527, 48.5164],
      'VE': [6.4238, -66.5897],
      'MG': [-18.7669, 46.8691],
      'UG': [1.3733, 32.2903],
      'IR': [32.4279, 53.6880],
      'KZ': [48.0196, 66.9237],
      'SO': [5.1521, 46.1996],
      'BF': [12.2383, -1.5616],
      'ML': [17.5707, -3.9962],
      'MW': [-13.2543, 34.3015],
      'ZM': [-13.1339, 27.8493],
      'GT': [15.7835, -90.2308],
      'ZW': [-19.0154, 29.1549],
      'NE': [17.6078, 8.0817],
      'LK': [7.8731, 80.7718],
      'KH': [12.5657, 104.9910],
      'JO': [30.5852, 36.2384],
      'AZ': [40.1431, 47.5769],
      'AT': [47.5162, 14.5501],
      'BY': [53.7098, 27.9534],
      'TJ': [38.8610, 71.2761],
      'HU': [47.1625, 19.5033],
      'AE': [23.4241, 53.8478],
      'HN': [15.2000, -86.2419],
      'BJ': [9.3077, 2.3158],
      'BW': [-22.3285, 24.6849],
      'TG': [8.6195, 0.8248],
      'CH': [46.8182, 8.2275],
      'SL': [8.4606, -11.7799],
      'LY': [26.3351, 17.2283],
      'LR': [6.4281, -9.4295],
      'CF': [6.6111, 20.9394],
      'MR': [21.0079, -10.9408],
      'PA': [8.5380, -80.7821],
      'CU': [21.5218, -77.7812],
      'OM': [21.4735, 55.9754],
      'BG': [42.7339, 25.4858],
      'GY': [4.8604, -58.9302],
      'LB': [33.8547, 35.8623],
      'SI': [46.1512, 14.9955],
      'MK': [41.6086, 21.7453],
      'KW': [29.3117, 47.4818],
      'LS': [-29.6100, 28.2336],
      'BT': [27.5142, 90.4336],
      'GM': [13.4432, -15.3101],
      'QA': [25.3548, 51.1839],
      'BH': [25.9304, 50.6378],
      'EE': [58.5953, 25.0136],
      'TT': [10.6918, -61.2225],
      'KM': [-11.6455, 43.3333],
      'CY': [35.1264, 33.4299],
      'FJ': [-16.7784, 179.4144],
      'QR': [25.3548, 51.1839],
      'BN': [4.5353, 114.7277],
      'MV': [3.2028, 73.2207],
      'MT': [35.9375, 14.3754],
      'IS': [64.9631, -19.0208],
      'BB': [13.1939, -59.5432],
      'VC': [12.9843, -61.2872],
      'ST': [0.1864, 6.6131],
      'LC': [13.9094, -60.9789],
      'GD': [12.2628, -61.6043],
      'KI': [-3.3704, -168.7340],
      'FM': [7.4256, 150.5508],
      'TO': [-21.1789, -175.1982],
      'DM': [15.4140, -61.3710],
      'AG': [17.0608, -61.7964],
      'SC': [-4.6796, 55.4920],
      'AD': [42.5462, 1.6016],
      'KN': [17.3578, -62.7830],
      'MC': [43.7384, 7.4246],
      'LI': [47.1660, 9.5554],
      'SM': [43.9424, 12.4578],
      'TV': [-7.1095, 177.6493],
      'NR': [-0.5228, 166.9315],
      'VA': [41.9029, 12.4534]
    };

    // Add markers for countries with scores
    countries.forEach(country => {
      const coords = countryCoords[country.country_code];
      if (!coords) return;

      const isUserCountry = country.country_code === userCountryCode;
      const colorClass = getCountryColorClass(country.score, maxScore);
      
      // Create custom icon based on score
      const radius = Math.max(8, Math.min(30, 8 + (country.score / Math.max(maxScore, 1)) * 22));
      const color = isUserCountry ? '#22c55e' : country.score === 0 ? '#64748b' : 
                    country.score >= maxScore * 0.8 ? '#ef4444' :
                    country.score >= maxScore * 0.6 ? '#f97316' :
                    country.score >= maxScore * 0.3 ? '#eab308' : '#22c55e';

      const marker = L.circleMarker(coords, {
        radius: radius,
        fillColor: color,
        color: isUserCountry ? '#ffffff' : color,
        weight: isUserCountry ? 3 : 1,
        opacity: 1,
        fillOpacity: 0.8,
        className: isUserCountry ? 'pulse-glow' : ''
      });

      // Add popup with country info
      marker.bindPopup(`
        <div class="text-center">
          <div class="font-bold text-lg ${isUserCountry ? 'text-green-600' : ''}">${country.country_name}</div>
          <div class="text-sm text-gray-600">${country.country_code}</div>
          <div class="text-xl font-bold mt-2">${country.score.toLocaleString()}</div>
          <div class="text-sm">clicks</div>
          ${isUserCountry ? '<div class="text-green-600 font-semibold mt-1">Your Country!</div>' : ''}
        </div>
      `);

      marker.addTo(markersLayer.current!);
    });

  }, [countries, userCountryCode, maxScore]);

  return (
    <div className="relative flex-1 h-full min-h-0">
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-lg border border-border"
        style={{ minHeight: '400px' }}
      />
      <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm p-3 rounded-lg border border-border">
        <div className="text-sm font-medium mb-2">Score Legend</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-war-red"></div>
            <span>High Activity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-war-orange"></div>
            <span>Medium-High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-war-yellow"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-war-green"></div>
            <span>Low Activity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted"></div>
            <span>No Activity</span>
          </div>
        </div>
      </div>
    </div>
  );
}