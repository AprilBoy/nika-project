import { useState, useEffect } from 'react';

// Типы данных
export interface HeroData {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  primaryCTA: string;
  secondaryCTA: string;
  telegramLink: string;
}

export interface AboutData {
  title: string;
  subtitle: string;
  highlights: string[];
}

export interface ProcessStep {
  id: string;
  number: number;
  title: string;
  description: string;
  examples?: string[];
  details?: string[];
}

export interface ClientSegment {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface Service {
  id: string;
  title: string;
  price: string;
  duration?: string;
  description?: string;
  examples?: string[];
  cta: string;
  available: boolean;
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  link?: string;
  featured: boolean;
}

// API base URL
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001';

// Хук для загрузки данных из API
export const useDatabaseData = () => {
  // Начальные значения для предотвращения ошибок рендеринга
  const [heroData, setHeroData] = useState<HeroData>({
    badge: "15+ лет опыта в управлении",
    title: "Ника Шихлинская",
    subtitle: "Системный операционный партнер",
    description: "Превращаю хаос в работающие процессы | Запускаю проекты, строю команды, чиню что сломано | Позабочусь о ваших интересах, как о своих",
    primaryCTA: "Связаться",
    secondaryCTA: "Онлайн-консультация",
    telegramLink: "https://t.me/yourusername"
  });

  const [aboutData, setAboutData] = useState<AboutData>({
    title: "Кто я?",
    subtitle: "Системный операционный партнер, который превращает хаос в вашем бизнесе/инфобизнесе в работающую машину - быстро, с заботой и без драмы",
    highlights: [
      "Опыт в сфере управления персонала (руководитель HR-команд) более 6 лет",
      "Руковожу онлайн-школами, проектами и продуктами более 5 лет",
      "Наибольшее кол-во подчиненных в команде - 50 человек",
      "Обучалась у всех лидеров и топов рынка (Гребенюк, Тимочко, Дымшаков и другие)"
    ]
  });

  const [processData, setProcessData] = useState<ProcessStep[]>([]);
  const [clientData, setClientData] = useState<ClientSegment[]>([]);
  const [servicesData, setServicesData] = useState<Service[]>([]);
  const [testimonialsData, setTestimonialsData] = useState<Testimonial[]>([]);
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Загружаем данные параллельно
        const [
          heroResponse,
          aboutResponse,
          processResponse,
          clientResponse,
          servicesResponse,
          testimonialsResponse,
          projectsResponse
        ] = await Promise.allSettled([
          fetch(`${API_BASE_URL}/api/hero`),
          fetch(`${API_BASE_URL}/api/about`),
          fetch(`${API_BASE_URL}/api/process-steps`),
          fetch(`${API_BASE_URL}/api/client-segments`),
          fetch(`${API_BASE_URL}/api/services`),
          fetch(`${API_BASE_URL}/api/testimonials`),
          fetch(`${API_BASE_URL}/api/projects`)
        ]);

        // Обрабатываем ответы
        if (heroResponse.status === 'fulfilled' && heroResponse.value.ok) {
          const hero = await heroResponse.value.json();
          if (hero) {
            setHeroData(hero);
          }
        }

        if (aboutResponse.status === 'fulfilled' && aboutResponse.value.ok) {
          const about = await aboutResponse.value.json();
          if (about) {
            setAboutData(about);
          }
        }

        if (processResponse.status === 'fulfilled' && processResponse.value.ok) {
          const process = await processResponse.value.json();
          if (Array.isArray(process)) {
            setProcessData(process);
          }
        }

        if (clientResponse.status === 'fulfilled' && clientResponse.value.ok) {
          const clients = await clientResponse.value.json();
          if (Array.isArray(clients)) {
            setClientData(clients);
          }
        }

        if (servicesResponse.status === 'fulfilled' && servicesResponse.value.ok) {
          const services = await servicesResponse.value.json();
          if (Array.isArray(services)) {
            setServicesData(services);
          }
        }

        if (testimonialsResponse.status === 'fulfilled' && testimonialsResponse.value.ok) {
          const testimonials = await testimonialsResponse.value.json();
          if (Array.isArray(testimonials)) {
            setTestimonialsData(testimonials);
          }
        }

        if (projectsResponse.status === 'fulfilled' && projectsResponse.value.ok) {
          const projects = await projectsResponse.value.json();
          if (Array.isArray(projects)) {
            setProjectsData(projects);
          }
        }

      } catch (error) {
        console.error('Error loading data from API:', error);
        // В случае ошибки API оставляем начальные значения
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    heroData,
    aboutData,
    processData,
    clientData,
    servicesData,
    testimonialsData,
    projectsData,
    loading
  };
};
