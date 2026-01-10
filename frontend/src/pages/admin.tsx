import React, { useState, useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { clearAdminSession } from '@/lib/adminSession';
import { AdminProtectedRoute } from '@/components/admin-protected-route';
import { ErrorBoundary } from '@/components/error-boundary';

// Импорт компонентов админ панели
import Dashboard from '@/components/admin/dashboard';
import HeroAdmin from '@/components/admin/hero-admin';
import AboutAdmin from '@/components/admin/about-admin';
import ProcessAdmin from '@/components/admin/process-admin';
import TestimonialsAdmin from '@/components/admin/testimonials-admin';
import ServicesAdmin from '@/components/admin/services-admin';
import ClientsAdmin from '@/components/admin/clients-admin';
import InquiriesAdmin from '@/components/admin/inquiries-admin';

// Импорт базы данных
import { db } from '@/lib/database';

// Основной компонент админ панели
const AdminPage = () => {
  const [location] = useLocation();
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    // Инициализируем базу данных при первом заходе в админку
    const initializeDatabase = async () => {
      try {
        await db.initialize();
        setDbInitialized(true);
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    if (!dbInitialized) {
      initializeDatabase();
    }

  }, [location, dbInitialized]);

  return (
    <AdminProtectedRoute>
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <Switch>
            <Route path="/admin" component={Dashboard} />
            <Route path="admin/hero" component={HeroAdmin} />
            <Route path="admin/about" component={AboutAdmin} />
            <Route path="admin/process" component={ProcessAdmin} />
            <Route path="admin/testimonials" component={TestimonialsAdmin} />
            <Route path="admin/services" component={ServicesAdmin} />
            <Route path="admin/clients" component={ClientsAdmin} />
            <Route path="admin/inquiries" component={InquiriesAdmin} />
            <Route component={Dashboard} />
          </Switch>
        </div>
      </ErrorBoundary>
    </AdminProtectedRoute>
  );
};

export default AdminPage;