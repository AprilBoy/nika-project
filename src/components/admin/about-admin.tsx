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
