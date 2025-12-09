import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AdminNavigation } from '@/components/admin-navigation';
import { useDataUpdate } from '@/components/data-update-context';
import { Plus, Edit, Trash2 } from 'lucide-react';

// Импорт базы данных
import { db } from '@/lib/database';

// Типы данных
interface ProcessStep {
  id: number;
  number: number;
  title: string;
  description: string;
  examples?: string[];
  details?: string[];
}

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
          id: parseInt(p.id.split('-')[1]), // parseId function
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
          id: parseInt(newProcess.id.split('-')[1]),
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

      <div className="container mx-auto px-4 sm:px-6 py-8 pt-24 md:pt-28">
        <div className="max-w-4xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Шаги процесса работы</h2>
              <p className="text-muted-foreground text-sm sm:text-base">Управляйте последовательностью шагов в вашем процессе</p>
            </div>
            <Button onClick={handleAddStep} className="flex items-center gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              Добавить шаг
            </Button>
          </div>

          {processes.map((process) => (
            <Card key={process.id}>
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                    <Badge variant="outline" className="text-sm sm:text-lg px-2 sm:px-3 py-1 shrink-0">
                      Шаг {process.number}
                    </Badge>
                    <span className="truncate text-sm sm:text-base">{process.title}</span>
                  </div>
                  <div className="flex gap-1 sm:gap-2 shrink-0">
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
          <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
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

export default ProcessAdmin;
