import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Menu, X, ArrowLeft, Settings, Plus, LogOut } from "lucide-react";
import { useAuth } from "./admin-auth";
import { db } from "@/lib/database";

interface AdminNavigationProps {
  onAdd?: () => void;
  addButtonText?: string;
}

export function AdminNavigation({ onAdd, addButtonText }: AdminNavigationProps = {}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newInquiriesCount, setNewInquiriesCount] = useState(0);
  const [location] = useLocation();
  const { logout } = useAuth();

  // Загрузка количества новых заявок
  const loadNewInquiriesCount = async () => {
    try {
      // Загружаем актуальные данные из базы данных
      const inquiries = await db.getInquiries();
      const newCount = inquiries.filter(inquiry => inquiry.status === 'new').length;
      setNewInquiriesCount(newCount);

      // Сохраняем в localStorage для быстрого доступа
      if (typeof window !== 'undefined') {
        localStorage.setItem('newInquiriesCount', newCount.toString());
      }
    } catch (error) {
      console.error('Error loading inquiries count:', error);
    }
  };

  useEffect(() => {
    loadNewInquiriesCount();

    // Слушатель для обновления счетчика при изменениях в localStorage (для кросс-таб синхронизации)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'newInquiriesCount' && e.newValue) {
        setNewInquiriesCount(parseInt(e.newValue));
      }
    };

    // Слушатель для обновления счетчика при сохранении заявок
    const handleInquiryUpdate = () => {
      loadNewInquiriesCount();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('inquiryUpdated', handleInquiryUpdate);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('inquiryUpdated', handleInquiryUpdate);
      }
    };
  }, []);

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
    { label: "Заявки", path: "inquiries" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm shadow-sm border-b">
        <div className="container mx-auto px-6 md:px-12 max-w-screen-2xl">
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
                <Link href="/admin/">
                Админ панель
              </Link>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-4">
              {adminNavLinks.map((link) => {
                const isActive = getActiveSection(link.path);
                const isInquiries = link.path === 'inquiries';

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`font-body transition-colors px-3 py-2 rounded-md flex items-center gap-2 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-foreground hover:text-primary hover:bg-muted'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isInquiries && newInquiriesCount > 0 && (
                      <Badge variant="destructive" className="animate-bounce bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg text-xs">
                        {newInquiriesCount}
                      </Badge>
                    )}
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
            </nav>

            {/* Mobile Controls */}
            <div className="lg:hidden flex items-center gap-2">
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
            <nav className="container px-6 py-20 space-y-2">
              {adminNavLinks.map((link) => {
                const isActive = getActiveSection(link.path);
                const isInquiries = link.path === 'inquiries';

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex w-full text-left py-3 px-4 text-lg font-body rounded-lg transition-colors gap-2 ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {link.label}
                    {isInquiries && newInquiriesCount > 0 && (
                      <Badge variant="destructive" className="animate-bounce bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg text-xs">
                        {newInquiriesCount}
                      </Badge>
                    )}
                  </Link>
                );
              })}

              <div className="pt-4 border-t">
              <Button
                onClick={logout}
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Выйти
              </Button>
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
