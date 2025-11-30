export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-primary">ANIME NEWS</h3>
            <p className="text-sm text-muted-foreground">
              Your source for the latest anime, manga, and gaming news from natalie.mu
            </p>
          </div>

          {/* Browse Section */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Browse</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/news" className="text-muted-foreground hover:text-primary transition-colors">
                  News
                </a>
              </li>
              <li>
                <a href="/anime" className="text-muted-foreground hover:text-primary transition-colors">
                  Anime
                </a>
              </li>
              <li>
                <a href="/manga" className="text-muted-foreground hover:text-primary transition-colors">
                  Manga
                </a>
              </li>
              <li>
                <a href="/games" className="text-muted-foreground hover:text-primary transition-colors">
                  Games
                </a>
              </li>
            </ul>
          </div>

          {/* About Section Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">About</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Anime News. Content sourced from natalie.mu
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="/cookies" className="hover:text-primary transition-colors">
              Cookie Policy
            </a>
            <a href="/accessibility" className="hover:text-primary transition-colors">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

