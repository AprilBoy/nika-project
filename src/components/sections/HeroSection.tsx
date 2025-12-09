import { MessageCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeroSectionProps {
  heroData: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    primaryCTA: string;
    secondaryCTA: string;
    telegramLink: string;
    image?: string;
  };
  scrollToSection: (id: string) => void;
}

export function HeroSection({ heroData, scrollToSection }: HeroSectionProps) {
  return (
    <section id="hero" className="relative h-[824px] flex items-center justify-center overflow-hidden pt-20">

      <div className="container relative z-10 px-6 md:px-12 max-w-8xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image for mobile (< 1024px) */}
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <Badge className="text-sm px-4 py-2" variant="outline" data-testid="badge-experience">
                {heroData.badge}
              </Badge>
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight" data-testid="text-hero-title">
                  {heroData.title}
                </h1>
                <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-primary leading-tight">
                  {heroData.subtitle}
                </p>
              </div>
              <p className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-2xl">
                {heroData.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                data-testid="button-contact"
                onClick={() => window.open(heroData.telegramLink, '_blank')}
              >
                {heroData.primaryCTA} <MessageCircle className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                data-testid="button-consultation"
                onClick={() => scrollToSection('services')}
              >
                {heroData.secondaryCTA}
              </Button>
            </div>
          </div>

          {/* Right Image for desktop (>= 1024px) */}
          <div className="relative lg:h-[800px] h-[150px] rounded-2xl overflow-hidden hidden lg:block">
            <img
              src={heroData.image}
              alt="Ника Шихлинская - Системный операционный партнер"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={() => scrollToSection('about')}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 -translate-y-2/3 animate-bounce hidden lg:block z-20 cursor-pointer"
        data-testid="button-scroll-down"
      >
        <ChevronDown className="h-16 w-16 text-muted-foreground" />
      </button>
    </section>
  );
}
