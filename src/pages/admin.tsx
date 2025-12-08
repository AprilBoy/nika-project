import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Route, Switch, useLocation } from 'wouter';
import { Link } from 'wouter';
import { clearAdminSession } from '@/lib/adminSession';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Navigation } from '@/components/navigation';
import { AdminNavigation } from '@/components/admin-navigation';
import { AdminProtectedRoute } from '@/components/admin-protected-route';
import { ErrorBoundary } from '@/components/error-boundary';
import { LoadingState, SavingState } from '@/components/loading-state';
import { useDataUpdate } from '@/components/data-update-context';
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
  Eye,
  Building,
  Factory,
  ShoppingCart,
  Globe,
  Heart,
  GraduationCap,
  Stethoscope,
  Truck,
  Coffee,
  Wrench
} from 'lucide-react';

// Схемы валидации
const heroFormSchema = z.object({
  badge: z.string().min(1, 'Бейдж обязателен'),
  title: z.string().min(1, 'Заголовок обязателен'),
  subtitle: z.string().min(1, 'Подзаголовок обязателен'),
  description: z.string().min(10, 'Описание должно содержать минимум 10 символов'),
  primaryCTA: z.string().min(1, 'Текст основной кнопки обязателен'),
  secondaryCTA: z.string().min(1, 'Текст вторичной кнопки обязателен'),
  telegramLink: z.string().url('Введите корректный URL Telegram'),
  image: z.string().optional(),
});

const aboutFormSchema = z.object({
  title: z.string().min(1, 'Заголовок обязателен'),
  subtitle: z.string().min(10, 'Подзаголовок должен содержать минимум 10 символов'),
  highlights: z.array(z.string().min(1, 'Каждое достижение должно быть заполнено')).min(1, 'Должен быть хотя бы один пункт достижений'),
});

const testimonialFormSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  role: z.string().min(1, 'Должность обязательна'),
  company: z.string().min(1, 'Название компании обязательно'),
  quote: z.string().min(10, 'Отзыв должен содержать минимум 10 символов'),
});

const serviceFormSchema = z.object({
  title: z.string().min(1, 'Название услуги обязательно'),
  price: z.string().min(1, 'Цена обязательна'),
  duration: z.string().optional(),
  description: z.string().optional(),
  cta: z.string().min(1, 'Текст кнопки обязателен'),
  available: z.boolean(),
  featured: z.boolean().optional(),
  examples: z.array(z.string()).optional(),
});

const clientFormSchema = z.object({
  title: z.string().min(1, 'Название сегмента обязательно'),
  description: z.string().min(10, 'Описание должно содержать минимум 10 символов'),
  icon: z.string().optional(),
});

const projectFormSchema = z.object({
  title: z.string().min(1, 'Название проекта обязательно'),
  description: z.string().min(10, 'Описание должно содержать минимум 10 символов'),
  category: z.string().min(1, 'Категория обязательна'),
  imageUrl: z.string().url('Введите корректный URL изображения').optional().or(z.literal('')),
  link: z.string().url('Введите корректный URL').optional().or(z.literal('')),
  featured: z.boolean().optional(),
});

const processStepFormSchema = z.object({
  number: z.number().min(1, 'Номер шага должен быть положительным'),
  title: z.string().min(1, 'Название шага обязательно'),
  description: z.string().min(10, 'Описание должно содержать минимум 10 символов'),
  examples: z.array(z.string()).optional(),
  details: z.array(z.string()).optional(),
});

const inquiryFormSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  email: z.string().email('Введите корректный email'),
  phone: z.string().optional(),
  serviceType: z.string().optional(),
  message: z.string().min(10, 'Сообщение должно содержать минимум 10 символов'),
  status: z.enum(['new', 'contacted', 'in-progress', 'completed', 'cancelled']),
});

// Импорт данных из content.ts для создания моков
import {
  heroContent,
  aboutContent,
  processSteps,
  clientSegments,
  serviceFormats,
  testimonials
} from '@/data/content';

// Helper function to parse IDs safely
const parseId = (id: string | number): number => {
  if (typeof id === 'number') return id;
  if (typeof id === 'string' && id.includes('-')) {
    return parseInt(id.split('-')[1]);
  }
  return parseInt(id.toString());
};

// Импорт базы данных
import { db } from '@/lib/database';

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
  icon?: string;
}

interface ProcessStep {
  id: number;
  number: number;
  title: string;
  description: string;
  examples?: string[];
  details?: string[];
}

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  link?: string;
  featured: boolean;
}

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  serviceType?: string;
  status: 'new' | 'contacted' | 'in-progress' | 'completed' | 'cancelled';
}

// Моки данных на основе content.ts (уже не используются, оставлены для совместимости)
const mockTestimonials: Testimonial[] = testimonials.map((t) => ({
  id: t.id,
  name: t.name,
  role: t.role,
  company: t.company,
  quote: t.quote
}));

const mockServices: Service[] = serviceFormats.map((s) => ({
  id: s.id,
  title: s.title,
  price: s.price,
  duration: s.duration,
  description: s.description,
  examples: s.examples,
  cta: s.cta,
  available: s.available,
  featured: s.featured
}));

const mockClients: ClientSegment[] = clientSegments.map((c) => ({
  id: c.id,
  title: c.title,
  description: c.description
}));

const mockProcess: ProcessStep[] = processSteps.map((p) => ({
  id: p.id,
  number: p.number,
  title: p.title,
  description: p.description,
  examples: p.examples,
  details: p.details
}));

// Компоненты админ панели

// Hero Section Management
const HeroAdmin = () => {
  const [formData, setFormData] = useState({
  ...heroContent,
  image: (heroContent as any).image || ''
});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const { toast } = useToast();
  const { notifyDataUpdate } = useDataUpdate();

  const loadGeneratedImages = async () => {
    try {
      const response = await fetch('/api/generated-images');
      if (response.ok) {
        const images = await response.json();
        setGeneratedImages(images);
      }
    } catch (error) {
      console.error('Error loading generated images:', error);
    }
  };

  useEffect(() => {
    const loadHeroData = async () => {
      try {
        const heroData = await db.getHero();
        if (heroData) {
          setFormData({
            badge: heroData.badge,
            title: heroData.title,
            subtitle: heroData.subtitle,
            description: heroData.description,
            primaryCTA: heroData.primaryCTA,
            secondaryCTA: heroData.secondaryCTA,
            telegramLink: heroData.telegramLink,
            image: heroData.image || ''
          });
        }
      } catch (error) {
        console.error('Error loading hero data:', error);
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить данные главной страницы",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadHeroData();
    loadGeneratedImages();
  }, [toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await db.updateHero({
        badge: formData.badge,
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        primaryCTA: formData.primaryCTA,
        secondaryCTA: formData.secondaryCTA,
        telegramLink: formData.telegramLink,
        image: formData.image
      });
      // Уведомляем о обновлении данных
      notifyDataUpdate('hero');
      toast({
        title: "Успешно сохранено",
        description: "Данные главной страницы обновлены",
      });
    } catch (error) {
      console.error('Error saving hero data:', error);
      toast({
        title: "Ошибка сохранения",
        description: "Не удалось сохранить данные главной страницы",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size before upload (considering base64 encoding increases size by ~33%)
    const maxFileSize = 5 * 1024 * 1024; // 5MB original file size limit
    if (file.size > maxFileSize) {
      toast({
        title: "Файл слишком большой",
        description: "Максимальный размер файла - 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingImage(true);
    try {
      const result = await db.uploadHeroImage(file);
      const newFormData = { ...formData, image: result.imagePath };
      setFormData(newFormData);

      // Automatically save the hero data after image upload
      await db.updateHero({
        badge: newFormData.badge,
        title: newFormData.title,
        subtitle: newFormData.subtitle,
        description: newFormData.description,
        primaryCTA: newFormData.primaryCTA,
        secondaryCTA: newFormData.secondaryCTA,
        telegramLink: newFormData.telegramLink,
        image: newFormData.image
      });

      // Уведомляем о обновлении данных
      notifyDataUpdate('hero');

      toast({
        title: "Изображение загружено и сохранено",
        description: "Изображение главной страницы успешно обновлено и сохранено",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить изображение",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSelectGeneratedImage = (imagePath: string) => {
    setFormData({ ...formData, image: imagePath });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNavigation />
        <div className="container mx-auto px-6 py-8 pt-24 md:pt-28">
          <div className="max-w-4xl">
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground">Загрузка данных...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

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
                <Label>Изображение главной страницы</Label>
                <div className="space-y-4">
                  {formData.image && (
                    <div className="relative w-48 h-32 rounded-lg overflow-hidden border">
                      <img
                        src={formData.image}
                        alt="Текущее изображение главной страницы"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="flex-1"
                    />
                    {uploadingImage && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Выберите изображение для главной страницы. Рекомендуемый размер: 800x600px. Максимальный размер файла: 5MB.
                  </p>
                </div>

                {generatedImages.length > 0 && (
                  <div className="space-y-2">
                    <Label>Или выберите из галереи изображений:</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/20">
                      {generatedImages.map((image, index) => (
                        <div
                          key={index}
                          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                            formData.image === image.path ? 'border-primary ring-2 ring-primary/20' : 'border-muted'
                          }`}
                          onClick={() => handleSelectGeneratedImage(image.path)}
                        >
                          <img
                            src={image.url}
                            alt={image.filename}
                            className="w-full h-24 object-cover"
                          />
                          {formData.image === image.path && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <div className="bg-primary text-primary-foreground rounded-full p-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Нажмите на изображение, чтобы выбрать его для главной страницы
                    </p>
                  </div>
                )}
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

            </CardContent>
          </Card>
              <div className="flex gap-4 pt-4">
                <Button onClick={handleSave} disabled={saving || loading} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {saving ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
                <Button variant="outline" onClick={() => setFormData({
                  ...heroContent,
                  image: (heroContent as any).image || ''
                })} disabled={saving}>
                  Сбросить
                </Button>
              </div>
        </div>
      </div>
    </div>
  );
};

// About Section Management
const AboutAdmin = () => {
  const [formData, setFormData] = useState(aboutContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { notifyDataUpdate } = useDataUpdate();

  useEffect(() => {
    const loadAboutData = async () => {
      try {
        const aboutData = await db.getAbout();
        if (aboutData) {
          setFormData({
            title: aboutData.title,
            subtitle: aboutData.subtitle,
            highlights: aboutData.highlights
          });
        }
      } catch (error) {
        console.error('Error loading about data:', error);
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить данные раздела 'Обо мне'",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadAboutData();
  }, [toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await db.updateAbout({
        title: formData.title,
        subtitle: formData.subtitle,
        highlights: formData.highlights
      });
      // Уведомляем о обновлении данных
      notifyDataUpdate('about');
      toast({
        title: "Успешно сохранено",
        description: "Данные раздела 'Обо мне' обновлены",
      });
    } catch (error) {
      console.error('Error saving about data:', error);
      toast({
        title: "Ошибка сохранения",
        description: "Не удалось сохранить данные раздела 'Обо мне'",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNavigation />
        <div className="container mx-auto px-6 py-8 pt-24 md:pt-28">
          <div className="max-w-4xl">
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground">Загрузка данных...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

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

            </CardContent>
          </Card>
              <div className="flex gap-4 pt-4">
                <Button onClick={handleSave} disabled={saving || loading} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {saving ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
                <Button variant="outline" onClick={() => setFormData(aboutContent)} disabled={saving}>
                  Сбросить
                </Button>
              </div>
        </div>
      </div>
    </div>
  );
};

// Testimonials Management
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
            <div className="pt-6">
              <Button onClick={handleAdd} disabled={saving} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Добавить отзыв
              </Button>
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

// Services Management
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
            <div className="pt-6">
              <Button onClick={handleAdd} disabled={saving} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Добавить услугу
              </Button>
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

// Clients Management
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

      <div className="container mx-auto px-6 py-8 pt-24 md:pt-28">
        <Card>
          <CardHeader>
            <CardTitle>Управление сегментами клиентов</CardTitle>
            <CardDescription>
              Добавляйте, редактируйте и удаляйте сегменты целевой аудитории. Сегменты помогают определить, для каких типов клиентов предназначены ваши услуги.
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
            <div className="pt-6">
              <Button onClick={handleAdd} disabled={saving} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
                Добавить сегмент клиентов
              </Button>
            </div>
      </div>
    </div>
  );
};

// Process Management
const ProcessAdmin = () => {
  const [processes, setProcesses] = useState<ProcessStep[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<Partial<ProcessStep>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { notifyDataUpdate } = useDataUpdate();

  useEffect(() => {
    const loadProcesses = async () => {
      try {
        const processesData = await db.getProcessSteps();
        const formattedProcesses: ProcessStep[] = processesData.map(p => ({
          id: parseId(p.id),
          number: p.number,
          title: p.title,
          description: p.description,
          examples: p.examples,
          details: p.details
        }));
        setProcesses(formattedProcesses);
      } catch (error) {
        console.error('Error loading process steps:', error);
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить шаги процесса",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProcesses();
  }, [toast]);

  const handleSave = async (updatedProcess: ProcessStep) => {
    setSaving(true);
    try {
      await db.updateProcessStep(`process-${updatedProcess.id}`, {
        number: updatedProcess.number,
        title: updatedProcess.title,
        description: updatedProcess.description,
        examples: updatedProcess.examples,
        details: updatedProcess.details
      });

      setProcesses(processes.map(p =>
        p.id === updatedProcess.id ? updatedProcess : p
      ));

      // Уведомляем о обновлении данных
      notifyDataUpdate('process');
      toast({
        title: "Успешно сохранено",
        description: "Шаг процесса обновлен",
      });
    } catch (error) {
      console.error('Error saving process step:', error);
      toast({
        title: "Ошибка сохранения",
        description: "Не удалось сохранить шаг процесса",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddStep = () => {
    const maxNumber = processes.length > 0 ? Math.max(...processes.map(p => p.number)) : 0;
    setCurrentStep({
      number: maxNumber + 1,
      title: '',
      description: '',
      examples: [],
      details: []
    });
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const handleEditStep = (step: ProcessStep) => {
    setCurrentStep(step);
    setEditingId(`process-${step.id}`);
    setIsDialogOpen(true);
  };

  const handleSaveStep = async () => {
    setSaving(true);
    try {
      if (editingId) {
        // Update existing step
        const updatedProcess: ProcessStep = {
          id: currentStep.id!,
          number: currentStep.number!,
          title: currentStep.title!,
          description: currentStep.description!,
          examples: currentStep.examples,
          details: currentStep.details
        };

        await handleSave(updatedProcess);
      } else {
        // Create new step
        const newProcessData = {
          number: currentStep.number!,
          title: currentStep.title!,
          description: currentStep.description!,
          examples: currentStep.examples,
          details: currentStep.details
        };

        const newProcess = await db.createProcessStep(newProcessData);

        const formattedProcess: ProcessStep = {
          id: parseId(newProcess.id),
          number: newProcess.number,
          title: newProcess.title,
          description: newProcess.description,
          examples: newProcess.examples,
          details: newProcess.details
        };

        setProcesses([...processes, formattedProcess]);

        toast({
          title: "Успешно добавлено",
          description: "Шаг процесса добавлен",
        });
      }

      setIsDialogOpen(false);
      setCurrentStep({});
      setEditingId(null);
    } catch (error) {
      console.error('Error saving step:', error);
      toast({
        title: "Ошибка сохранения",
        description: "Не удалось сохранить шаг процесса",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStep = async (id: number) => {
    try {
      await db.deleteProcessStep(`process-${id}`);

      // Remove from local state
      const updatedProcesses = processes.filter(p => p.id !== id);
      // Renumber the remaining steps
      const renumberedProcesses = updatedProcesses.map((p, index) => ({
        ...p,
        number: index + 1
      }));

      // Update all remaining steps in database with new numbers
      for (const process of renumberedProcesses) {
        await db.updateProcessStep(`process-${process.id}`, {
          number: process.number,
          title: process.title,
          description: process.description,
          examples: process.examples,
          details: process.details
        });
      }

      setProcesses(renumberedProcesses);

      toast({
        title: "Успешно удалено",
        description: "Шаг процесса удален",
      });
    } catch (error) {
      console.error('Error deleting step:', error);
      toast({
        title: "Ошибка удаления",
        description: "Не удалось удалить шаг процесса",
        variant: "destructive",
      });
    }
  };

  const handleMoveStep = (id: number, direction: 'up' | 'down') => {
    const currentIndex = processes.findIndex(p => p.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= processes.length) return;

    const newProcesses = [...processes];
    // Swap the steps
    [newProcesses[currentIndex], newProcesses[newIndex]] = [newProcesses[newIndex], newProcesses[currentIndex]];

    // Renumber all steps
    const renumberedProcesses = newProcesses.map((p, index) => ({
      ...p,
      number: index + 1
    }));

    setProcesses(renumberedProcesses);
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
                <p className="text-muted-foreground">Загрузка шагов процесса...</p>
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

      <div className="container mx-auto px-6 py-8 pt-24 md:pt-28">
        <div className="max-w-4xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Шаги процесса работы</h2>
              <p className="text-muted-foreground">Управляйте последовательностью шагов в вашем процессе</p>
            </div>
            <Button onClick={handleAddStep} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Добавить шаг
            </Button>
          </div>

          {processes.map((process) => (
            <Card key={process.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      Шаг {process.number}
                    </Badge>
                    <span>{process.title}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMoveStep(process.id, 'up')}
                      disabled={process.number === 1}
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMoveStep(process.id, 'down')}
                      disabled={process.number === processes.length}
                    >
                      ↓
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditStep(process)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteStep(process.id)}
                      disabled={processes.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Редактировать шаг' : 'Добавить шаг'}
              </DialogTitle>
              <DialogDescription>
                {editingId ? 'Измените информацию о шаге процесса' : 'Создайте новый шаг процесса'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stepNumber">Номер шага</Label>
                <Input
                  id="stepNumber"
                  type="number"
                  value={currentStep.number || ''}
                  onChange={(e) => setCurrentStep({ ...currentStep, number: parseInt(e.target.value) || 1 })}
                  placeholder="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stepTitle">Название шага</Label>
                <Input
                  id="stepTitle"
                  value={currentStep.title || ''}
                  onChange={(e) => setCurrentStep({ ...currentStep, title: e.target.value })}
                  placeholder="Введите название шага"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stepDescription">Описание</Label>
                <Textarea
                  id="stepDescription"
                  value={currentStep.description || ''}
                  onChange={(e) => setCurrentStep({ ...currentStep, description: e.target.value })}
                  placeholder="Введите описание шага"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stepExamples">Примеры запросов (каждый с новой строки)</Label>
                <Textarea
                  id="stepExamples"
                  value={currentStep.examples?.join('\n') || ''}
                  onChange={(e) => setCurrentStep({
                    ...currentStep,
                    examples: e.target.value.split('\n').filter(ex => ex.trim())
                  })}
                  placeholder="Пример запроса 1&#10;Пример запроса 2"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stepDetails">Детали (каждая с новой строки)</Label>
                <Textarea
                  id="stepDetails"
                  value={currentStep.details?.join('\n') || ''}
                  onChange={(e) => setCurrentStep({
                    ...currentStep,
                    details: e.target.value.split('\n').filter(d => d.trim())
                  })}
                  placeholder="Деталь 1&#10;Деталь 2"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleSaveStep}>
                {editingId ? 'Сохранить' : 'Добавить'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

// Projects Management
const ProjectsAdmin = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { notifyDataUpdate } = useDataUpdate();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectsData = await db.getProjects();
        const formattedProjects: Project[] = projectsData.map(p => ({
          id: parseId(p.id),
          title: p.title,
          description: p.description,
          category: p.category,
          imageUrl: p.imageUrl,
          link: p.link,
          featured: p.featured
        }));
        setProjects(formattedProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить проекты",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [toast]);

  const handleEdit = (project: Project) => {
    setCurrentProject(project);
    setEditingId(`project-${project.id}`);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setCurrentProject({
      title: '',
      description: '',
      category: '',
      featured: false
    });
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        const updatedProject = await db.updateProject(editingId, {
          title: currentProject.title || '',
          description: currentProject.description || '',
          category: currentProject.category || '',
          imageUrl: currentProject.imageUrl,
          link: currentProject.link,
          featured: currentProject.featured || false
        });

        const formattedProject: Project = {
          id: parseId(updatedProject.id),
          title: updatedProject.title,
          description: updatedProject.description,
          category: updatedProject.category,
          imageUrl: updatedProject.imageUrl,
          link: updatedProject.link,
          featured: updatedProject.featured
        };

        setProjects(projects.map(p =>
          p.id === formattedProject.id ? formattedProject : p
        ));
      } else {
        const newProject = await db.createProject({
          title: currentProject.title || '',
          description: currentProject.description || '',
          category: currentProject.category || '',
          imageUrl: currentProject.imageUrl,
          link: currentProject.link,
          featured: currentProject.featured || false
        });

        const formattedProject: Project = {
          id: parseId(newProject.id),
          title: newProject.title,
          description: newProject.description,
          category: newProject.category,
          imageUrl: newProject.imageUrl,
          link: newProject.link,
          featured: newProject.featured
        };

        setProjects([...projects, formattedProject]);
      }

      setIsDialogOpen(false);
      setCurrentProject({});
      setEditingId(null);

      // Уведомляем о обновлении данных
      notifyDataUpdate('projects');
      toast({
        title: "Успешно сохранено",
        description: editingId ? "Проект обновлен" : "Проект добавлен",
      });
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Ошибка сохранения",
        description: "Не удалось сохранить проект",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await db.deleteProject(`project-${id}`);
      setProjects(projects.filter(p => p.id !== id));
      toast({
        title: "Успешно удалено",
        description: "Проект удален",
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Ошибка удаления",
        description: "Не удалось удалить проект",
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
                <p className="text-muted-foreground">Загрузка проектов...</p>
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

      <div className="container mx-auto px-6 py-8 pt-24 md:pt-28">
        <Card>
          <CardHeader>
            <CardTitle>Управление проектами</CardTitle>
            <CardDescription>
              Добавляйте, редактируйте и удаляйте проекты и кейсы
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Рекомендуемый</TableHead>
                  <TableHead className="w-32">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>{project.category}</TableCell>
                    <TableCell>
                      <Badge variant={project.featured ? "default" : "secondary"}>
                        {project.featured ? "Рекомендуемый" : "Обычный"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(project)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(project.id)}
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
            <div className="pt-6">
              <Button onClick={handleAdd} disabled={saving} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Добавить проект
              </Button>
            </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Редактировать проект' : 'Добавить проект'}
              </DialogTitle>
              <DialogDescription>
                Заполните информацию о проекте
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Название проекта</Label>
                <Input
                  id="title"
                  value={currentProject.title || ''}
                  onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                  placeholder="Введите название проекта"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Категория</Label>
                <Input
                  id="category"
                  value={currentProject.category || ''}
                  onChange={(e) => setCurrentProject({ ...currentProject, category: e.target.value })}
                  placeholder="Введите категорию проекта"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={currentProject.description || ''}
                  onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                  placeholder="Введите описание проекта"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Ссылка на изображение</Label>
                <Input
                  id="imageUrl"
                  value={currentProject.imageUrl || ''}
                  onChange={(e) => setCurrentProject({ ...currentProject, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Ссылка на проект</Label>
                <Input
                  id="link"
                  value={currentProject.link || ''}
                  onChange={(e) => setCurrentProject({ ...currentProject, link: e.target.value })}
                  placeholder="https://example.com/project"
                />
              </div>

              <div className="space-y-2">
                <Label>Рекомендуемый проект</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={currentProject.featured || false}
                    onChange={(e) => setCurrentProject({ ...currentProject, featured: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="featured">Отметить как рекомендуемый</Label>
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

      <div className="container mx-auto px-6 py-8 pt-24 md:pt-28">
        <Card>
          <CardHeader>
            <CardTitle>Управление заявками</CardTitle>
            <CardDescription>
              Просматривайте и управляйте входящими заявками от клиентов
            </CardDescription>
          </CardHeader>
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
            <div className="pt-6">
              <Button onClick={handleAdd} disabled={saving} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Добавить заявку
              </Button>
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

// Главная админ панель с дашбордом
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
      <div className="container mx-auto px-6 py-8 pt-24 md:pt-28">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Управление контентом</h2>
          <p className="text-muted-foreground">Редактируйте содержимое вашего сайта</p>
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

            <Link to="projects">
              <Card className="p-6 hover-elevate cursor-pointer transition-all">
                <FolderOpen className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Проекты</h3>
                <p className="text-muted-foreground">Управление кейсами и проектами</p>
              </Card>
            </Link>

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
  );
};

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

    // Очищаем сессию при каждом роутинге из админ панели на сайт
    const handleRouteChange = () => {
      // Проверяем, уходим ли мы из админки
      if (window.location.pathname && !window.location.pathname.startsWith('/admin')) {
        clearAdminSession();
      }
    };

    // Добавляем слушатель для изменения истории браузера
    const handlePopState = () => {
      handleRouteChange();
    };

    window.addEventListener('popstate', handlePopState);

    // Также проверяем при каждом изменении location
    handleRouteChange();

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
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
            <Route path="admin/projects" component={ProjectsAdmin} />
            <Route path="admin/inquiries" component={InquiriesAdmin} />
            <Route component={Dashboard} />
          </Switch>
        </div>
      </ErrorBoundary>
    </AdminProtectedRoute>
  );
};

export default AdminPage;