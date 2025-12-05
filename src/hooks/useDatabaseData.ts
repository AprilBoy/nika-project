import { useState, useEffect } from 'react';
import { db } from '@/lib/database';
import { heroContent, aboutContent, processSteps, clientSegments, serviceFormats, testimonials } from '@/data/content';

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
  id: number;
  number: number;
  title: string;
  description: string;
  examples?: string[];
  details?: string[];
}

export interface ClientSegment {
  id: number;
  title: string;
  description: string;
}

export interface Service {
  id: number;
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
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  link?: string;
  featured: boolean;
}

// Хук для загрузки данных из базы данных
export const useDatabaseData = () => {
  const [heroData, setHeroData] = useState<HeroData>(heroContent);
  const [aboutData, setAboutData] = useState<AboutData>(aboutContent);
  const [processData, setProcessData] = useState<ProcessStep[]>([]);
  const [clientData, setClientData] = useState<ClientSegment[]>([]);
  const [servicesData, setServicesData] = useState<Service[]>([]);
  const [testimonialsData, setTestimonialsData] = useState<Testimonial[]>([]);
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Загружаем hero данные
        const hero = await db.getHero();
        if (hero) {
          setHeroData({
            badge: hero.badge,
            title: hero.title,
            subtitle: hero.subtitle,
            description: hero.description,
            primaryCTA: hero.primaryCTA,
            secondaryCTA: hero.secondaryCTA,
            telegramLink: hero.telegramLink
          });
        }

        // Загружаем about данные
        const about = await db.getAbout();
        if (about) {
          setAboutData({
            title: about.title,
            subtitle: about.subtitle,
            highlights: about.highlights
          });
        }

        // Загружаем process steps
        const processes = await db.getProcessSteps();
        if (processes.length > 0) {
          setProcessData(processes.map(p => ({
            id: parseInt(p.id.split('-')[1]),
            number: p.number,
            title: p.title,
            description: p.description,
            examples: p.examples,
            details: p.details
          })));
        } else {
          setProcessData(processSteps);
        }

        // Загружаем client segments
        const clients = await db.getClientSegments();
        if (clients.length > 0) {
          setClientData(clients.map(c => ({
            id: parseInt(c.id.split('-')[1]),
            title: c.title,
            description: c.description
          })));
        } else {
          setClientData(clientSegments);
        }

        // Загружаем services
        const services = await db.getServices();
        if (services.length > 0) {
          setServicesData(services.map(s => ({
            id: parseInt(s.id.split('-')[1]),
            title: s.title,
            price: s.price,
            duration: s.duration,
            description: s.description,
            examples: s.examples,
            cta: s.cta,
            available: s.available,
            featured: s.featured
          })));
        } else {
          setServicesData(serviceFormats);
        }

        // Загружаем testimonials
        const testimonialsList = await db.getTestimonials();
        if (testimonialsList.length > 0) {
          setTestimonialsData(testimonialsList.map(t => ({
            id: parseInt(t.id.split('-')[1]),
            name: t.name,
            role: t.role,
            company: t.company,
            quote: t.quote
          })));
        } else {
          setTestimonialsData(testimonials);
        }

        // Загружаем projects
        const projectsList = await db.getProjects();
        if (projectsList.length > 0) {
          setProjectsData(projectsList.map(p => ({
            id: parseInt(p.id.split('-')[1]),
            title: p.title,
            description: p.description,
            category: p.category,
            imageUrl: p.imageUrl,
            link: p.link,
            featured: p.featured
          })));
        }

      } catch (error) {
        console.error('Error loading data from database:', error);
        // В случае ошибки используем данные по умолчанию
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
