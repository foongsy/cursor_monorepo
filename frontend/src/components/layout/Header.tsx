import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header(): React.JSX.Element {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <div className="flex items-center gap-6 mr-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="font-bold text-2xl text-primary">
              ANIME NEWS
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium flex-1">
          <Link
            to="/"
            className="transition-colors hover:text-primary text-foreground/60"
          >
            Home
          </Link>
          <Link
            to="/category/Anime"
            className="transition-colors hover:text-primary text-foreground/60"
          >
            Anime
          </Link>
          <Link
            to="/category/Manga%20Release"
            className="transition-colors hover:text-primary text-foreground/60"
          >
            Manga
          </Link>
          <Link
            to="/category/Event"
            className="transition-colors hover:text-primary text-foreground/60"
          >
            Events
          </Link>
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
}

