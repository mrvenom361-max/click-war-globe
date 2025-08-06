import { useCountryDetection } from '@/hooks/useCountryDetection';
import { useGameData } from '@/hooks/useGameData';
import { GameHeader } from '@/components/GameHeader';
import { WorldMap } from '@/components/WorldMap';
import { Leaderboard } from '@/components/Leaderboard';
import { ClickButton } from '@/components/ClickButton';
import { ActionBar } from '@/components/ActionBar';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const Index = () => {
  const { userLocation, isLoading: locationLoading, error: locationError } = useCountryDetection();
  const { 
    countries, 
    topCountries, 
    totalClicks, 
    maxScore, 
    isLoading: dataLoading, 
    error: dataError, 
    clickForCountry 
  } = useGameData();

  const handleClick = async (countryCode: string, countryName: string) => {
    await clickForCountry(countryCode, countryName);
  };

  if (locationLoading || dataLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <div className="text-lg font-medium">Loading Global Click War...</div>
          <div className="text-sm text-muted-foreground">
            {locationLoading ? 'Detecting your location...' : 'Loading game data...'}
          </div>
        </div>
      </div>
    );
  }

  if (locationError || dataError) {
    return (
      <div className="h-screen flex items-center justify-center bg-background p-4">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {locationError || dataError}
            <br />
            <span className="text-xs text-muted-foreground mt-2 block">
              Please check your internet connection and try refreshing the page.
            </span>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <GameHeader />
      
      <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4 min-h-0">
        {/* Map Section */}
        <div className="flex-1 flex flex-col min-h-0">
          <WorldMap 
            countries={countries}
            userCountryCode={userLocation?.country_code || ''}
            maxScore={maxScore}
          />
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          <Leaderboard 
            countries={topCountries}
            userCountryCode={userLocation?.country_code || ''}
            totalClicks={totalClicks}
          />
        </div>
      </main>

      {/* Bottom Action Area */}
      <footer className="border-t border-border bg-card/50 p-4">
        <div className="container mx-auto max-w-4xl space-y-6">
          <ClickButton
            userLocation={userLocation}
            onClick={handleClick}
          />
          
          <ActionBar 
            userCountryName={userLocation?.country_name || 'Your Country'}
          />
        </div>
      </footer>
    </div>
  );
};

export default Index;