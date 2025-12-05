import React, { useState } from 'react';
import { Route, Switch } from 'wouter';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Navigation } from '@/components/navigation';
import { AdminNavigation } from '@/components/admin-navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Home,
  User,
  Workflow,
  MessageSquare,
  Briefcase,
  Users,
  FolderOpen,
  Mail,
  Edit,
  Plus,
  Save,
  ArrowLeft,
  Trash2,
  Eye
} from 'lucide-react';

// Импорт данных из content.ts для создания моков
import {
  heroContent,
  aboutContent,
  processSteps,
  clientSegments,
  serviceFormats,
  testimonials
} from '@/data/content';

// Типы данных
interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
}

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

interface ClientSegment {
  id: number;
  title: string;
  description: string;
}

interface ProcessStep {
  id: number;
  number: number;
  title: string;
  description: string;
  examples?: string[];
  details?: string[];
}

// Моки данных на основе content.ts
const mockTestimonials: Testimonial[] = testimonials.map((t, index) => ({
  id: index + 1,
  ...t
}));

const mockServices: Service[] = serviceFormats.map((s, index) => ({
  id: index + 1,
  ...s
}));

const mockClients: ClientSegment[] = clientSegments.map((c, index) => ({
  id: index + 1,
  ...c
}));

const mockProcess: ProcessStep[] = processSteps.map((p, index) => ({
  id: index + 1,
  ...p
}));

// Компоненты админ панели

// Hero Section Management
const HeroAdmin = () => {
  const [formData, setFormData] = useState(heroContent);

  const handleSave = () => {
    console.log('Saving hero data:', formData);
    // Здесь будет логика сохранения
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />

      <div className="container mx-auto px-6 py-8 pt-24 md:pt-28">
        <div className="max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Редактирование главной страницы</CardTitle>
              <CardDescription>
                Измените текст и настройки главной страницы вашего сайта
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="badge">Бейдж</Label>
                <Input
                  id="badge"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="Введите текст бейджа"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Заголовок</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Введите заголовок"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Подзаголовок</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Введите подзаголовок"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Введите описание"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryCTA">Основная кнопка</Label>
                  <Input
                    id="primaryCTA"
                    value={formData.primaryCTA}
                    onChange={(e) => setFormData({ ...formData, primaryCTA: e.target.value })}
                    placeholder="Текст основной кнопки"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryCTA">Вторичная кнопка</Label>
                  <Input
                    id="secondaryCTA"
                    value={formData.secondaryCTA}
                    onChange={(e) => setFormData({ ...formData, secondaryCTA: e.target.value })}
                    placeholder="Текст вторичной кнопки"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telegramLink">Ссылка Telegram</Label>
                <Input
                  id="telegramLink"
                  value={formData.telegramLink}
                  onChange={(e) => setFormData({ ...formData, telegramLink: e.target.value })}
                  placeholder="https://t.me/username"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Сохранить изменения
                </Button>
                <Button variant="outline" onClick={() => setFormData(heroContent)}>
                  Сбросить
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// About Section Management
const AboutAdmin = () => {
  const [formData, setFormData] = useState(aboutContent);

  const handleSave = () => {
    console.log('Saving about data:', formData);
    // Здесь будет логика сохранения
  };

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData({ ...formData, highlights: newHighlights });
  };

  const addHighlight = () => {
    setFormData({ ...formData, highlights: [...formData.highlights, ''] });
  };

  const removeHighlight = (index: number) => {
    const newHighlights = formData.highlights.filter((_, i) => i !== index);
    setFormData({ ...formData, highlights: newHighlights });
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />

      <div className="container mx-auto px-6 py-8 pt-24 md:pt-28">
        <div className="max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Редактирование раздела "Обо мне"</CardTitle>
              <CardDescription>
                Измените информацию о себе и ключевые достижения
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Заголовок</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Введите заголовок"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Подзаголовок</Label>
                <Textarea
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Введите подзаголовок"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Ключевые достижения</Label>
                  <Button onClick={addHighlight} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить
                  </Button>
                </div>

                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={highlight}
                      onChange={(e) => updateHighlight(index, e.target.value)}
                      placeholder="Введите достижение"
                      className="flex-1"
                    />
                    <Button
                      onClick={() => removeHighlight(index)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Сохранить изменения
                </Button>
                <Button variant="outline" onClick={() => setFormData(aboutContent)}>
                  Сбросить
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Testimonials Management
const TestimonialsAdmin = () => {
  const [testimonials, setTestimonials] = useState(mockTestimonials);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Partial<Testimonial>>({});

  const handleEdit = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial);
    setEditingId(testimonial.id);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setCurrentTestimonial({
      name: '',
      role: '',
      company: '',
      quote: ''
    });
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setTestimonials(testimonials.map(t =>
        t.id === editingId ? { ...t, ...currentTestimonial } : t
      ));
    } else {
      const newId = Math.max(...testimonials.map(t => t.id)) + 1;
      setTestimonials([...testimonials, { ...currentTestimonial, id: newId } as Testimonial]);
    }
    setIsDialogOpen(false);
    setCurrentTestimonial({});
  };

  const handleDelete = (id: number) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation
        onAdd={handleAdd}
        addButtonText="Добавить отзыв"
      />

      <div className="container mx-auto px-6 py-8 pt-24 md:pt-28">
        <Card>
          <CardHeader>
            <CardTitle>Управление отзывами</CardTitle>
            <CardDescription>
              Добавляйте, редактируйте и удаляйте отзывы клиентов
            </CardDescription>
          </CardHeader>
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

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  value={currentTestimonial.name || ''}
                  onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, name: e.target.value })}
                  placeholder="Введите имя клиента"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Должность</Label>
                <Input
                  id="role"
                  value={currentTestimonial.role || ''}
                  onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, role: e.target.value })}
                  placeholder="Введите должность"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Компания</Label>
                <Input
                  id="company"
                  value={currentTestimonial.company || ''}
                  onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, company: e.target.value })}
                  placeholder="Введите название компании"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quote">Отзыв</Label>
                <Textarea
                  id="quote"
                  value={currentTestimonial.quote || ''}
                  onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, quote: e.target.value })}
                  placeholder="Введите текст отзыва"
                  rows={4}
                />
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

// Services Management
const ServicesAdmin = () => {
  const [services, setServices] = useState(mockServices);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service>>({});

  const handleEdit = (service: Service) => {
    setCurrentService(service);
    setEditingId(service.id);
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

  const handleSave = () => {
    if (editingId) {
      setServices(services.map(s =>
        s.id === editingId ? { ...s, ...currentService } : s
      ));
    } else {
      const newId = Math.max(...services.map(s => s.id)) + 1;
      setServices([...services, { ...currentService, id: newId } as Service]);
    }
    setIsDialogOpen(false);
    setCurrentService({});
  };

  const handleDelete = (id: number) => {
    setServices(services.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation
        onAdd={handleAdd}
        addButtonText="Добавить услугу"
      />

      <div className="container mx-auto px-6 py-8 pt-24 md:pt-28">
        <Card>
          <CardHeader>
            <CardTitle>Управление услугами</CardTitle>
            <CardDescription>
              Добавляйте, редактируйте и удаляйте услуги и цены
            </CardDescription>
          </CardHeader>
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

// Clients Management
const ClientsAdmin = () => {
  const [clients, setClients] = useState(mockClients);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Partial<ClientSegment>>({});

  const handleEdit = (client: ClientSegment) => {
    setCurrentClient(client);
    setEditingId(client.id);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setCurrentClient({
      title: '',
      description: ''
    });
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setClients(clients.map(c =>
        c.id === editingId ? { ...c, ...currentClient } : c
      ));
    } else {
      const newId = Math.max(...clients.map(c => c.id)) + 1;
      setClients([...clients, { ...currentClient, id: newId } as ClientSegment]);
    }
    setIsDialogOpen(false);
    setCurrentClient({});
  };

  const handleDelete = (id: number) => {
    setClients(clients.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation
        onAdd={handleAdd}
        addButtonText="Добавить сегмент"
      />

      <div className="container mx-auto px-6 py-8 pt-24 md:pt-28">
        <Card>
          <CardHeader>
            <CardTitle>Управление сегментами клиентов</CardTitle>
            <CardDescription>
              Добавляйте, редактируйте и удаляйте сегменты целевой аудитории
            </CardDescription>
          </CardHeader>
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
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(client.id)}
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

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Название сегмента</Label>
                <Input
                  id="title"
                  value={currentClient.title || ''}
                  onChange={(e) => setCurrentClient({ ...currentClient, title: e.target.value })}
                  placeholder="Введите название сегмента"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={currentClient.description || ''}
                  onChange={(e) => setCurrentClient({ ...currentClient, description: e.target.value })}
                  placeholder="Введите описание сегмента"
                  rows={4}
                />
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

// Process Management
const ProcessAdmin = () => {
  const [processes, setProcesses] = useState(mockProcess);

  const handleSave = (updatedProcess: ProcessStep) => {
    setProcesses(processes.map(p =>
      p.id === updatedProcess.id ? updatedProcess : p
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />

      <div className="container mx-auto px-6 py-8 pt-24 md:pt-28">
        <div className="max-w-4xl space-y-6">
          {processes.map((process) => (
            <Card key={process.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-4">
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    Шаг {process.number}
                  </Badge>
                  <span>{process.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Название шага</Label>
                  <Input
                    value={process.title}
                    onChange={(e) => handleSave({ ...process, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Описание</Label>
                  <Textarea
                    value={process.description}
                    onChange={(e) => handleSave({ ...process, description: e.target.value })}
                    rows={3}
                  />
                </div>

                {process.examples && (
                  <div className="space-y-2">
                    <Label>Примеры запросов</Label>
                    <Textarea
                      value={process.examples.join('\n')}
                      onChange={(e) => handleSave({
                        ...process,
                        examples: e.target.value.split('\n').filter(ex => ex.trim())
                      })}
                      placeholder="Каждый пример с новой строки"
                      rows={3}
                    />
                  </div>
                )}

                {process.details && (
                  <div className="space-y-2">
                    <Label>Детали</Label>
                    <Textarea
                      value={process.details.join('\n')}
                      onChange={(e) => handleSave({
                        ...process,
                        details: e.target.value.split('\n').filter(d => d.trim())
                      })}
                      placeholder="Каждая деталь с новой строки"
                      rows={3}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// Placeholder components for Projects and Inquiries
const ProjectsAdmin = () => (
  <div className="min-h-screen bg-background">
    <AdminNavigation />

    <div className="container mx-auto px-6 py-8 pt-24 md:pt-28">
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-semibold">Раздел проектов</h3>
            <p className="text-muted-foreground">Управление проектами и кейсами находится в разработке</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const InquiriesAdmin = () => (
  <div className="min-h-screen bg-background">
    <AdminNavigation />

    <div className="container mx-auto px-6 py-8 pt-24 md:pt-28">
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Mail className="h-16 w-16 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-semibold">Раздел заявок</h3>
            <p className="text-muted-foreground">Управление входящими заявками находится в разработке</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Главная админ панель с дашбордом
const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />

      {/* Content */}
      <div className="container mx-auto px-6 py-8 pt-24 md:pt-28">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Управление контентом</h2>
          <p className="text-muted-foreground">Редактируйте содержимое вашего сайта</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/hero">
            <Card className="p-6 hover-elevate cursor-pointer transition-all">
              <Home className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Главная страница</h3>
              <p className="text-muted-foreground">Управление заголовками и описанием</p>
            </Card>
          </Link>

          <Link to="/about">
            <Card className="p-6 hover-elevate cursor-pointer transition-all">
              <User className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Обо мне</h3>
              <p className="text-muted-foreground">Редактирование информации о себе</p>
            </Card>
          </Link>

          <Link to="/process">
            <Card className="p-6 hover-elevate cursor-pointer transition-all">
              <Workflow className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Процесс работы</h3>
              <p className="text-muted-foreground">Управление шагами процесса</p>
            </Card>
          </Link>

          <Link to="/testimonials">
            <Card className="p-6 hover-elevate cursor-pointer transition-all">
              <MessageSquare className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Отзывы</h3>
              <p className="text-muted-foreground">Управление отзывами клиентов</p>
            </Card>
          </Link>

          <Link to="/services">
            <Card className="p-6 hover-elevate cursor-pointer transition-all">
              <Briefcase className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Услуги</h3>
              <p className="text-muted-foreground">Редактирование услуг и цен</p>
            </Card>
          </Link>

          <Link to="/clients">
            <Card className="p-6 hover-elevate cursor-pointer transition-all">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Клиенты</h3>
              <p className="text-muted-foreground">Управление сегментами клиентов</p>
            </Card>
          </Link>

          <Link to="/projects">
            <Card className="p-6 hover-elevate cursor-pointer transition-all">
              <FolderOpen className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Проекты</h3>
              <p className="text-muted-foreground">Управление кейсами и проектами</p>
            </Card>
          </Link>

          <Link to="/inquiries">
            <Card className="p-6 hover-elevate cursor-pointer transition-all">
              <Mail className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Заявки</h3>
              <p className="text-muted-foreground">Просмотр входящих заявок</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Основной компонент админ панели
const AdminPage = () => {
  const [location] = useLocation();

  // Определяем компонент на основе текущего пути
  const renderComponent = () => {
    const path = location.replace('/admin', '') || '/';

    switch (path) {
      case '/':
        return <Dashboard />;
      case '/hero':
        return <HeroAdmin />;
      case '/about':
        return <AboutAdmin />;
      case '/process':
        return <ProcessAdmin />;
      case '/testimonials':
        return <TestimonialsAdmin />;
      case '/services':
        return <ServicesAdmin />;
      case '/clients':
        return <ClientsAdmin />;
      case '/projects':
        return <ProjectsAdmin />;
      case '/inquiries':
        return <InquiriesAdmin />;
      default:
        return <Dashboard />;
    }
  };

  return renderComponent();
};

export default AdminPage;