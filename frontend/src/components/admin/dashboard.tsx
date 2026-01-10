import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminNavigation } from '@/components/admin-navigation';
import {
  Home,
  User,
  Workflow,
  MessageSquare,
  Briefcase,
  Users,
  FolderOpen,
  Mail
} from 'lucide-react';

// Импорт базы данных
import { db } from '@/lib/database';

const Dashboard = () => {
  const [newInquiriesCount, setNewInquiriesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNewInquiriesCount = async () => {
      try {
        // Сначала проверяем localStorage на наличие сохраненного счетчика
        if (typeof window !== 'undefined') {
          const savedCount = localStorage.getItem('newInquiriesCount');
          if (savedCount) {
            setNewInquiriesCount(parseInt(savedCount));
            setLoading(false);
            return;
          }
        }

        // Если нет сохраненного счетчика, загружаем из базы данных
        const inquiries = await db.getInquiries();
        const newCount = inquiries.filter(inquiry => inquiry.status === 'new').length;
        setNewInquiriesCount(newCount);

        // Сохраняем в localStorage для быстрого доступа
        if (typeof window !== 'undefined') {
          localStorage.setItem('newInquiriesCount', newCount.toString());
        }
      } catch (error) {
        console.error('Error loading inquiries count:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNewInquiriesCount();

    // Слушатель для обновления счетчика при изменениях в localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'newInquiriesCount' && e.newValue) {
        setNewInquiriesCount(parseInt(e.newValue));
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 pt-24 md:pt-28">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Управление контентом</h2>
              <p className="text-muted-foreground text-sm sm:text-base">Редактируйте содержимое вашего сайта</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="hero">
              <Card className="p-6 hover-elevate cursor-pointer transition-all">
                <Home className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Hero секция</h3>
                <p className="text-muted-foreground">Управление заголовками и описанием</p>
              </Card>
            </Link>

            <Link to="about">
              <Card className="p-6 hover-elevate cursor-pointer transition-all">
                <User className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Обо мне</h3>
                <p className="text-muted-foreground">Редактирование информации о себе</p>
              </Card>
            </Link>

            <Link to="process">
              <Card className="p-6 hover-elevate cursor-pointer transition-all">
                <Workflow className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Процесс работы</h3>
                <p className="text-muted-foreground">Управление шагами процесса</p>
              </Card>
            </Link>

            <Link to="testimonials">
              <Card className="p-6 hover-elevate cursor-pointer transition-all">
                <MessageSquare className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Отзывы</h3>
                <p className="text-muted-foreground">Управление отзывами клиентов</p>
              </Card>
            </Link>

            <Link to="services">
              <Card className="p-6 hover-elevate cursor-pointer transition-all">
                <Briefcase className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Услуги</h3>
                <p className="text-muted-foreground">Редактирование услуг и цен</p>
              </Card>
            </Link>

            <Link to="clients">
              <Card className="p-6 hover-elevate cursor-pointer transition-all">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Клиенты</h3>
                <p className="text-muted-foreground">Управление сегментами клиентов</p>
              </Card>
            </Link>

            {/* <Link to="projects">
              <Card className="p-6 hover-elevate cursor-pointer transition-all">
                <FolderOpen className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Проекты</h3>
                <p className="text-muted-foreground">Управление кейсами и проектами</p>
              </Card>
            </Link> */}

            <Link to="inquiries">
              <Card className="p-6 hover-elevate cursor-pointer transition-all relative">
                <Mail className="h-12 w-12 text-primary mb-4" />
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">Заявки</h3>
                  {newInquiriesCount > 0 && (
                    <Badge variant="destructive" className="animate-bounce bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg">
                      {newInquiriesCount}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">Просмотр входящих заявок</p>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
