import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AdminNavigation } from '@/components/admin-navigation';
import { LoadingState } from '@/components/loading-state';
import { useDataUpdate } from '@/components/data-update-context';
import { Edit, Plus, Trash2 } from 'lucide-react';

// Схемы валидации
const testimonialFormSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  role: z.string().min(1, 'Должность обязательна'),
  company: z.string().min(1, 'Название компании обязательно'),
  quote: z.string().min(10, 'Отзыв должен содержать минимум 10 символов'),
});

// Типы данных
interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
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

const TestimonialsAdmin = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { notifyDataUpdate } = useDataUpdate();

  const form = useForm<z.infer<typeof testimonialFormSchema>>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: '',
      role: '',
      company: '',
      quote: '',
    },
  });

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const testimonialsData = await db.getTestimonials();
        const formattedTestimonials: Testimonial[] = testimonialsData.map(t => ({
          id: parseId(t.id), // Convert string id back to number for compatibility
          name: t.name,
          role: t.role,
          company: t.company,
          quote: t.quote
        }));
        setTestimonials(formattedTestimonials);
      } catch (error) {
        console.error('Error loading testimonials:', error);
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить отзывы",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, [toast]);

  const handleEdit = (testimonial: Testimonial) => {
    form.reset({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      quote: testimonial.quote,
    });
    setEditingId(`testimonial-${testimonial.id}`);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    form.reset({
      name: '',
      role: '',
      company: '',
      quote: ''
    });
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const handleSave = async (data: z.infer<typeof testimonialFormSchema>) => {
    setSaving(true);
    try {
      if (editingId) {
        const updatedTestimonial = await db.updateTestimonial(editingId, data);

        const formattedTestimonial: Testimonial = {
          id: parseId(updatedTestimonial.id),
          name: updatedTestimonial.name,
          role: updatedTestimonial.role,
          company: updatedTestimonial.company,
          quote: updatedTestimonial.quote
        };

        setTestimonials(testimonials.map(t =>
          t.id === formattedTestimonial.id ? formattedTestimonial : t
        ));
      } else {
        const newTestimonial = await db.createTestimonial(data);

        const formattedTestimonial: Testimonial = {
          id: parseId(newTestimonial.id),
          name: newTestimonial.name,
          role: newTestimonial.role,
          company: newTestimonial.company,
          quote: newTestimonial.quote
        };

        setTestimonials([...testimonials, formattedTestimonial]);
      }

      setIsDialogOpen(false);
      form.reset();
      setEditingId(null);

      // Уведомляем о обновлении данных
      notifyDataUpdate('testimonials');
      toast({
        title: "Успешно сохранено",
        description: editingId ? "Отзыв обновлен" : "Отзыв добавлен",
      });
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({
        title: "Ошибка сохранения",
        description: "Не удалось сохранить отзыв",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await db.deleteTestimonial(`testimonial-${id}`);
      setTestimonials(testimonials.filter(t => t.id !== id));
      toast({
        title: "Успешно удалено",
        description: "Отзыв удален",
      });
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: "Ошибка удаления",
        description: "Не удалось удалить отзыв",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNavigation />
        <div className="container mx-auto px-6 py-8 pt-24 md:pt-28">
          <LoadingState message="Загрузка отзывов..." />
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
              <h2 className="text-xl sm:text-2xl font-bold">Управление отзывами</h2>
              <p className="text-muted-foreground text-sm sm:text-base">Добавляйте, редактируйте и удаляйте отзывы клиентов</p>
            </div>
            <Button onClick={handleAdd} disabled={saving} className="flex items-center gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              Добавить отзыв
            </Button>
          </div>

          <Card>
            <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Имя</TableHead>
                  <TableHead>Должность</TableHead>
                  <TableHead>Компания</TableHead>
                  <TableHead>Отзыв</TableHead>
                  <TableHead className="w-32">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell className="font-medium">{testimonial.name}</TableCell>
                    <TableCell>{testimonial.role}</TableCell>
                    <TableCell>{testimonial.company}</TableCell>
                    <TableCell className="max-w-xs truncate">{testimonial.quote}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(testimonial)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(testimonial.id)}
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
                {editingId ? 'Редактировать отзыв' : 'Добавить отзыв'}
              </DialogTitle>
              <DialogDescription>
                Заполните информацию об отзыве клиента
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Имя *</FormLabel>
                      <FormControl>
                        <Input placeholder="Введите имя клиента" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Должность *</FormLabel>
                      <FormControl>
                        <Input placeholder="Введите должность" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Компания *</FormLabel>
                      <FormControl>
                        <Input placeholder="Введите название компании" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Отзыв *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Введите текст отзыва"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Сохранение...' : (editingId ? 'Сохранить' : 'Добавить')}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TestimonialsAdmin;
