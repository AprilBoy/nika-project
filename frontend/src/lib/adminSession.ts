/**
 * Утилиты для управления сессией админ панели
 */

export const clearAdminSession = () => {
  // Очищаем локальное хранилище админ панели
  const adminKeys = Object.keys(localStorage).filter(key =>
    key.startsWith('admin_') ||
    key.startsWith('admin-session') ||
    key.includes('admin')
  );

  adminKeys.forEach(key => {
    localStorage.removeItem(key);
  });

  // Очищаем sessionStorage
  const adminSessionKeys = Object.keys(sessionStorage).filter(key =>
    key.startsWith('admin_') ||
    key.includes('admin')
  );

  adminSessionKeys.forEach(key => {
    sessionStorage.removeItem(key);
  });

  // Очищаем переменные состояния админки
  localStorage.removeItem('admin-theme');
  localStorage.removeItem('admin-preferences');
  localStorage.removeItem('admin-last-route');
  localStorage.removeItem('admin-auth-token');
  localStorage.removeItem('admin-user-data');

  console.log('Admin session cleared');
};

export const isAdminSessionActive = () => {
  // Проверяем, есть ли активная сессия админки
  const adminKeys = Object.keys(localStorage).filter(key =>
    key.startsWith('admin_') ||
    key.includes('admin')
  );

  return adminKeys.length > 0;
};
