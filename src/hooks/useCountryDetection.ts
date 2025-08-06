import { useState, useEffect } from 'react';
import type { UserLocation } from '@/types/game';

// Fallback to a default country if detection fails
const DEFAULT_LOCATION: UserLocation = {
  country_code: 'US',
  country_name: 'United States'
};

export function useCountryDetection() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function detectCountry() {
      try {
        setIsLoading(true);
        setError(null);

        // Try multiple IP detection services
        const services = [
          'https://ipapi.co/json/',
          'https://ip-api.com/json/',
          'https://ipinfo.io/json'
        ];

        let detectedLocation: UserLocation | null = null;

        for (const service of services) {
          try {
            const response = await fetch(service);
            const data = await response.json();
            
            let countryCode: string;
            let countryName: string;

            // Handle different API response formats
            if (data.country_code) {
              countryCode = data.country_code;
              countryName = data.country_name || data.country || countryCode;
            } else if (data.countryCode) {
              countryCode = data.countryCode;
              countryName = data.country || countryCode;
            } else if (data.country) {
              countryCode = data.country;
              countryName = data.country_name || countryCode;
            } else {
              continue; // Try next service
            }

            detectedLocation = {
              country_code: countryCode.toUpperCase(),
              country_name: countryName,
              latitude: data.latitude || data.lat,
              longitude: data.longitude || data.lon || data.lng
            };
            break; // Success, stop trying other services
          } catch (serviceError) {
            console.warn(`Country detection service failed:`, service, serviceError);
            continue; // Try next service
          }
        }

        if (!detectedLocation) {
          console.warn('All country detection services failed, using default location');
          detectedLocation = DEFAULT_LOCATION;
        }

        setUserLocation(detectedLocation);
      } catch (err) {
        console.error('Country detection failed:', err);
        setError('Failed to detect country');
        setUserLocation(DEFAULT_LOCATION);
      } finally {
        setIsLoading(false);
      }
    }

    detectCountry();
  }, []);

  return { userLocation, isLoading, error };
}