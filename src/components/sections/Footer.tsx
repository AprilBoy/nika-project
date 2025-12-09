import { MessageCircle } from "lucide-react";
import { Link } from "wouter";

interface FooterProps {
  heroData: {
    telegramLink: string;
  };
  servicesData: Array<{
    title: string;
    examples?: string[];
    description?: string;
    duration?: string;
    price: string;
    cta: string;
    available: boolean;
    featured?: boolean;
  }>;
  scrollToSection: (id: string) => void;
}

export function Footer({ heroData, servicesData, scrollToSection }: FooterProps) {
  return (
    <footer className="py-16 relative">
      <div className="container px-6 md:px-12 max-w-8xl mx-auto relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-primary">Ника Шихлинская</h3>
            <p className="text-sm text-muted-foreground">
              Системный операционный партнер
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Услуги</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {servicesData.map((service, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection('services')}
                    className="hover:text-primary transition-colors"
                    data-testid={`link-footer-service-${index}`}
                  >
                    {service.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Информация</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => scrollToSection('about')} className="hover:text-primary transition-colors" data-testid="link-footer-about">Обо мне</button></li>
              <li><button onClick={() => scrollToSection('process')} className="hover:text-primary transition-colors" data-testid="link-footer-process">Как я работаю</button></li>
              <li><button onClick={() => scrollToSection('contact')} className="hover:text-primary transition-colors" data-testid="link-footer-contact">Контакты</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a  target="_blank" href={heroData.telegramLink} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2" data-testid="link-footer-telegram">
                  <MessageCircle className="h-4 w-4" /> Telegram
                </a>
              </li>
              <li>
                <Link href="/admin/" className="text-muted-foreground hover:text-primary transition-colors text-xs opacity-50" data-testid="link-footer-admin">
                  Админ панель
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 Ника Шихлинская. Все права защищены.</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <a href="#" className="hover:text-primary transition-colors" data-testid="link-footer-ip">ИП Шихлинская</a>
              <a href="#" className="hover:text-primary transition-colors" data-testid="link-footer-offer">Оферта</a>
              <a href="#" className="hover:text-primary transition-colors" data-testid="link-footer-consent">Согласие на обработку</a>
              <a href="#" className="hover:text-primary transition-colors" data-testid="link-footer-privacy">Политика конфиденциальности</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
