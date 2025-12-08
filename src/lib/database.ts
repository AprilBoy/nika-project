// API base URL
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001';

// Типы данных для API
export interface HeroData {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  primaryCTA: string;
  secondaryCTA: string;
  telegramLink: string;
  image?: string;
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
  icon?: string;
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

export interface AdminSessionData {
  id: string;
  expiresAt: string;
  createdAt: string;
}

// Класс базы данных с API вызовами
class DatabaseAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async apiCall(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Hero methods
  async getHero(): Promise<HeroData | null> {
    try {
      return await this.apiCall('/api/hero');
    } catch (error) {
      console.error('Error fetching hero:', error);
      return null;
    }
  }

  async updateHero(data: Omit<HeroData, 'id' | 'updatedAt'>): Promise<HeroData> {
    return this.apiCall('/api/hero', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async uploadHeroImage(file: File): Promise<{ imagePath: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const response = await this.apiCall('/api/upload/hero-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image: base64,
              filename: file.name,
              mimeType: file.type,
            }),
          });
          resolve(response);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  // About methods
  async getAbout(): Promise<AboutData | null> {
    try {
      return await this.apiCall('/api/about');
    } catch (error) {
      console.error('Error fetching about:', error);
      return null;
    }
  }

  async updateAbout(data: Omit<AboutData, 'id' | 'updatedAt'>): Promise<AboutData> {
    return this.apiCall('/api/about', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Process steps methods
  async getProcessSteps(): Promise<ProcessStepData[]> {
    try {
      return await this.apiCall('/api/process-steps');
    } catch (error) {
      console.error('Error fetching process steps:', error);
      return [];
    }
  }

  async createProcessStep(data: Omit<ProcessStepData, 'id' | 'updatedAt'>): Promise<ProcessStepData> {
    return this.apiCall('/api/process-steps', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProcessStep(id: string, data: Omit<ProcessStepData, 'id' | 'updatedAt'>): Promise<ProcessStepData> {
    return this.apiCall(`/api/process-steps/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProcessStep(id: string): Promise<void> {
    await this.apiCall(`/api/process-steps/${id}`, {
      method: 'DELETE',
    });
  }

  // Client segments methods
  async getClientSegments(): Promise<ClientSegmentData[]> {
    try {
      return await this.apiCall('/api/client-segments');
    } catch (error) {
      console.error('Error fetching client segments:', error);
      return [];
    }
  }

  async createClientSegment(data: Omit<ClientSegmentData, 'id' | 'updatedAt'>): Promise<ClientSegmentData> {
    return this.apiCall('/api/client-segments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateClientSegment(id: string, data: Omit<ClientSegmentData, 'id' | 'updatedAt'>): Promise<ClientSegmentData> {
    return this.apiCall(`/api/client-segments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteClientSegment(id: string): Promise<void> {
    await this.apiCall(`/api/client-segments/${id}`, {
      method: 'DELETE',
    });
  }

  // Services methods
  async getServices(): Promise<ServiceData[]> {
    try {
      return await this.apiCall('/api/services');
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  }

  async createService(data: Omit<ServiceData, 'id' | 'updatedAt'>): Promise<ServiceData> {
    return this.apiCall('/api/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateService(id: string, data: Omit<ServiceData, 'id' | 'updatedAt'>): Promise<ServiceData> {
    return this.apiCall(`/api/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteService(id: string): Promise<void> {
    await this.apiCall(`/api/services/${id}`, {
      method: 'DELETE',
    });
  }

  // Testimonials methods
  async getTestimonials(): Promise<TestimonialData[]> {
    try {
      return await this.apiCall('/api/testimonials');
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
  }

  async createTestimonial(data: Omit<TestimonialData, 'id' | 'createdAt' | 'updatedAt'>): Promise<TestimonialData> {
    return this.apiCall('/api/testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTestimonial(id: string, data: Omit<TestimonialData, 'id' | 'createdAt' | 'updatedAt'>): Promise<TestimonialData> {
    return this.apiCall(`/api/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTestimonial(id: string): Promise<void> {
    await this.apiCall(`/api/testimonials/${id}`, {
      method: 'DELETE',
    });
  }

  // Projects methods
  async getProjects(): Promise<ProjectData[]> {
    try {
      return await this.apiCall('/api/projects');
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  async createProject(data: Omit<ProjectData, 'id' | 'updatedAt'>): Promise<ProjectData> {
    return this.apiCall('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string, data: Omit<ProjectData, 'id' | 'updatedAt'>): Promise<ProjectData> {
    return this.apiCall(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string): Promise<void> {
    await this.apiCall(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Inquiries methods
  async getInquiries(): Promise<InquiryData[]> {
    try {
      return await this.apiCall('/api/inquiries');
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      return [];
    }
  }

  async createInquiry(data: Omit<InquiryData, 'id' | 'createdAt' | 'updatedAt'>): Promise<InquiryData> {
    return this.apiCall('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateInquiry(id: string, data: Omit<InquiryData, 'id' | 'createdAt' | 'updatedAt'>): Promise<InquiryData> {
    return this.apiCall(`/api/inquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteInquiry(id: string): Promise<void> {
    await this.apiCall(`/api/inquiries/${id}`, {
      method: 'DELETE',
    });
  }

  // Initialize method (for backward compatibility)
  async initialize(): Promise<void> {
    // Database is initialized on server startup
    console.log('Database API initialized');
  }
}

// Экспортируем экземпляр базы данных
export const db = new DatabaseAPI();
