import { Card, CardContent } from '@/components/ui/card';

interface ProcessStep {
  number: number;
  title: string;
  description: string;
  examples?: string[];
  details?: string[];
}

interface ProcessSectionProps {
  processData: ProcessStep[];
}

export function ProcessSection({ processData }: ProcessSectionProps) {
  return (
    <section id="process" className="py-24 md:py-32 relative">
      <div className="container px-6 md:px-12 max-w-8xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold" data-testid="text-process-title">
            Как я работаю
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Пошаговый процесс от знакомства до результата
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {processData.map((step) => (
            <Card key={step.number} className="p-6 relative hover-elevate transition-all">
              <div className="absolute top-4 right-4 text-5xl font-bold opacity-10">{step.number}</div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold pr-8">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
                {step.examples && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-medium">Примеры запросов:</p>
                    <ul className="space-y-1">
                      {step.examples.map((example, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground">• {example}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {step.details && (
                  <ul className="space-y-1">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="text-xs text-muted-foreground">• {detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-6 md:p-8 bg-muted/50 rounded-xl">
          <p className="text-sm md:text-base text-muted-foreground text-center leading-relaxed">
            Разумеется, шаги прописаны условно и в каждом из них есть еще миллион шажочков, прыжочков и других интересных упражнений.
            Поэтому рекомендую каждый запрос обсуждать точечно.
          </p>
        </div>
      </div>
    </section>
  );
}
