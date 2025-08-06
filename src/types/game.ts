export interface Country {
  id?: number;
  country_code: string;
  country_name: string;
  score: number;
  last_reset_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserLocation {
  country_code: string;
  country_name: string;
  latitude?: number;
  longitude?: number;
}

export interface GameStats {
  totalClicks: number;
  userCountryRank: number;
  totalCountries: number;
  timeToReset: string;
}