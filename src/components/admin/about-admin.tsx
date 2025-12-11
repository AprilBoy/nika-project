import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AdminNavigation } from '@/components/admin-navigation';
import { useDataUpdate } from '@/components/data-update-context';
import { Save, Plus, Trash2 } from 'lucide-react';

// Импорт данных из content.ts
import { aboutContent } from '@/data/content';

// Импорт базы данных
import { db } from '@/lib/database';

const AboutAdmin = () => {
  const [formData, setFormData] = useState({
    ...aboutContent,
    image: (aboutContent as any).image || ''
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
    const loadAboutData = async () => {
      try {
        const aboutData = await db.getAbout();
        if (aboutData) {
          setFormData({
            title: aboutData.title,
            subtitle: aboutData.subtitle,
            highlights: aboutData.highlights,
            image: aboutData.image || ''
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
    loadGeneratedImages();
  }, [toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await db.updateAbout({
        title: formData.title,
        subtitle: formData.subtitle,
        highlights: formData.highlights,
        image: formData.image
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
      const result = await db.uploadAboutImage(file);
      const newFormData = { ...formData, image: result.imagePath };
      setFormData(newFormData);

      // Automatically save the about data after image upload
      await db.updateAbout({
        title: newFormData.title,
        subtitle: newFormData.subtitle,
        highlights: newFormData.highlights,
        image: newFormData.image
      });

      // Уведомляем о обновлении данных
      notifyDataUpdate('about');

      toast({
        title: "Изображение загружено и сохранено",
        description: "Изображение раздела 'Обо мне' успешно обновлено и сохранено",
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

      <div className="container mx-auto px-4 sm:px-6 py-8 pt-24 md:pt-28">
        <div className="max-w-4xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Редактирование раздела "Обо мне"</h2>
              <p className="text-muted-foreground text-sm sm:text-base">Измените информацию о себе и ключевые достижения</p>
            </div>
            <div className="flex gap-4">
              <Button onClick={handleSave} disabled={saving || loading} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {saving ? 'Сохранение...' : 'Сохранить изменения'}
              </Button>
              <Button variant="outline" onClick={() => setFormData(aboutContent)} disabled={saving}>
                Сбросить
              </Button>
            </div>
          </div>

          <Card>
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

              <div className="space-y-2">
                <Label>Изображение раздела "Обо мне"</Label>
                <div className="space-y-4">
                  {formData.image && (
                    <div className="relative w-48 h-32 rounded-lg overflow-hidden border">
                      <img
                        src={formData.image}
                        alt="Текущее изображение раздела 'Обо мне'"
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
                    Выберите изображение для раздела "Обо мне". Рекомендуемый размер: 800x600px. Максимальный размер файла: 5MB.
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
                      Нажмите на изображение, чтобы выбрать его для раздела "Обо мне"
                    </p>
                  </div>
                )}
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
        </div>
      </div>
    </div>
  );
};

export default AboutAdmin;
