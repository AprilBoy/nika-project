import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './database.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Database is already initialized as db

// API Routes
app.get('/api/hero', async (req, res) => {
  try {
    const hero = await db.getHero();
    res.json(hero);
  } catch (error) {
    console.error('Error fetching hero:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/hero', async (req, res) => {
  try {
    const hero = await db.updateHero(req.body);
    res.json(hero);
  } catch (error) {
    console.error('Error updating hero:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/about', async (req, res) => {
  try {
    const about = await db.getAbout();
    res.json(about);
  } catch (error) {
    console.error('Error fetching about:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/about', async (req, res) => {
  try {
    const about = await db.updateAbout(req.body);
    res.json(about);
  } catch (error) {
    console.error('Error updating about:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/process-steps', async (req, res) => {
  try {
    const steps = await db.getProcessSteps();
    res.json(steps);
  } catch (error) {
    console.error('Error fetching process steps:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/process-steps', async (req, res) => {
  try {
    const step = await db.createProcessStep(req.body);
    res.json(step);
  } catch (error) {
    console.error('Error creating process step:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/process-steps/:id', async (req, res) => {
  try {
    const step = await db.updateProcessStep(req.params.id, req.body);
    res.json(step);
  } catch (error) {
    console.error('Error updating process step:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/process-steps/:id', async (req, res) => {
  try {
    await db.deleteProcessStep(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting process step:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/client-segments', async (req, res) => {
  try {
    const segments = await db.getClientSegments();
    res.json(segments);
  } catch (error) {
    console.error('Error fetching client segments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/client-segments', async (req, res) => {
  try {
    const segment = await db.createClientSegment(req.body);
    res.json(segment);
  } catch (error) {
    console.error('Error creating client segment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/client-segments/:id', async (req, res) => {
  try {
    const segment = await db.updateClientSegment(req.params.id, req.body);
    res.json(segment);
  } catch (error) {
    console.error('Error updating client segment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/client-segments/:id', async (req, res) => {
  try {
    await db.deleteClientSegment(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting client segment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/services', async (req, res) => {
  try {
    const services = await db.getServices();
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/services', async (req, res) => {
  try {
    const service = await db.createService(req.body);
    res.json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/services/:id', async (req, res) => {
  try {
    const service = await db.updateService(req.params.id, req.body);
    res.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/services/:id', async (req, res) => {
  try {
    await db.deleteService(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await db.getTestimonials();
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/testimonials', async (req, res) => {
  try {
    const testimonial = await db.createTestimonial(req.body);
    res.json(testimonial);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/testimonials/:id', async (req, res) => {
  try {
    const testimonial = await db.updateTestimonial(req.params.id, req.body);
    res.json(testimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/testimonials/:id', async (req, res) => {
  try {
    await db.deleteTestimonial(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await db.getProjects();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const project = await db.createProject(req.body);
    res.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const project = await db.updateProject(req.params.id, req.body);
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    await db.deleteProject(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/inquiries', async (req, res) => {
  try {
    const inquiries = await db.getInquiries();
    res.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/inquiries', async (req, res) => {
  try {
    const inquiry = await db.createInquiry(req.body);
    res.json(inquiry);
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/inquiries/:id', async (req, res) => {
  try {
    const inquiry = await db.updateInquiry(req.params.id, req.body);
    res.json(inquiry);
  } catch (error) {
    console.error('Error updating inquiry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/inquiries/:id', async (req, res) => {
  try {
    await db.deleteInquiry(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve React app for all other routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
