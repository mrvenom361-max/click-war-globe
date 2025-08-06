import { useState } from 'react';
import { MousePointer, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UserLocation } from '@/types/game';

interface ClickButtonProps {
  userLocation: UserLocation | null;
  onClick: (countryCode: string, countryName: string) => Promise<void>;
  disabled?: boolean;
}

export function ClickButton({ userLocation, onClick, disabled }: ClickButtonProps) {
  const [isClicking, setIsClicking] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleClick = async () => {
    if (!userLocation || disabled || isClicking) return;

    setIsClicking(true);
    setClickCount(prev => prev + 1);

    try {
      await onClick(userLocation.country_code, userLocation.country_name);
    } catch (error) {
      console.error('Click failed:', error);
    } finally {
      setTimeout(() => setIsClicking(false), 200);
    }
  };

  if (!userLocation) {
    return (
      <Button 
        disabled 
        size="lg" 
        className="war-button w-full max-w-md mx-auto h-16 text-xl opacity-50"
      >
        <MousePointer className="w-6 h-6 mr-2" />
        Detecting Location...
      </Button>
    );
  }

  return (
    <div className="text-center space-y-4">
      <Button
        onClick={handleClick}
        disabled={disabled || isClicking}
        size="lg"
        className={`war-button w-full max-w-md mx-auto h-16 text-xl relative ${
          isClicking ? 'scale-95' : 'hover:scale-105'
        } transition-all duration-200`}
      >
        {isClicking ? (
          <Zap className="w-6 h-6 mr-2 animate-pulse" />
        ) : (
          <MousePointer className="w-6 h-6 mr-2" />
        )}
        Click for {userLocation.country_name}!
        
        {isClicking && (
          <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
        )}
      </Button>

      <div className="text-sm text-muted-foreground">
        You're representing: <span className="font-semibold text-primary">{userLocation.country_name}</span>
        {clickCount > 0 && (
          <div className="text-xs mt-1">
            Session clicks: <span className="font-mono">{clickCount}</span>
          </div>
        )}
      </div>
    </div>
  );
}