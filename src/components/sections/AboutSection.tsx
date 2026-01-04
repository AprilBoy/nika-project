import { CheckCircle2 } from "lucide-react";

interface AboutSectionProps {
  aboutData: {
    title: string;
    subtitle: string;
    highlights: string[];
    image?: string;
  };
}

export function AboutSection({ aboutData }: AboutSectionProps) {
  return (
    <section id="about" className="pt-24 md:pt-32 relative">
      <div className="container px-6 md:px-12 max-w-8xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold" data-testid="text-about-title">
            {aboutData.title}
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {aboutData.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="relative h-[500px] md:h-[600px] hidden lg:block">
            <img
              src={aboutData.image}
              alt="Ника Шихлинская в работе"
              className="w-full h-full object-cover object-[25%_100%]"
              style={{
                maskImage: 'linear-gradient(to bottom, rgba(34, 197, 94, 0.9) 50%, transparent 95%)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(34, 197, 94, 0.9) 50%, transparent 95%)'
              }}
            />
          </div>
          <div className="space-y-6">
            {aboutData.highlights.map((highlight, index) => (
              <div key={index} className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <p className="text-base md:text-lg leading-relaxed">{highlight}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
