import { useState } from 'react';
import { Trophy, Medal, Award, ChevronRight, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { Country } from '@/types/game';

interface LeaderboardProps {
  countries: Country[];
  userCountryCode: string;
  totalClicks: number;
}

export function Leaderboard({ countries, userCountryCode, totalClicks }: LeaderboardProps) {
  const [isOpen, setIsOpen] = useState(true);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-war-yellow" />;
      case 2:
        return <Medal className="w-5 h-5 text-muted-foreground" />;
      case 3:
        return <Award className="w-5 h-5 text-war-orange" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">{rank}</span>;
    }
  };

  const userCountryRank = countries.findIndex(c => c.country_code === userCountryCode) + 1;

  return (
    <Card className="w-full lg:w-80">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Leaderboard
              </div>
              <Button variant="ghost" size="sm">
                {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-2">
            <div className="text-center mb-4 p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{totalClicks.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Global Clicks</div>
              {userCountryRank > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  Your country: #{userCountryRank}
                </div>
              )}
            </div>

            <div className="space-y-1 max-h-96 overflow-y-auto scrollbar-hidden">
              {countries.slice(0, 10).map((country, index) => {
                const rank = index + 1;
                const isUserCountry = country.country_code === userCountryCode;
                
                return (
                  <div
                    key={country.country_code}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                      isUserCountry 
                        ? 'bg-primary/20 border border-primary/30 pulse-glow' 
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {getRankIcon(rank)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium truncate ${isUserCountry ? 'text-primary font-bold' : ''}`}>
                        {country.country_name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {country.country_code}
                      </div>
                    </div>
                    
                    <div className={`text-right font-mono ${isUserCountry ? 'text-primary font-bold' : ''}`}>
                      <div className="font-semibold">
                        {country.score.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        clicks
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {countries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No scores yet!</p>
                <p className="text-sm">Be the first to click!</p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}