import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MessageCircle, Menu, X, ArrowLeft, Settings, Plus } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface AdminNavigationProps {
  onAdd?: () => void;
  addButtonText?: string;
}

export function AdminNavigation({ onAdd, addButtonText }: AdminNavigationProps = {}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const adminNavLinks = [
    { label: "Главная", path: "" },
    { label: "Hero секция", path: "/hero" },
    { label: "Обо мне", path: "/about" },
    { label: "Процесс", path: "/process" },
    { label: "Отзывы", path: "/testimonials" },
    { label: "Услуги", path: "/services" },
    { label: "Клиенты", path: "/clients" },
    { label: "Проекты", path: "/projects" },
    { label: "Заявки", path: "/inquiries" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm shadow-sm border-b">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo and Back to Site */}
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">На сайт</span>
              </Link>

              <div className="h-6 w-px bg-border" />

              <button className="text-xl md:text-2xl font-bold text-primary hover:text-primary/80 px-3 py-2 rounded-lg transition-colors">
                Админ панель
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-4">
              {adminNavLinks.slice(0, 6).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="font-body text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-muted"
                >
                  {link.label}
                </Link>
              ))}
              {onAdd && (
                <>
                  <div className="h-6 w-px bg-border" />
                  <Button onClick={onAdd} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {addButtonText}
                  </Button>
                </>
              )}
              <div className="h-6 w-px bg-border" />
              <ThemeToggle />
            </nav>

            {/* Mobile Controls */}
            <div className="lg:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
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
        <div className="fixed inset-0 z-40 lg:hidden pt-16 md:pt-20">
          <div className="absolute inset-0 bg-background/95 backdrop-blur-sm">
            <nav className="container px-6 py-8 space-y-2">
              {adminNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-left py-3 px-4 text-lg font-body hover:bg-muted rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 border-t">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 w-full text-left py-3 px-4 text-lg font-body hover:bg-muted rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Вернуться на сайт
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
