import { useState, useEffect, useCallback } from 'react';
import { useDataUpdate, DataType } from '@/components/data-update-context';

// Типы данных
export interface HeroData {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  primaryCTA: string;
  secondaryCTA: string;
  telegramLink: string;
  image?: string;
}

export interface AboutData {
  title: string;
  subtitle: string;
  highlights: string[];
  image?: string;
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
  status?: string;
}

// API base URL
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001';

// Хук для загрузки данных из API
export const useDatabaseData = () => {
  const { subscribeToUpdates } = useDataUpdate();

  // Начальные значения для предотвращения ошибок рендеринга
  const [heroData, setHeroData] = useState<HeroData>({
    badge: "15+ лет опыта в управлении",
    title: "Ника Шихлинская",
    subtitle: "Системный операционный партнер",
    description: "Превращаю хаос в работающие процессы | Запускаю проекты, строю команды, чиню что сломано | Позабочусь о ваших интересах, как о своих",
    primaryCTA: "Связаться",
    secondaryCTA: "Онлайн-консультация",
    telegramLink: "https://t.me/nikashikh",
    image: "assets/images/IMG_6236.png"
  });

  const [aboutData, setAboutData] = useState<AboutData>({
    title: "Кто я?",
    subtitle: "Системный операционный партнер, который превращает хаос в вашем бизнесе/инфобизнесе в работающую машину - быстро, с заботой и без драмы",
    highlights: [
      "Опыт в сфере управления персонала (руководитель HR-команд) более 6 лет",
      "Руковожу онлайн-школами, проектами и продуктами более 5 лет",
      "Наибольшее кол-во подчиненных в команде - 50 человек",
      "Обучалась у всех лидеров и топов рынка (Гребенюк, Тимочко, Дымшаков и другие)"
    ],
    image: "assets/images/IMG_6310.png"
  });

  const [processData, setProcessData] = useState<ProcessStep[]>([]);
  const [clientData, setClientData] = useState<ClientSegment[]>([]);
  const [servicesData, setServicesData] = useState<Service[]>([]);
  const [testimonialsData, setTestimonialsData] = useState<Testimonial[]>([]);
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Функция для загрузки всех данных
  const loadAllData = useCallback(async () => {
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
  }, []);

  // Функция для загрузки конкретных данных по типу
  const loadDataByType = useCallback(async (dataType: DataType) => {
    try {
      switch (dataType) {
        case 'hero':
          const heroResponse = await fetch(`${API_BASE_URL}/api/hero`);
          if (heroResponse.ok) {
            const hero = await heroResponse.json();
            if (hero) setHeroData(hero);
          }
          break;
        case 'about':
          const aboutResponse = await fetch(`${API_BASE_URL}/api/about`);
          if (aboutResponse.ok) {
            const about = await aboutResponse.json();
            if (about) setAboutData(about);
          }
          break;
        case 'process':
          const processResponse = await fetch(`${API_BASE_URL}/api/process-steps`);
          if (processResponse.ok) {
            const process = await processResponse.json();
            if (Array.isArray(process)) setProcessData(process);
          }
          break;
        case 'clients':
          const clientResponse = await fetch(`${API_BASE_URL}/api/client-segments`);
          if (clientResponse.ok) {
            const clients = await clientResponse.json();
            if (Array.isArray(clients)) setClientData(clients);
          }
          break;
        case 'services':
          const servicesResponse = await fetch(`${API_BASE_URL}/api/services`);
          if (servicesResponse.ok) {
            const services = await servicesResponse.json();
            if (Array.isArray(services)) setServicesData(services);
          }
          break;
        case 'testimonials':
          const testimonialsResponse = await fetch(`${API_BASE_URL}/api/testimonials`);
          if (testimonialsResponse.ok) {
            const testimonials = await testimonialsResponse.json();
            if (Array.isArray(testimonials)) setTestimonialsData(testimonials);
          }
          break;
        case 'projects':
          const projectsResponse = await fetch(`${API_BASE_URL}/api/projects`);
          if (projectsResponse.ok) {
            const projects = await projectsResponse.json();
            if (Array.isArray(projects)) setProjectsData(projects);
          }
          break;
        case 'all':
          await loadAllData();
          break;
      }
    } catch (error) {
      console.error(`Error loading ${dataType} data:`, error);
    }
  }, [loadAllData]);

  // Загружаем данные при первом рендере
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Подписываемся на обновления данных
  useEffect(() => {
    const unsubscribe = subscribeToUpdates((dataType) => {
      console.log(`Data update notification received for: ${dataType}`);
      loadDataByType(dataType);
    });

    return unsubscribe;
  }, [subscribeToUpdates, loadDataByType]);

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
