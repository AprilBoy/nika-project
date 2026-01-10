import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, navigate] = useLocation();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 404 Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

        <div className="container relative z-10 px-6 md:px-12 max-w-4xl mx-auto py-12">
          <div className="text-center space-y-8">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <AlertCircle className="h-24 w-24 md:h-32 md:w-32 text-primary/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-primary">
                  404
                </h1>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold">
                  Страница не найдена
                </h2>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  К сожалению, запрашиваемая страница не существует или была перемещена.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  onClick={handleGoHome}
                  className="min-w-[200px]"
                >
                  <Home className="mr-2 h-5 w-5" />
                  На главную
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleGoBack}
                  className="min-w-[200px]"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Назад
                </Button>
              </div>

              {/* Additional info */}
              <div className="pt-8 border-t border-border/50 max-w-md mx-auto">
                <p className="text-sm text-muted-foreground">
                  Если вы считаете, что это ошибка, пожалуйста, свяжитесь с нами.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
