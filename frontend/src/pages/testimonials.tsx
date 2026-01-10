import { Navigation } from "@/components/navigation";
import { useAppData } from "@/components/data-update-context";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Footer } from "@/components/sections/Footer";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
}

export default function TestimonialsPage() {
  const { testimonialsData, heroData, servicesData, loading } = useAppData();
  const [, navigate] = useLocation();

  const scrollToSection = (id: string) => {
    // Navigate to home page with hash for section
    navigate(`/#${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{
        background: 'linear-gradient(to bottom right, #015645, #022620, #4e6534, #141e13)'
      }}>
        <Navigation />
        <div className="container px-6 md:px-12 max-w-8xl mx-auto pt-32 pb-16">
          <div className="text-center">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(to bottom right, #015645, #022620, #4e6534, #141e13)'
      }}
    >
      <Navigation />

      <div className="container px-6 md:px-12 max-w-8xl mx-auto pt-32 pb-16">
        <div className="mb-8">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/')}
            data-testid="button-back-home"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            На главную
          </Button>
        </div>

        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white">
            Все отзывы
          </h1>
        </div>

        <div className="grid gap-6 md:gap-8 md:grid-cols-2">
          {testimonialsData.map((testimonial: Testimonial, index: number) => (
            <Card
              key={testimonial.id || index}
              className="p-8 backdrop-blur-sm hover-elevate transition-all"
            >
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4 md:min-w-[250px]">
                  <Avatar className="w-16 h-16 border-2 border-primary/20 flex-shrink-0">
                    <AvatarFallback className="text-primary font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-lg text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                  </div>
                </div>

                <div className="flex-1 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                  <blockquote className="text-base text-muted-foreground italic leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {testimonialsData.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/80 text-lg">Отзывы загружаются...</p>
          </div>
        )}
      </div>

      {!loading && (
        <Footer heroData={heroData} servicesData={servicesData} scrollToSection={scrollToSection} />
      )}
    </div>
  );
}
