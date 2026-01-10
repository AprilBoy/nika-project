import React from 'react';
import { AuthProvider, AdminLogin, useAuth } from './admin-auth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

function AdminProtectedContent({ children }: AdminProtectedRouteProps) {
  const { isAuthenticated, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <>{children}</>;
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  return (
    <AuthProvider>
      <AdminProtectedContent>
        {children}
      </AdminProtectedContent>
    </AuthProvider>
  );
}
