import { ArrowRight, Users, Target, TrendingUp, CheckCircle2, MessageCircle, ChevronDown, FolderOpen, Eye, Building, Factory, ShoppingCart, Globe, Heart, GraduationCap, Stethoscope, Truck, Coffee, Wrench } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Navigation } from "@/components/navigation";
import { useDatabaseData } from "@/hooks/useDatabaseData";
import { ContactForm } from "@/components/contact-form";

import heroImage from "@assets/generated_images/Nika_hero_portrait_5a7bc603.png";
import aboutImage from "@assets/generated_images/Nika_about_photo_a0be6d9d.png";
import testimonial1 from "@assets/generated_images/Testimonial_client_1_1f5ec992.png";
import testimonial2 from "@assets/generated_images/Testimonial_client_2_53a04a52.png";
import testimonial3 from "@assets/generated_images/Testimonial_client_3_47405afd.png";

const testimonialImages = [testimonial1, testimonial2, testimonial3];

export default function Home() {
  const {
    heroData,
    aboutData,
    processData,
    clientData,
    servicesData,
    testimonialsData,
    projectsData,
    loading
  } = useDatabaseData();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

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
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        
        <div className="container relative z-10 px-6 md:px-12 max-w-7xl mx-auto py-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="text-sm px-4 py-2" variant="secondary" data-testid="badge-experience">
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
                  {heroData.secondaryCTA} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative lg:h-[500px] h-[350px] rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Ника Шихлинская - Системный операционный партнер" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={() => scrollToSection('about')}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
          data-testid="button-scroll-down"
        >
          <ChevronDown className="h-8 w-8 text-muted-foreground" />
        </button>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 md:py-32 bg-muted/30">
        <div className="container px-6 md:px-12 max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold" data-testid="text-about-title">
              {aboutData.title}
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              {aboutData.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              {aboutData.highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <p className="text-base md:text-lg leading-relaxed">{highlight}</p>
                </div>
              ))}
            </div>

            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={aboutImage} 
                alt="Ника Шихлинская в работе" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How I Work Section */}
      <section id="process" className="py-24 md:py-32">
        <div className="container px-6 md:px-12 max-w-6xl mx-auto">
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

      {/* Who I Work With Section */}
      <section id="clients" className="py-24 md:py-32 bg-muted/30">
        <div className="container px-6 md:px-12 max-w-6xl mx-auto">
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

      {/* Services Section */}
      <section id="services" className="py-24 md:py-32">
        <div className="container px-6 md:px-12 max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold" data-testid="text-services-title">
              Форматы работы
            </h2>
          </div>

          <div className="space-y-6">
            {servicesData.map((service, index) => {
              const serviceTestIds = ['button-service-consultation', 'button-service-audit', 'button-service-immersion', 'button-service-full-management'];
              return (
                <Card 
                  key={index} 
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

      {/* Projects Section */}
      <section id="projects" className="py-24 md:py-32">
        <div className="container px-6 md:px-12 max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold" data-testid="text-projects-title">
              Проекты и кейсы
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Примеры моей работы с клиентами
            </p>
          </div>

          {projectsData.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projectsData.filter(project => project.featured).map((project) => (
                <Card key={project.id} className="hover-elevate transition-all overflow-hidden">
                  {project.imageUrl && (
                    <div className="aspect-video bg-muted overflow-hidden">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Badge variant="secondary" className="mb-2">{project.category}</Badge>
                        <h3 className="text-xl font-semibold">{project.title}</h3>
                      </div>
                      <p className="text-muted-foreground line-clamp-3">
                        {project.description}
                      </p>
                      {project.link && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.link} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4 mr-2" />
                            Посмотреть
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Кейсы находятся в разработке. Скоро здесь появятся примеры моей работы.
              </p>
            </div>
          )}

          {projectsData.length > 0 && (
            <div className="mt-16 text-center">
              <Button variant="outline" size="lg">
                <FolderOpen className="h-4 w-4 mr-2" />
                Все проекты
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 md:py-32 bg-muted/30">
        <div className="container px-6 md:px-12 max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold" data-testid="text-testimonials-title">
              Отзывы и кейсы
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Результаты моей работы говорят сами за себя
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonialsData.map((testimonial, index) => (
              <Card
                key={testimonial.id || index}
                className={`p-8 hover-elevate transition-all ${
                  index === 1 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
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
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button variant="outline" size="lg" data-testid="button-all-cases">
              Все кейсы <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 md:py-32 bg-muted/30">
        <div className="container px-6 md:px-12 max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold">
              Готовы начать работу?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Расскажите о вашем проекте, и мы обсудим, как я могу помочь вам достичь целей
            </p>
          </div>

          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-card border-t">
        <div className="container px-6 md:px-12 max-w-6xl mx-auto">
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
                <li><button onClick={() => scrollToSection('services')} className="hover:text-primary transition-colors" data-testid="link-footer-consultations">Консультации</button></li>
                <li><button onClick={() => scrollToSection('services')} className="hover:text-primary transition-colors" data-testid="link-footer-audit">Аудит проекта</button></li>
                <li><button onClick={() => scrollToSection('services')} className="hover:text-primary transition-colors" data-testid="link-footer-immersion">Погружение</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Информация</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-primary transition-colors" data-testid="link-footer-about">О методе</button></li>
                <li><button onClick={() => scrollToSection('projects')} className="hover:text-primary transition-colors" data-testid="link-footer-projects">Проекты</button></li>
                <li><button onClick={() => scrollToSection('process')} className="hover:text-primary transition-colors" data-testid="link-footer-process">Как я работаю</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-primary transition-colors" data-testid="link-footer-contact">Контакты</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href={heroData.telegramLink} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2" data-testid="link-footer-telegram">
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
    </div>
  );
}
