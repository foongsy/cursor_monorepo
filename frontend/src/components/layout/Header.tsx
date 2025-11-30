import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <div className="flex items-center gap-6 mr-6">
          <a href="/" className="flex items-center space-x-2">
            <div className="font-bold text-2xl text-primary">
              ANIME NEWS
            </div>
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium flex-1">
          <a
            href="/browse"
            className="transition-colors hover:text-primary text-foreground/60"
          >
            Browse
          </a>
          <a
            href="/news"
            className="transition-colors hover:text-primary text-foreground/60"
          >
            News
          </a>
          <a
            href="/manga"
            className="transition-colors hover:text-primary text-foreground/60"
          >
            Manga
          </a>
          <a
            href="/games"
            className="transition-colors hover:text-primary text-foreground/60"
          >
            Games
          </a>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="default" size="sm">
            Subscribe
          </Button>
        </div>
      </div>
    </header>
  );
};

