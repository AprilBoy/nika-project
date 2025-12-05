import { heroContent, aboutContent, processSteps, clientSegments, serviceFormats, testimonials } from '@/data/content';

// Типы данных для базы данных
export interface HeroData {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  primaryCTA: string;
  secondaryCTA: string;
  telegramLink: string;
  updatedAt: string;
}

export interface AboutData {
  id: string;
  title: string;
  subtitle: string;
  highlights: string[];
  updatedAt: string;
}

export interface ProcessStepData {
  id: string;
  number: number;
  title: string;
  description: string;
  examples?: string[];
  details?: string[];
  updatedAt: string;
}

export interface TestimonialData {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceData {
  id: string;
  title: string;
  price: string;
  duration?: string;
  description?: string;
  examples?: string[];
  cta: string;
  available: boolean;
  featured?: boolean;
  updatedAt: string;
}

export interface ClientSegmentData {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  link?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  serviceType?: string;
  status: 'new' | 'contacted' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Класс для работы с базой данных (используем localStorage для простоты)
class Database {
  private storage: Storage | null;

  constructor() {
    this.storage = typeof window !== 'undefined' ? window.localStorage : null;
  }

  // Инициализация базы данных начальными данными
  async initialize(): Promise<void> {
    if (!this.storage) return;

    // Инициализация hero данных
    if (!this.storage.getItem('hero')) {
      const heroData: HeroData = {
        id: 'hero',
        ...heroContent,
        updatedAt: new Date().toISOString()
      };
      this.storage.setItem('hero', JSON.stringify(heroData));
    }

    // Инициализация about данных
    if (!this.storage.getItem('about')) {
      const aboutData: AboutData = {
        id: 'about',
        ...aboutContent,
        updatedAt: new Date().toISOString()
      };
      this.storage.setItem('about', JSON.stringify(aboutData));
    }

    // Инициализация process steps
    if (!this.storage.getItem('processSteps')) {
      const processData: ProcessStepData[] = processSteps.map((step, index) => ({
        id: `process-${step.id}`,
        number: step.number,
        title: step.title,
        description: step.description,
        examples: step.examples,
        details: step.details,
        updatedAt: new Date().toISOString()
      }));
      this.storage.setItem('processSteps', JSON.stringify(processData));
    }

    // Инициализация testimonials
    if (!this.storage.getItem('testimonials')) {
      const testimonialsData: TestimonialData[] = testimonials.map((testimonial, index) => ({
        id: `testimonial-${testimonial.id}`,
        name: testimonial.name,
        role: testimonial.role,
        company: testimonial.company,
        quote: testimonial.quote,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      this.storage.setItem('testimonials', JSON.stringify(testimonialsData));
    }

    // Инициализация services
    if (!this.storage.getItem('services')) {
      const servicesData: ServiceData[] = serviceFormats.map((service, index) => ({
        id: `service-${service.id}`,
        title: service.title,
        price: service.price,
        duration: service.duration,
        description: service.description,
        examples: service.examples,
        cta: service.cta,
        available: service.available,
        featured: service.featured,
        updatedAt: new Date().toISOString()
      }));
      this.storage.setItem('services', JSON.stringify(servicesData));
    }

    // Инициализация client segments
    if (!this.storage.getItem('clientSegments')) {
      const clientsData: ClientSegmentData[] = clientSegments.map((segment, index) => ({
        id: `client-${segment.id}`,
        title: segment.title,
        description: segment.description,
        updatedAt: new Date().toISOString()
      }));
      this.storage.setItem('clientSegments', JSON.stringify(clientsData));
    }

    // Инициализация projects (пустой массив по умолчанию)
    if (!this.storage.getItem('projects')) {
      this.storage.setItem('projects', JSON.stringify([]));
    }

    // Инициализация inquiries (пустой массив по умолчанию)
    if (!this.storage.getItem('inquiries')) {
      this.storage.setItem('inquiries', JSON.stringify([]));
    }
  }

  // Hero operations
  async getHero(): Promise<HeroData | null> {
    if (!this.storage) return null;
    const data = this.storage.getItem('hero');
    return data ? JSON.parse(data) : null;
  }

  async updateHero(data: Omit<HeroData, 'id' | 'updatedAt'>): Promise<HeroData> {
    if (!this.storage) throw new Error('Storage not available');

    const updatedData: HeroData = {
      id: 'hero',
      ...data,
      updatedAt: new Date().toISOString()
    };

    this.storage.setItem('hero', JSON.stringify(updatedData));
    return updatedData;
  }

  // About operations
  async getAbout(): Promise<AboutData | null> {
    if (!this.storage) return null;
    const data = this.storage.getItem('about');
    return data ? JSON.parse(data) : null;
  }

  async updateAbout(data: Omit<AboutData, 'id' | 'updatedAt'>): Promise<AboutData> {
    if (!this.storage) throw new Error('Storage not available');

    const updatedData: AboutData = {
      id: 'about',
      ...data,
      updatedAt: new Date().toISOString()
    };

    this.storage.setItem('about', JSON.stringify(updatedData));
    return updatedData;
  }

  // Process steps operations
  async getProcessSteps(): Promise<ProcessStepData[]> {
    if (!this.storage) return [];
    const data = this.storage.getItem('processSteps');
    return data ? JSON.parse(data) : [];
  }

  async updateProcessStep(id: string, data: Omit<ProcessStepData, 'id' | 'updatedAt'>): Promise<ProcessStepData> {
    if (!this.storage) throw new Error('Storage not available');

    const steps = await this.getProcessSteps();
    const index = steps.findIndex(step => step.id === id);

    if (index === -1) throw new Error('Process step not found');

    const updatedStep: ProcessStepData = {
      id,
      ...data,
      updatedAt: new Date().toISOString()
    };

    steps[index] = updatedStep;
    this.storage.setItem('processSteps', JSON.stringify(steps));
    return updatedStep;
  }

  async createProcessStep(data: Omit<ProcessStepData, 'id' | 'updatedAt'>): Promise<ProcessStepData> {
    if (!this.storage) throw new Error('Storage not available');

    const steps = await this.getProcessSteps();
    const newId = `process-${Date.now()}`;
    const newStep: ProcessStepData = {
      id: newId,
      ...data,
      updatedAt: new Date().toISOString()
    };

    steps.push(newStep);
    this.storage.setItem('processSteps', JSON.stringify(steps));
    return newStep;
  }

  async deleteProcessStep(id: string): Promise<void> {
    if (!this.storage) throw new Error('Storage not available');

    const steps = await this.getProcessSteps();
    const filtered = steps.filter(step => step.id !== id);
    this.storage.setItem('processSteps', JSON.stringify(filtered));
  }

  // Testimonials operations
  async getTestimonials(): Promise<TestimonialData[]> {
    if (!this.storage) return [];
    const data = this.storage.getItem('testimonials');
    return data ? JSON.parse(data) : [];
  }

  async createTestimonial(data: Omit<TestimonialData, 'id' | 'createdAt' | 'updatedAt'>): Promise<TestimonialData> {
    if (!this.storage) throw new Error('Storage not available');

    const testimonials = await this.getTestimonials();
    const newId = `testimonial-${Date.now()}`;
    const newTestimonial: TestimonialData = {
      id: newId,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    testimonials.push(newTestimonial);
    this.storage.setItem('testimonials', JSON.stringify(testimonials));
    return newTestimonial;
  }

  async updateTestimonial(id: string, data: Omit<TestimonialData, 'id' | 'createdAt' | 'updatedAt'>): Promise<TestimonialData> {
    if (!this.storage) throw new Error('Storage not available');

    const testimonials = await this.getTestimonials();
    const index = testimonials.findIndex(t => t.id === id);

    if (index === -1) throw new Error('Testimonial not found');

    const updatedTestimonial: TestimonialData = {
      id,
      ...data,
      createdAt: testimonials[index].createdAt,
      updatedAt: new Date().toISOString()
    };

    testimonials[index] = updatedTestimonial;
    this.storage.setItem('testimonials', JSON.stringify(testimonials));
    return updatedTestimonial;
  }

  async deleteTestimonial(id: string): Promise<void> {
    if (!this.storage) throw new Error('Storage not available');

    const testimonials = await this.getTestimonials();
    const filtered = testimonials.filter(t => t.id !== id);
    this.storage.setItem('testimonials', JSON.stringify(filtered));
  }

  // Services operations
  async getServices(): Promise<ServiceData[]> {
    if (!this.storage) return [];
    const data = this.storage.getItem('services');
    return data ? JSON.parse(data) : [];
  }

  async createService(data: Omit<ServiceData, 'id' | 'updatedAt'>): Promise<ServiceData> {
    if (!this.storage) throw new Error('Storage not available');

    const services = await this.getServices();
    const newId = `service-${Date.now()}`;
    const newService: ServiceData = {
      id: newId,
      ...data,
      updatedAt: new Date().toISOString()
    };

    services.push(newService);
    this.storage.setItem('services', JSON.stringify(services));
    return newService;
  }

  async updateService(id: string, data: Omit<ServiceData, 'id' | 'updatedAt'>): Promise<ServiceData> {
    if (!this.storage) throw new Error('Storage not available');

    const services = await this.getServices();
    const index = services.findIndex(s => s.id === id);

    if (index === -1) throw new Error('Service not found');

    const updatedService: ServiceData = {
      id,
      ...data,
      updatedAt: new Date().toISOString()
    };

    services[index] = updatedService;
    this.storage.setItem('services', JSON.stringify(services));
    return updatedService;
  }

  async deleteService(id: string): Promise<void> {
    if (!this.storage) throw new Error('Storage not available');

    const services = await this.getServices();
    const filtered = services.filter(s => s.id !== id);
    this.storage.setItem('services', JSON.stringify(filtered));
  }

  // Client segments operations
  async getClientSegments(): Promise<ClientSegmentData[]> {
    if (!this.storage) return [];
    const data = this.storage.getItem('clientSegments');
    return data ? JSON.parse(data) : [];
  }

  async createClientSegment(data: Omit<ClientSegmentData, 'id' | 'updatedAt'>): Promise<ClientSegmentData> {
    if (!this.storage) throw new Error('Storage not available');

    const segments = await this.getClientSegments();
    const newId = `client-${Date.now()}`;
    const newSegment: ClientSegmentData = {
      id: newId,
      ...data,
      updatedAt: new Date().toISOString()
    };

    segments.push(newSegment);
    this.storage.setItem('clientSegments', JSON.stringify(segments));
    return newSegment;
  }

  async updateClientSegment(id: string, data: Omit<ClientSegmentData, 'id' | 'updatedAt'>): Promise<ClientSegmentData> {
    if (!this.storage) throw new Error('Storage not available');

    const segments = await this.getClientSegments();
    const index = segments.findIndex(s => s.id === id);

    if (index === -1) throw new Error('Client segment not found');

    const updatedSegment: ClientSegmentData = {
      id,
      ...data,
      updatedAt: new Date().toISOString()
    };

    segments[index] = updatedSegment;
    this.storage.setItem('clientSegments', JSON.stringify(segments));
    return updatedSegment;
  }

  async deleteClientSegment(id: string): Promise<void> {
    if (!this.storage) throw new Error('Storage not available');

    const segments = await this.getClientSegments();
    const filtered = segments.filter(s => s.id !== id);
    this.storage.setItem('clientSegments', JSON.stringify(filtered));
  }

  // Projects operations
  async getProjects(): Promise<ProjectData[]> {
    if (!this.storage) return [];
    const data = this.storage.getItem('projects');
    return data ? JSON.parse(data) : [];
  }

  async createProject(data: Omit<ProjectData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProjectData> {
    if (!this.storage) throw new Error('Storage not available');

    const projects = await this.getProjects();
    const newId = `project-${Date.now()}`;
    const newProject: ProjectData = {
      id: newId,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    projects.push(newProject);
    this.storage.setItem('projects', JSON.stringify(projects));
    return newProject;
  }

  async updateProject(id: string, data: Omit<ProjectData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProjectData> {
    if (!this.storage) throw new Error('Storage not available');

    const projects = await this.getProjects();
    const index = projects.findIndex(p => p.id === id);

    if (index === -1) throw new Error('Project not found');

    const updatedProject: ProjectData = {
      id,
      ...data,
      createdAt: projects[index].createdAt,
      updatedAt: new Date().toISOString()
    };

    projects[index] = updatedProject;
    this.storage.setItem('projects', JSON.stringify(projects));
    return updatedProject;
  }

  async deleteProject(id: string): Promise<void> {
    if (!this.storage) throw new Error('Storage not available');

    const projects = await this.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    this.storage.setItem('projects', JSON.stringify(filtered));
  }

  // Inquiries operations
  async getInquiries(): Promise<InquiryData[]> {
    if (!this.storage) return [];
    const data = this.storage.getItem('inquiries');
    return data ? JSON.parse(data) : [];
  }

  async createInquiry(data: Omit<InquiryData, 'id' | 'createdAt' | 'updatedAt'>): Promise<InquiryData> {
    if (!this.storage) throw new Error('Storage not available');

    const inquiries = await this.getInquiries();
    const newId = `inquiry-${Date.now()}`;
    const newInquiry: InquiryData = {
      id: newId,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    inquiries.push(newInquiry);
    this.storage.setItem('inquiries', JSON.stringify(inquiries));
    return newInquiry;
  }

  async updateInquiry(id: string, data: Omit<InquiryData, 'id' | 'createdAt' | 'updatedAt'>): Promise<InquiryData> {
    if (!this.storage) throw new Error('Storage not available');

    const inquiries = await this.getInquiries();
    const index = inquiries.findIndex(i => i.id === id);

    if (index === -1) throw new Error('Inquiry not found');

    const updatedInquiry: InquiryData = {
      id,
      ...data,
      createdAt: inquiries[index].createdAt,
      updatedAt: new Date().toISOString()
    };

    inquiries[index] = updatedInquiry;
    this.storage.setItem('inquiries', JSON.stringify(inquiries));
    return updatedInquiry;
  }

  async deleteInquiry(id: string): Promise<void> {
    if (!this.storage) throw new Error('Storage not available');

    const inquiries = await this.getInquiries();
    const filtered = inquiries.filter(i => i.id !== id);
    this.storage.setItem('inquiries', JSON.stringify(filtered));
  }
}

// Экспортируем экземпляр базы данных
export const db = new Database();
