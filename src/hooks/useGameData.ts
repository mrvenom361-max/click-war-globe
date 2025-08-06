import { useState, useEffect, useCallback } from 'react';
import { gameApi } from '@/lib/supabase';
import type { Country } from '@/types/game';
import { useToast } from '@/hooks/use-toast';

export function useGameData() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCountries = useCallback(async () => {
    try {
      setError(null);
      const data = await gameApi.getCountries();
      setCountries(data);
    } catch (err) {
      console.error('Failed to fetch countries:', err);
      setError('Failed to load game data');
      toast({
        title: "Connection Error",
        description: "Failed to load game data. Please check your connection.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const clickForCountry = useCallback(async (countryCode: string, countryName: string) => {
    try {
      const updatedCountry = await gameApi.clickForCountry(countryCode, countryName);
      
      // Update local state optimistically
      setCountries(prev => {
        const existing = prev.find(c => c.country_code === countryCode);
        if (existing) {
          return prev.map(c => 
            c.country_code === countryCode 
              ? { ...c, score: updatedCountry.score }
              : c
          );
        } else {
          return [...prev, updatedCountry].sort((a, b) => b.score - a.score);
        }
      });

      return updatedCountry;
    } catch (err) {
      console.error('Failed to click for country:', err);
      toast({
        title: "Click Failed",
        description: "Failed to register your click. Please try again.",
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  useEffect(() => {
    fetchCountries();

    // Subscribe to realtime updates
    const unsubscribe = gameApi.subscribeToCountries((updatedCountries) => {
      setCountries(updatedCountries);
    });

    return unsubscribe;
  }, [fetchCountries]);

  const topCountries = countries.slice(0, 10);
  const totalClicks = countries.reduce((sum, country) => sum + country.score, 0);
  const maxScore = countries.length > 0 ? Math.max(...countries.map(c => c.score)) : 0;

  return {
    countries,
    topCountries,
    totalClicks,
    maxScore,
    isLoading,
    error,
    clickForCountry,
    refetch: fetchCountries
  };
}