// Simple database implementation for server
import { heroContent, aboutContent, processSteps, clientSegments, serviceFormats, testimonials } from './content.js';

class Database {
  constructor() {
    this.data = {
      hero: heroContent,
      about: aboutContent,
      processSteps,
      clientSegments,
      services: serviceFormats,
      testimonials,
      projects: [],
      inquiries: []
    };
  }

  // Hero operations
  getHero() {
    return this.data.hero;
  }

  updateHero(data) {
    this.data.hero = { ...this.data.hero, ...data };
    return this.data.hero;
  }

  // About operations
  getAbout() {
    return this.data.about;
  }

  updateAbout(data) {
    this.data.about = { ...this.data.about, ...data };
    return this.data.about;
  }

  // Process steps operations
  getProcessSteps() {
    return this.data.processSteps;
  }

  updateProcessStep(id, data) {
    const index = this.data.processSteps.findIndex(step => step.id === id);
    if (index !== -1) {
      this.data.processSteps[index] = { ...this.data.processSteps[index], ...data };
      return this.data.processSteps[index];
    }
    throw new Error('Process step not found');
  }

  createProcessStep(data) {
    const newId = `process-${Date.now()}`;
    const newStep = { id: newId, ...data };
    this.data.processSteps.push(newStep);
    return newStep;
  }

  deleteProcessStep(id) {
    this.data.processSteps = this.data.processSteps.filter(step => step.id !== id);
  }

  // Client segments operations
  getClientSegments() {
    return this.data.clientSegments;
  }

  updateClientSegment(id, data) {
    const index = this.data.clientSegments.findIndex(segment => segment.id === id);
    if (index !== -1) {
      this.data.clientSegments[index] = { ...this.data.clientSegments[index], ...data };
      return this.data.clientSegments[index];
    }
    throw new Error('Client segment not found');
  }

  createClientSegment(data) {
    const newId = `client-${Date.now()}`;
    const newSegment = { id: newId, ...data };
    this.data.clientSegments.push(newSegment);
    return newSegment;
  }

  deleteClientSegment(id) {
    this.data.clientSegments = this.data.clientSegments.filter(segment => segment.id !== id);
  }

  // Services operations
  getServices() {
    return this.data.services;
  }

  updateService(id, data) {
    const index = this.data.services.findIndex(service => service.id === id);
    if (index !== -1) {
      this.data.services[index] = { ...this.data.services[index], ...data };
      return this.data.services[index];
    }
    throw new Error('Service not found');
  }

  createService(data) {
    const newId = `service-${Date.now()}`;
    const newService = { id: newId, ...data };
    this.data.services.push(newService);
    return newService;
  }

  deleteService(id) {
    this.data.services = this.data.services.filter(service => service.id !== id);
  }

  // Testimonials operations
  getTestimonials() {
    return this.data.testimonials;
  }

  updateTestimonial(id, data) {
    const index = this.data.testimonials.findIndex(testimonial => testimonial.id === id);
    if (index !== -1) {
      this.data.testimonials[index] = { ...this.data.testimonials[index], ...data };
      return this.data.testimonials[index];
    }
    throw new Error('Testimonial not found');
  }

  createTestimonial(data) {
    const newId = `testimonial-${Date.now()}`;
    const newTestimonial = { id: newId, ...data };
    this.data.testimonials.push(newTestimonial);
    return newTestimonial;
  }

  deleteTestimonial(id) {
    this.data.testimonials = this.data.testimonials.filter(testimonial => testimonial.id !== id);
  }

  // Projects operations
  getProjects() {
    return this.data.projects;
  }

  updateProject(id, data) {
    const index = this.data.projects.findIndex(project => project.id === id);
    if (index !== -1) {
      this.data.projects[index] = { ...this.data.projects[index], ...data };
      return this.data.projects[index];
    }
    throw new Error('Project not found');
  }

  createProject(data) {
    const newId = `project-${Date.now()}`;
    const newProject = { id: newId, ...data };
    this.data.projects.push(newProject);
    return newProject;
  }

  deleteProject(id) {
    this.data.projects = this.data.projects.filter(project => project.id !== id);
  }

  // Inquiries operations
  getInquiries() {
    return this.data.inquiries;
  }

  updateInquiry(id, data) {
    const index = this.data.inquiries.findIndex(inquiry => inquiry.id === id);
    if (index !== -1) {
      this.data.inquiries[index] = { ...this.data.inquiries[index], ...data };
      return this.data.inquiries[index];
    }
    throw new Error('Inquiry not found');
  }

  createInquiry(data) {
    const newId = `inquiry-${Date.now()}`;
    const newInquiry = { id: newId, ...data };
    this.data.inquiries.push(newInquiry);
    return newInquiry;
  }

  deleteInquiry(id) {
    this.data.inquiries = this.data.inquiries.filter(inquiry => inquiry.id !== id);
  }
}

export const db = new Database();
