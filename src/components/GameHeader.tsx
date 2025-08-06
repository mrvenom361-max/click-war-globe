import { Globe, Swords } from 'lucide-react';
import { Countdown } from './Countdown';

export function GameHeader() {
  return (
    <header className="w-full bg-card/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Globe className="w-8 h-8 text-primary animate-pulse" />
              <Swords className="w-6 h-6 text-war-red" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold war-text-glow">
                Global Click War
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Click for your country! Real-time worldwide competition.
              </p>
            </div>
          </div>
          
          <div className="text-center sm:text-right">
            <Countdown />
            <div className="text-xs text-muted-foreground mt-1">
              Daily reset at UTC midnight
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}