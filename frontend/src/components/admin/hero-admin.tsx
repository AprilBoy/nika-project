import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AdminNavigation } from '@/components/admin-navigation';
import { useDataUpdate } from '@/components/data-update-context';
import { Save } from 'lucide-react';

// Импорт данных из content.ts
import { heroContent } from '@/data/content';

// Импорт базы данных
import { db } from '@/lib/database';

const HeroAdmin = () => {
  const [formData, setFormData] = useState({
    ...heroContent,
    image: (heroContent as any).image || ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<{path: string; url: string; filename: string}[]>([]);
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

      <div className="container mx-auto px-4 sm:px-6 py-8 pt-24 md:pt-28">
        <div className="max-w-4xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Редактирование главной страницы</h2>
              <p className="text-muted-foreground text-sm sm:text-base">Измените текст и настройки главной страницы вашего сайта</p>
            </div>
            <Button onClick={handleSave} disabled={saving || loading} className="flex items-center gap-2 w-full sm:w-auto">
              <Save className="h-4 w-4" />
              {saving ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
          </div>

          <Card>
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
        </div>
      </div>
    </div>
  );
};

export default HeroAdmin;
