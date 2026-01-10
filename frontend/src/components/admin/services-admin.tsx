import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AdminNavigation } from '@/components/admin-navigation';
import { useDataUpdate } from '@/components/data-update-context';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Типы данных
interface Service {
  id: number;
  title: string;
  price: string;
  duration?: string;
  description?: string;
  examples?: string[];
  cta: string;
  available: boolean;
  featured?: boolean;
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

const ServicesAdmin = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { notifyDataUpdate } = useDataUpdate();

  useEffect(() => {
    const loadServices = async () => {
      try {
        const servicesData = await db.getServices();
        const formattedServices: Service[] = servicesData.map(s => ({
          id: parseId(s.id),
          title: s.title,
          price: s.price,
          duration: s.duration,
          description: s.description,
          examples: s.examples,
          cta: s.cta,
          available: s.available,
          featured: s.featured
        }));
        setServices(formattedServices);
      } catch (error) {
        console.error('Error loading services:', error);
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить услуги",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [toast]);

  const handleEdit = (service: Service) => {
    setCurrentService(service);
    setEditingId(`service-${service.id}`);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setCurrentService({
      title: '',
      price: '',
      description: '',
      cta: '',
      available: true
    });
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        const updatedService = await db.updateService(editingId, {
          title: currentService.title || '',
          price: currentService.price || '',
          duration: currentService.duration,
          description: currentService.description,
          examples: currentService.examples,
          cta: currentService.cta || '',
          available: currentService.available || false,
          featured: currentService.featured
        });

        const formattedService: Service = {
          id: parseId(updatedService.id),
          title: updatedService.title,
          price: updatedService.price,
          duration: updatedService.duration,
          description: updatedService.description,
          examples: updatedService.examples,
          cta: updatedService.cta,
          available: updatedService.available,
          featured: updatedService.featured
        };

        setServices(services.map(s =>
          s.id === formattedService.id ? formattedService : s
        ));
      } else {
        const newService = await db.createService({
          title: currentService.title || '',
          price: currentService.price || '',
          duration: currentService.duration,
          description: currentService.description,
          examples: currentService.examples,
          cta: currentService.cta || '',
          available: currentService.available || false,
          featured: currentService.featured
        });

        const formattedService: Service = {
          id: parseId(newService.id),
          title: newService.title,
          price: newService.price,
          duration: newService.duration,
          description: newService.description,
          examples: newService.examples,
          cta: newService.cta,
          available: newService.available,
          featured: newService.featured
        };

        setServices([...services, formattedService]);
      }

      setIsDialogOpen(false);
      setCurrentService({});
      setEditingId(null);

      // Уведомляем о обновлении данных
      notifyDataUpdate('services');
      toast({
        title: "Успешно сохранено",
        description: editingId ? "Услуга обновлена" : "Услуга добавлена",
      });
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: "Ошибка сохранения",
        description: "Не удалось сохранить услугу",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await db.deleteService(`service-${id}`);
      setServices(services.filter(s => s.id !== id));
      toast({
        title: "Успешно удалено",
        description: "Услуга удалена",
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Ошибка удаления",
        description: "Не удалось удалить услугу",
        variant: "destructive",
      });
    }
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
                <p className="text-muted-foreground">Загрузка услуг...</p>
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
              <h2 className="text-xl sm:text-2xl font-bold">Управление услугами</h2>
              <p className="text-muted-foreground text-sm sm:text-base">Добавляйте, редактируйте и удаляйте услуги и цены</p>
            </div>
            <Button onClick={handleAdd} disabled={saving} className="flex items-center gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              Добавить услугу
            </Button>
          </div>

          <Card>
            <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Цена</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="w-32">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.title}</TableCell>
                    <TableCell>{service.price}</TableCell>
                    <TableCell>
                      <Badge variant={service.available ? "default" : "secondary"}>
                        {service.available ? "Доступно" : "Недоступно"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(service)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(service.id)}
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
                {editingId ? 'Редактировать услугу' : 'Добавить услугу'}
              </DialogTitle>
              <DialogDescription>
                Заполните информацию об услуге
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Название услуги</Label>
                <Input
                  id="title"
                  value={currentService.title || ''}
                  onChange={(e) => setCurrentService({ ...currentService, title: e.target.value })}
                  placeholder="Введите название услуги"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Цена</Label>
                  <Input
                    id="price"
                    value={currentService.price || ''}
                    onChange={(e) => setCurrentService({ ...currentService, price: e.target.value })}
                    placeholder="7 000 ₽"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Длительность</Label>
                  <Input
                    id="duration"
                    value={currentService.duration || ''}
                    onChange={(e) => setCurrentService({ ...currentService, duration: e.target.value })}
                    placeholder="1 час"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={currentService.description || ''}
                  onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                  placeholder="Введите описание услуги"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cta">Текст кнопки</Label>
                  <Input
                    id="cta"
                    value={currentService.cta || ''}
                    onChange={(e) => setCurrentService({ ...currentService, cta: e.target.value })}
                    placeholder="Записаться"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Статус</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="available"
                      checked={currentService.available || false}
                      onChange={(e) => setCurrentService({ ...currentService, available: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="available">Доступно</Label>
                  </div>
                </div>
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

export default ServicesAdmin;
