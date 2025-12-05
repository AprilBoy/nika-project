import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { MessageCircle, Menu, X, ArrowLeft, Settings, Plus, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { clearAdminSession } from "@/lib/adminSession";
import { useAuth } from "./admin-auth";

interface AdminNavigationProps {
  onAdd?: () => void;
  addButtonText?: string;
}

export function AdminNavigation({ onAdd, addButtonText }: AdminNavigationProps = {}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { logout } = useAuth();

  // Определяем активный раздел на основе текущего пути
  const getActiveSection = (path: string) => {
    const currentPath = location.replace(/^\/admin\/?/, ''); // Убираем /admin/ из пути
    return currentPath === path || (path === '' && currentPath === '');
  };

  // Проверяем, находимся ли мы на главной странице админки
  const isOnAdminHome = location === '/admin/' || location === '/admin';

  const adminNavLinks = [
    { label: "Hero секция", path: "hero" },
    { label: "Обо мне", path: "about" },
    { label: "Процесс", path: "process" },
    { label: "Отзывы", path: "testimonials" },
    { label: "Услуги", path: "services" },
    { label: "Клиенты", path: "clients" },
    { label: "Проекты", path: "projects" },
    { label: "Заявки", path: "inquiries" },
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
                onClick={clearAdminSession}
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">На сайт</span>
              </Link>

              <div className="h-6 w-px bg-border" />

              <button className="text-xl md:text-2xl font-bold text-primary hover:text-primary/80 px-3 py-2 rounded-lg transition-colors">
                <Link href="/admin/">
                Админ панель
              </Link>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-4">
              {adminNavLinks.slice(0, 6).map((link) => {
                const isActive = getActiveSection(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`font-body transition-colors px-3 py-2 rounded-md ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-foreground hover:text-primary hover:bg-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
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
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Выйти
              </Button>
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
              {adminNavLinks.map((link) => {
                const isActive = getActiveSection(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full text-left py-3 px-4 text-lg font-body rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

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
