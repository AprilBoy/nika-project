import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: "О методе", section: "about" },
    { label: "Как работаю", section: "process" },
    { label: "Услуги", section: "services" },
    { label: "Отзывы", section: "testimonials" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-sm shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <button
              onClick={() => scrollToSection("hero")}
              className="text-xl md:text-2xl font-bold text-primary hover-elevate px-3 py-2 rounded-lg transition-colors"
              data-testid="button-logo"
            >
              Ника Шихлинская
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.section}
                  onClick={() => scrollToSection(link.section)}
                  className="font-body text-foreground hover:text-primary transition-colors"
                  data-testid={`link-nav-${link.section}`}
                >
                  {link.label}
                </button>
              ))}
              <ThemeToggle />
              <Button
                onClick={() => window.open('https://t.me/yourusername', '_blank')}
                data-testid="button-nav-contact"
              >
                Связаться <MessageCircle className="ml-2 h-4 w-4" />
              </Button>
            </nav>

            {/* Mobile Controls */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 hover-elevate rounded-lg"
                data-testid="button-mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-background/95 backdrop-blur-sm pt-20">
            <nav className="container px-6 py-8 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.section}
                  onClick={() => scrollToSection(link.section)}
                  className="block w-full text-left py-3 px-4 text-lg font-body hover-elevate rounded-lg transition-colors"
                  data-testid={`link-mobile-${link.section}`}
                >
                  {link.label}
                </button>
              ))}
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  window.open('https://t.me/yourusername', '_blank');
                  setIsMobileMenuOpen(false);
                }}
                data-testid="button-mobile-contact"
              >
                Связаться <MessageCircle className="ml-2 h-5 w-5" />
              </Button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
