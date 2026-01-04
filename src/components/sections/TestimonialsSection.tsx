import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import testimonial1 from "@assets/generated_images/Testimonial_client_1_1f5ec992.png";
import testimonial2 from "@assets/generated_images/Testimonial_client_2_53a04a52.png";
import testimonial3 from "@assets/generated_images/Testimonial_client_3_47405afd.png";

const testimonialImages = [testimonial1, testimonial2, testimonial3];

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
}

interface TestimonialsSectionProps {
  testimonialsData: Testimonial[];
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  return (
    <Card
      className="p-8 hover-elevate transition-all h-full cursor-pointer"
    >
      <div className="flex items-start gap-4 mb-6">
        <Avatar className="w-16 h-16 border-2 border-primary/20">
          <AvatarImage src={testimonialImages[index % testimonialImages.length]} alt={testimonial.name} />
          <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-base">{testimonial.name}</p>
          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
          <p className="text-xs text-muted-foreground">{testimonial.company}</p>
        </div>
      </div>
      <p className="text-base text-muted-foreground italic leading-relaxed">
        "{testimonial.quote}"
      </p>
    </Card>
  );
}

export function TestimonialsSection({ testimonialsData }: TestimonialsSectionProps) {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section id="testimonials" className="pt-24 md:pt-32 relative">
      <div className="container px-6 md:px-12 max-w-8xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold" data-testid="text-testimonials-title">
            Отзывы
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Результаты моей работы говорят сами за себя
          </p>
        </div>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonialsData.map((testimonial, index) => (
                <CarouselItem key={testimonial.id || index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <TestimonialCard
                    testimonial={testimonial}
                    index={index}
                   
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" size="lg" data-testid="button-all-cases">
            Все отзывы <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
