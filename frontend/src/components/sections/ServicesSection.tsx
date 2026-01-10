import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface Service {
  id: string;
  title: string;
  examples?: string[];
  description?: string;
  duration?: string;
  price: string;
  cta: string;
  available: boolean;
  featured?: boolean;
}

interface ServicesSectionProps {
  servicesData: Service[];
  scrollToSection: (id: string) => void;
}

export function ServicesSection({ servicesData, scrollToSection }: ServicesSectionProps) {
  const handleServiceClick = (serviceId: string) => {
    // Add service type to URL parameters using the actual service id
    const url = new URL(window.location.href);
    url.searchParams.set('service', serviceId);
    window.history.pushState({}, '', url.toString());

    // Scroll to contact section
    scrollToSection('contact');
  };

  return (
    <section id="services" className="pt-24 md:pt-32 relative">
      <div className="container px-6 md:px-12 max-w-8xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold" data-testid="text-services-title">
            Форматы работы
          </h2>
        </div>

        {/* Desktop version - Grid layout for lg and above */}
        <div className="hidden lg:block space-y-6">
          {servicesData.map((service, index) => {
            const serviceTestIds = ['button-service-consultation', 'button-service-audit', 'button-service-immersion', 'button-service-full-management'];
            return (
              <Card
                key={service.id}
                className={`p-8 hover-elevate transition-all ${service.featured ? 'border-primary/50' : ''}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-semibold">{service.title}</h3>
                      {!service.available && (
                        <Badge variant="secondary">Нет мест</Badge>
                      )}
                    </div>

                    {service.examples && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground font-medium">Примеры:</p>
                        <ul className="space-y-1">
                          {service.examples.map((example, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground">• {example}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {service.description && (
                      <p className="text-base text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    )}

                    {service.duration && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Время:</span> {service.duration}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-start lg:items-end gap-4 lg:min-w-[200px]">
                    <div className="text-3xl font-bold">{service.price}</div>
                    <Button
                      variant={service.available ? "default" : "outline"}
                      disabled={!service.available}
                      onClick={() => handleServiceClick(service.id)}
                      data-testid={serviceTestIds[index] || `button-service-${index}`}
                    >
                      {service.cta}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Mobile/Tablet version - Accordion layout for md and below */}
        <div className="lg:hidden">
          <Accordion type="single" collapsible className="w-full space-y-6">
            {servicesData.map((service, index) => {
              const serviceTestIds = ['button-service-consultation', 'button-service-audit', 'button-service-immersion', 'button-service-full-management'];
              return (
                <AccordionItem
                  key={service.id}
                  value={`service-${service.id}`}
                  className="border px-6 py-2 bg-card hover-elevate transition-all rounded-xl"
                >
                  <AccordionTrigger className="gap-6 py-8 px-4 hover:no-underline [&>svg]:shrink-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3 sm:gap-0">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <h3 className="text-xl font-semibold text-left">{service.title}</h3>
                        {!service.available && (
                          <Badge variant="secondary" className="shrink-0">Нет мест</Badge>
                        )}
                      </div>
                      <Button
                        variant={service.available ? "default" : "outline"}
                        disabled={!service.available}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleServiceClick(service.id);
                        }}
                        data-testid={serviceTestIds[index] || `button-service-${index}`}
                        className="self-start sm:self-auto shrink-0 w-fit"
                      >
                        {service.cta}
                      </Button>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-8">
                    <div className="space-y-6 pt-4 border-t">
                      <div className="text-3xl font-bold text-primary">{service.price}</div>

                      {service.examples && (
                        <div className="space-y-3">
                          <p className="text-base text-muted-foreground font-medium">Примеры:</p>
                          <ul className="space-y-2 pl-4">
                            {service.examples.map((example, idx) => (
                              <li key={idx} className="text-base text-muted-foreground leading-relaxed">• {example}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {service.description && (
                        <p className="text-base text-muted-foreground leading-relaxed">
                          {service.description}
                        </p>
                      )}

                      {service.duration && (
                        <p className="text-base text-muted-foreground">
                          <span className="font-medium">Время:</span> {service.duration}
                        </p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        <div className="mt-16 text-center space-y-6">
          <p className="text-lg text-muted-foreground">
            Есть вопрос? Пиши - обсудим за чашкой онлайн-чая
          </p>
          <Button size="lg" onClick={() => scrollToSection('contact')} data-testid="button-discuss">
            Обсудить проект <MessageCircle className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
