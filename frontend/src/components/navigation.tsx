import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Menu, X, Settings } from "lucide-react";
import { isAdminSessionActive } from "@/lib/adminSession";
import { useLocation } from "wouter";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminSessionActiveState, setIsAdminSessionActiveState] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsAdminSessionActiveState(isAdminSessionActive());
  }, []);

  // Block body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (id: string) => {
    if (id === 'testimonials') {
      navigate('/testimonials');
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: "Обо мне", section: "about" },
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
          <div className="flex justify-between lg:flex-row sm:flex-row xs:flex-row lg:items-center lg:justify-between sm:justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => scrollToSection("hero")}
              className="text-xl md:text-2xl max-w-[max-content] font-bold text-primary hover-elevate px-3 py-2 rounded-lg transition-colors"
              data-testid="button-logo"
            >
              Ника Шихлинская
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 lg:mt-0 mt-4">
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
              {isAdminSessionActiveState && (
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/admin/'}
                  data-testid="button-nav-admin"
                >
                  Админ-панель <Settings className="ml-2 h-4 w-4" />
                </Button>
              )}
              <Button
                onClick={() => window.open('https://t.me/nikashikh', '_blank')}
                data-testid="button-nav-contact"
              >
                Связаться <MessageCircle className="ml-2 h-4 w-4" />
              </Button>
            </nav>

            {/* Mobile Controls - всегда справа */}
            <div className="lg:hidden flex items-center gap-2 flex-shrink-0">
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
        <div className="fixed inset-0 z-40 lg:hidden">
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
              {isAdminSessionActiveState && (
                <Button
                className="flex"
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    window.location.href = '/admin/';
                    setIsMobileMenuOpen(false);
                  }}
                  data-testid="button-mobile-admin"
                >
                  Админ-панель <Settings className="ml-2 h-5 w-5" />
                </Button>
              )}
              <Button
                size="lg"
                onClick={() => {
                  window.open('https://t.me/nikashikh', '_blank');
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
