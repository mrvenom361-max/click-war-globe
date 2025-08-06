import { Share2, Heart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ActionBarProps {
  userCountryName: string;
}

export function ActionBar({ userCountryName }: ActionBarProps) {
  const { toast } = useToast();

  const handleShare = () => {
    const shareText = `I'm clicking for ${userCountryName} in the Global Click War! Join me and help your country climb the leaderboard! 🌍⚔️`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: 'Global Click War',
        text: shareText,
        url: shareUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
        toast({
          title: "Link Copied!",
          description: "Share this link to recruit more clicks for your country!",
        });
      }).catch(() => {
        toast({
          title: "Copy Failed",
          description: "Please copy the URL manually to share.",
          variant: "destructive"
        });
      });
    }
  };

  const handleDonate = () => {
    // Placeholder for Coinbase Commerce integration
    toast({
      title: "Donation Feature",
      description: "Crypto donations will be available soon! Thank you for your support.",
    });
  };

  return (
    <div className="space-y-4">
      {/* Ad Placeholder */}
      <Card className="p-4 border-dashed border-muted-foreground/30 bg-muted/20">
        <div className="text-center text-muted-foreground">
          <div className="text-sm font-medium mb-1">Advertisement Space</div>
          <div className="text-xs">
            728x90 banner ad would go here
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={handleShare}
          variant="outline"
          className="flex-1 sm:flex-none"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share to Recruit
        </Button>

        <Button
          onClick={handleDonate}
          variant="outline"
          className="flex-1 sm:flex-none border-war-yellow text-war-yellow hover:bg-war-yellow hover:text-background"
        >
          <Heart className="w-4 h-4 mr-2" />
          Donate Crypto
        </Button>

        <Button
          asChild
          variant="outline"
          className="flex-1 sm:flex-none"
        >
          <a 
            href="https://github.com/lovable-dev/global-click-war" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            GitHub
          </a>
        </Button>
      </div>
    </div>
  );
}