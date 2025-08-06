import type { Country } from "@/types/game";

// Mock data for demonstration - will use real Supabase once connected
const mockCountries: Country[] = [
  { country_code: 'US', country_name: 'United States', score: 15420 },
  { country_code: 'CN', country_name: 'China', score: 12890 },
  { country_code: 'IN', country_name: 'India', score: 9560 },
  { country_code: 'BR', country_name: 'Brazil', score: 7320 },
  { country_code: 'RU', country_name: 'Russia', score: 6780 },
  { country_code: 'JP', country_name: 'Japan', score: 5430 },
  { country_code: 'DE', country_name: 'Germany', score: 4210 },
  { country_code: 'GB', country_name: 'United Kingdom', score: 3890 },
  { country_code: 'FR', country_name: 'France', score: 3560 },
  { country_code: 'CA', country_name: 'Canada', score: 2980 }
];

export const gameApi = {
  async getCountries(): Promise<Country[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockCountries].sort((a, b) => b.score - a.score);
  },

  async getTopCountries(limit = 10): Promise<Country[]> {
    const countries = await this.getCountries();
    return countries.slice(0, limit);
  },

  async clickForCountry(countryCode: string, countryName: string): Promise<Country> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const existing = mockCountries.find(c => c.country_code === countryCode);
    if (existing) {
      existing.score += 1;
      return existing;
    } else {
      const newCountry = { country_code: countryCode, country_name: countryName, score: 1 };
      mockCountries.push(newCountry);
      return newCountry;
    }
  },

  subscribeToCountries(callback: (countries: Country[]) => void) {
    // For now, just return a no-op cleanup function
    // Real implementation will use Supabase realtime
    return () => {};
  }
};