import { Card } from "@/components/ui/card";
import { Users, Target, TrendingUp, Building, Factory, ShoppingCart, Globe, Heart, GraduationCap, Stethoscope, Truck, Coffee, Wrench } from "lucide-react";

interface ClientSegment {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

interface ClientsSectionProps {
  clientData: ClientSegment[];
}

export function ClientsSection({ clientData }: ClientsSectionProps) {
  const getIconComponent = (iconName?: string) => {
    const iconMap: { [key: string]: any } = {
      Users,
      Target,
      TrendingUp,
      Building,
      Factory,
      ShoppingCart,
      Globe,
      Heart,
      GraduationCap,
      Stethoscope,
      Truck,
      Coffee,
      Wrench
    };

    return iconMap[iconName || 'Users'] || Users;
  };

  return (
    <section id="clients" className="py-24 md:py-32 relative">
      <div className="container px-6 md:px-12 max-w-8xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold" data-testid="text-clients-title">
            С кем я работаю
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {clientData.map((segment, index) => {
            const Icon = getIconComponent(segment.icon);
            return (
              <Card key={segment.id || index} className="p-8 hover-elevate transition-all">
                <Icon className="h-12 w-12 text-primary mb-6" />
                <h3 className="text-xl font-semibold mb-4">{segment.title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {segment.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
