import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminNavigation } from '@/components/admin-navigation';
import { Eye, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Типы данных
interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  serviceType?: string;
  status: 'new' | 'contacted' | 'in-progress' | 'completed' | 'cancelled';
}

// Импорт базы данных
import { db } from '@/lib/database';

// Helper function to parse IDs safely
const parseId = (id: string | number): number => {
  if (typeof id === 'number') return id;
  if (typeof id === 'string' && id.includes('-')) {
    return parseInt(id.split('-')[1]);
  }
  return parseInt(id.toString());
};

const InquiriesAdmin = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentInquiry, setCurrentInquiry] = useState<Partial<Inquiry>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadInquiries = async () => {
      try {
        const inquiriesData = await db.getInquiries();
        const formattedInquiries: Inquiry[] = inquiriesData.map(i => ({
          id: parseId(i.id),
          name: i.name,
          email: i.email,
          phone: i.phone,
          message: i.message,
          serviceType: i.serviceType,
          status: i.status
        }));
        setInquiries(formattedInquiries);
      } catch (error) {
        console.error('Error loading inquiries:', error);
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить заявки",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadInquiries();
  }, [toast]);

  const handleEdit = (inquiry: Inquiry) => {
    setCurrentInquiry(inquiry);
    setEditingId(`inquiry-${inquiry.id}`);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setCurrentInquiry({
      name: '',
      email: '',
      message: '',
      status: 'new'
    });
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        const updatedInquiry = await db.updateInquiry(editingId, {
          name: currentInquiry.name || '',
          email: currentInquiry.email || '',
          phone: currentInquiry.phone,
          message: currentInquiry.message || '',
          serviceType: currentInquiry.serviceType,
          status: currentInquiry.status || 'new'
        });

        const formattedInquiry: Inquiry = {
          id: parseId(updatedInquiry.id),
          name: updatedInquiry.name,
          email: updatedInquiry.email,
          phone: updatedInquiry.phone,
          message: updatedInquiry.message,
          serviceType: updatedInquiry.serviceType,
          status: updatedInquiry.status
        };

        setInquiries(inquiries.map(i =>
          i.id === formattedInquiry.id ? formattedInquiry : i
        ));

        // Обновляем счетчик новых заявок в localStorage для синхронизации с дашбордом
        if (typeof window !== 'undefined') {
          const allInquiries = await db.getInquiries();
          const newCount = allInquiries.filter(i => i.status === 'new').length;
          localStorage.setItem('newInquiriesCount', newCount.toString());
          // Диспатчим событие для обновления счетчика в AdminNavigation
          window.dispatchEvent(new CustomEvent('inquiryUpdated'));
        }
      } else {
        const newInquiry = await db.createInquiry({
          name: currentInquiry.name || '',
          email: currentInquiry.email || '',
          phone: currentInquiry.phone,
          message: currentInquiry.message || '',
          serviceType: currentInquiry.serviceType,
          status: currentInquiry.status || 'new'
        });

        const formattedInquiry: Inquiry = {
          id: parseId(newInquiry.id),
          name: newInquiry.name,
          email: newInquiry.email,
          phone: newInquiry.phone,
          message: newInquiry.message,
          serviceType: newInquiry.serviceType,
          status: newInquiry.status
        };

        setInquiries([...inquiries, formattedInquiry]);

        // Обновляем счетчик новых заявок в localStorage для синхронизации с дашбордом
        if (typeof window !== 'undefined') {
          const allInquiries = await db.getInquiries();
          const newCount = allInquiries.filter(i => i.status === 'new').length;
          localStorage.setItem('newInquiriesCount', newCount.toString());
          // Диспатчим событие для обновления счетчика в AdminNavigation
          window.dispatchEvent(new CustomEvent('inquiryUpdated'));
        }
      }

      setIsDialogOpen(false);
      setCurrentInquiry({});
      setEditingId(null);

      toast({
        title: "Успешно сохранено",
        description: editingId ? "Заявка обновлена" : "Заявка добавлена",
      });
    } catch (error) {
      console.error('Error saving inquiry:', error);
      toast({
        title: "Ошибка сохранения",
        description: "Не удалось сохранить заявку",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await db.deleteInquiry(`inquiry-${id}`);
      setInquiries(inquiries.filter(i => i.id !== id));
      toast({
        title: "Успешно удалено",
        description: "Заявка удалена",
      });
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      toast({
        title: "Ошибка удаления",
        description: "Не удалось удалить заявку",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: Inquiry['status']) => {
    const statusConfig = {
      'new': { variant: 'default' as const, label: 'Новая' },
      'contacted': { variant: 'secondary' as const, label: 'Связались' },
      'in-progress': { variant: 'outline' as const, label: 'В работе' },
      'completed': { variant: 'default' as const, label: 'Завершена' },
      'cancelled': { variant: 'destructive' as const, label: 'Отменена' }
    };
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNavigation />
        <div className="container mx-auto px-6 py-8 pt-24 md:pt-28">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground">Загрузка заявок...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />

      <div className="container mx-auto px-4 sm:px-6 py-8 pt-24 md:pt-28">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Управление заявками</h2>
              <p className="text-muted-foreground text-sm sm:text-base">Просматривайте и управляйте входящими заявками от клиентов</p>
            </div>
            <Button onClick={handleAdd} disabled={saving} className="flex items-center gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              Добавить заявку
            </Button>
          </div>

          <Card>
            <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Имя</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Услуга</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="w-32">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell className="font-medium">{inquiry.name}</TableCell>
                    <TableCell>{inquiry.email}</TableCell>
                    <TableCell>{inquiry.serviceType || 'Не указана'}</TableCell>
                    <TableCell>
                      {getStatusBadge(inquiry.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(inquiry)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(inquiry.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </CardContent>
        </Card>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Просмотр заявки' : 'Добавить заявку'}
              </DialogTitle>
              <DialogDescription>
                {editingId ? 'Просмотрите и обновите информацию о заявке' : 'Создайте новую заявку'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Имя</Label>
                  <Input
                    id="name"
                    value={currentInquiry.name || ''}
                    onChange={(e) => setCurrentInquiry({ ...currentInquiry, name: e.target.value })}
                    placeholder="Введите имя клиента"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={currentInquiry.email || ''}
                    onChange={(e) => setCurrentInquiry({ ...currentInquiry, email: e.target.value })}
                    placeholder="client@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    value={currentInquiry.phone || ''}
                    onChange={(e) => setCurrentInquiry({ ...currentInquiry, phone: e.target.value })}
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceType">Тип услуги</Label>
                  <Select
                    value={currentInquiry.serviceType || ''}
                    onValueChange={(value) => setCurrentInquiry({ ...currentInquiry, serviceType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите услугу" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Консультация</SelectItem>
                      <SelectItem value="audit">Аудит проекта</SelectItem>
                      <SelectItem value="management">Погружение в проект</SelectItem>
                      <SelectItem value="full-service">Ведение под ключ</SelectItem>
                      <SelectItem value="other">Другое</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Сообщение</Label>
                <Textarea
                  id="message"
                  value={currentInquiry.message || ''}
                  onChange={(e) => setCurrentInquiry({ ...currentInquiry, message: e.target.value })}
                  placeholder="Текст заявки или сообщения"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Статус заявки</Label>
                <Select
                  value={currentInquiry.status || 'new'}
                  onValueChange={(value: Inquiry['status']) => setCurrentInquiry({ ...currentInquiry, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Новая</SelectItem>
                    <SelectItem value="contacted">Связались</SelectItem>
                    <SelectItem value="in-progress">В работе</SelectItem>
                    <SelectItem value="completed">Завершена</SelectItem>
                    <SelectItem value="cancelled">Отменена</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleSave}>
                {editingId ? 'Сохранить' : 'Добавить'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default InquiriesAdmin;
