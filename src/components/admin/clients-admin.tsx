import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminNavigation } from '@/components/admin-navigation';
import { useDataUpdate } from '@/components/data-update-context';
import { Edit, Plus, Trash2 } from 'lucide-react';
import {
  Users,
  Building,
  Briefcase,
  Factory,
  ShoppingCart,
  Globe,
  Heart,
  GraduationCap,
  Stethoscope,
  Truck,
  Coffee,
  Wrench,
  Home,
  User
} from 'lucide-react';

// Схемы валидации
const clientFormSchema = z.object({
  title: z.string().min(1, 'Название сегмента обязательно'),
  description: z.string().min(10, 'Описание должно содержать минимум 10 символов'),
  icon: z.string().optional(),
});

// Типы данных
interface ClientSegment {
  id: number;
  title: string;
  description: string;
  icon?: string;
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

const ClientsAdmin = () => {
  const [clients, setClients] = useState<ClientSegment[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<ClientSegment | null>(null);
  const { toast } = useToast();
  const { notifyDataUpdate } = useDataUpdate();

  const clientForm = useForm<z.infer<typeof clientFormSchema>>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      title: '',
      description: '',
      icon: '',
    },
  });

  // Варианты иконок для выбора
  const iconOptions = [
    { value: 'none', label: 'Без иконки', icon: null },
    { value: 'Users', label: 'Пользователи', icon: Users },
    { value: 'Building', label: 'Здания/Бизнес', icon: Building },
    { value: 'Briefcase', label: 'Бизнес', icon: Briefcase },
    { value: 'Factory', label: 'Производство', icon: Factory },
    { value: 'ShoppingCart', label: 'Торговля', icon: ShoppingCart },
    { value: 'Globe', label: 'Международный', icon: Globe },
    { value: 'Heart', label: 'Некоммерческий', icon: Heart },
    { value: 'GraduationCap', label: 'Образование', icon: GraduationCap },
    { value: 'Stethoscope', label: 'Медицина', icon: Stethoscope },
    { value: 'Truck', label: 'Транспорт', icon: Truck },
    { value: 'Coffee', label: 'Кафе/Рестораны', icon: Coffee },
    { value: 'Wrench', label: 'Ремонт/Обслуживание', icon: Wrench },
    { value: 'Home', label: 'Домашний бизнес', icon: Home },
    { value: 'User', label: 'Индивидуальный', icon: User },
  ];

  useEffect(() => {
    const loadClients = async () => {
      try {
        const clientsData = await db.getClientSegments();
        const formattedClients: ClientSegment[] = clientsData.map(c => ({
          id: parseId(c.id),
          title: c.title,
          description: c.description,
          icon: c.icon
        }));
        setClients(formattedClients);
      } catch (error) {
        console.error('Error loading client segments:', error);
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить сегменты клиентов",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, [toast]);

  const handleEdit = (client: ClientSegment) => {
    clientForm.reset({
      title: client.title,
      description: client.description,
      icon: client.icon || 'none',
    });
    setEditingId(`client-${client.id}`);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    clientForm.reset({
      title: '',
      description: '',
      icon: 'none',
    });
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const handleSave = async (data: z.infer<typeof clientFormSchema>) => {
    setSaving(true);
    try {
      if (editingId) {
        const updatedClient = await db.updateClientSegment(editingId, {
          title: data.title,
          description: data.description,
          icon: data.icon === 'none' ? undefined : data.icon
        });

        const formattedClient: ClientSegment = {
          id: parseId(updatedClient.id),
          title: updatedClient.title,
          description: updatedClient.description,
          icon: updatedClient.icon
        };

        setClients(clients.map(c =>
          c.id === formattedClient.id ? formattedClient : c
        ));
      } else {
        const newClient = await db.createClientSegment({
          title: data.title,
          description: data.description,
          icon: data.icon === 'none' ? undefined : data.icon
        });

        const formattedClient: ClientSegment = {
          id: parseId(newClient.id),
          title: newClient.title,
          description: newClient.description,
          icon: newClient.icon
        };

        setClients([...clients, formattedClient]);
      }

      setIsDialogOpen(false);
      clientForm.reset();
      setEditingId(null);

      // Уведомляем о обновлении данных
      notifyDataUpdate('clients');
      toast({
        title: "Успешно сохранено",
        description: editingId ? "Сегмент обновлен" : "Сегмент добавлен",
      });
    } catch (error) {
      console.error('Error saving client segment:', error);
      toast({
        title: "Ошибка сохранения",
        description: "Не удалось сохранить сегмент клиента",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (client: ClientSegment) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return;

    try {
      await db.deleteClientSegment(`client-${clientToDelete.id}`);
      setClients(clients.filter(c => c.id !== clientToDelete.id));
      toast({
        title: "Успешно удалено",
        description: "Сегмент удален",
      });
    } catch (error) {
      console.error('Error deleting client segment:', error);
      toast({
        title: "Ошибка удаления",
        description: "Не удалось удалить сегмент клиента",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setClientToDelete(null);
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
                <p className="text-muted-foreground">Загрузка сегментов клиентов...</p>
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
              <h2 className="text-xl sm:text-2xl font-bold">Управление сегментами клиентов</h2>
              <p className="text-muted-foreground text-sm sm:text-base">Добавляйте, редактируйте и удаляйте сегменты целевой аудитории</p>
            </div>
            <Button onClick={handleAdd} disabled={saving} className="flex items-center gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              Добавить сегмент клиентов
            </Button>
          </div>

          <Card>
            <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название сегмента</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead className="w-32">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.title}</TableCell>
                    <TableCell className="max-w-md truncate">{client.description}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(client)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteClick(client)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Удалить сегмент клиента</AlertDialogTitle>
                              <AlertDialogDescription>
                                Вы уверены, что хотите удалить сегмент "{clientToDelete?.title}"? Это действие нельзя отменить.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Удалить
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Редактировать сегмент' : 'Добавить сегмент'}
              </DialogTitle>
              <DialogDescription>
                Заполните информацию о сегменте клиентов
              </DialogDescription>
            </DialogHeader>

            <Form {...clientForm}>
              <form onSubmit={clientForm.handleSubmit(handleSave)} className="space-y-4">
                <FormField
                  control={clientForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название сегмента *</FormLabel>
                      <FormControl>
                        <Input placeholder="Например: Стартапы и малый бизнес" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={clientForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Описание сегмента *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Опишите, какие клиенты относятся к этому сегменту, их особенности и потребности..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={clientForm.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Иконка сегмента</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите иконку для сегмента">
                              {field.value && field.value !== 'none' && (
                                <div className="flex items-center gap-2">
                                  {(() => {
                                    const selectedOption = iconOptions.find(opt => opt.value === field.value);
                                    return selectedOption?.icon ? <selectedOption.icon className="h-4 w-4" /> : null;
                                  })()}
                                  <span>{iconOptions.find(opt => opt.value === field.value)?.label}</span>
                                </div>
                              )}
                              {(!field.value || field.value === 'none') && "Без иконки"}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {iconOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                {option.icon && <option.icon className="h-4 w-4" />}
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Сохранение...' : (editingId ? 'Сохранить' : 'Добавить сегмент')}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        </div>
    </div>
    </div>
  );
};

export default ClientsAdmin;
