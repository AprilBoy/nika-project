import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import AppDatabase from './src/database.cjs';
import dotenv from 'dotenv';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Determine the correct path to dist directory
// In Docker: /app/dist
// Outside Docker: use current working directory (where npm run server is executed from)
const projectRoot = process.env.NODE_ENV === 'production' && process.cwd().includes('/app')
    ? '/app'
    : process.cwd();
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.raw({ type: 'multipart/form-data', limit: '5mb' }));
app.use(express.static(path.join(projectRoot, 'dist')));

// Serve attached assets
app.use('/attached_assets', express.static(path.join(projectRoot, 'attached_assets')));
// Serve assets
app.use('/assets', express.static(path.join(projectRoot, 'assets')));
// Database is already initialized as db
// API Routes
app.get('/api/hero', async (req, res) => {
    try {
        const hero = await db.getHero();
        res.json(hero);
    }
    catch (error) {
        console.error('Error fetching hero:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.put('/api/hero', async (req, res) => {
    try {
        console.log('Updating hero with data:', req.body);
        const hero = await db.updateHero(req.body);
        console.log('Hero updated successfully:', hero);
        res.json(hero);
    }
    catch (error) {
        console.error('Error updating hero:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Image upload endpoint for hero section
app.post('/api/upload/hero-image', async (req, res) => {
    try {
        const { image, filename, mimeType } = req.body;

        if (!image || !filename || !mimeType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if it's a valid image type
        if (!mimeType.startsWith('image/')) {
            return res.status(400).json({ error: 'Only image files are allowed' });
        }

        // Extract base64 data
        const base64Data = image.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');

        // Check file size (5MB limit)
        if (buffer.length > 5 * 1024 * 1024) {
            return res.status(400).json({ error: 'File too large. Maximum size is 5MB' });
        }

        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(filename);
        const finalFilename = `hero_image_${uniqueSuffix}${extension}`;

        // Save file
        const filePath = path.join(projectRoot, 'attached_assets/generated_images', finalFilename);
        fs.writeFileSync(filePath, buffer);

        // Return the path to the uploaded image
        const imagePath = `/attached_assets/generated_images/${finalFilename}`;
        res.json({ imagePath });
    }
    catch (error) {
        console.error('Error uploading hero image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Image upload endpoint for about section
app.post('/api/upload/about-image', async (req, res) => {
    try {
        const { image, filename, mimeType } = req.body;

        if (!image || !filename || !mimeType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if it's a valid image type
        if (!mimeType.startsWith('image/')) {
            return res.status(400).json({ error: 'Only image files are allowed' });
        }

        // Extract base64 data
        const base64Data = image.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');

        // Check file size (5MB limit)
        if (buffer.length > 5 * 1024 * 1024) {
            return res.status(400).json({ error: 'File too large. Maximum size is 5MB' });
        }

        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(filename);
        const finalFilename = `about_image_${uniqueSuffix}${extension}`;

        // Save file
        const filePath = path.join(projectRoot, 'attached_assets/generated_images', finalFilename);
        fs.writeFileSync(filePath, buffer);

        // Return the path to the uploaded image
        const imagePath = `/attached_assets/generated_images/${finalFilename}`;
        res.json({ imagePath });
    }
    catch (error) {
        console.error('Error uploading about image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint to list images in generated_images folder
app.get('/api/generated-images', async (req, res) => {
    try {
        const imagesDir = path.join(projectRoot, 'attached_assets/generated_images');

        // Check if directory exists
        if (!fs.existsSync(imagesDir)) {
            return res.json([]);
        }

        // Read directory contents
        const files = fs.readdirSync(imagesDir);

        // Filter for image files and create URLs
        const imageFiles = files
            .filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
            })
            .map(file => ({
                filename: file,
                url: `/attached_assets/generated_images/${file}`,
                path: `/attached_assets/generated_images/${file}`
            }));

        res.json(imageFiles);
    }
    catch (error) {
        console.error('Error listing generated images:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/api/about', async (req, res) => {
    try {
        const about = await db.getAbout();
        res.json(about);
    }
    catch (error) {
        console.error('Error fetching about:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.put('/api/about', async (req, res) => {
    try {
        const about = await db.updateAbout(req.body);
        res.json(about);
    }
    catch (error) {
        console.error('Error updating about:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/api/process-steps', async (req, res) => {
    try {
        const steps = await db.getProcessSteps();
        res.json(steps);
    }
    catch (error) {
        console.error('Error fetching process steps:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/process-steps', async (req, res) => {
    try {
        const step = await db.createProcessStep(req.body);
        res.json(step);
    }
    catch (error) {
        console.error('Error creating process step:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.put('/api/process-steps/:id', async (req, res) => {
    try {
        const step = await db.updateProcessStep(req.params.id, req.body);
        res.json(step);
    }
    catch (error) {
        console.error('Error updating process step:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.delete('/api/process-steps/:id', async (req, res) => {
    try {
        await db.deleteProcessStep(req.params.id);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error deleting process step:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/api/client-segments', async (req, res) => {
    try {
        const segments = await db.getClientSegments();
        res.json(segments);
    }
    catch (error) {
        console.error('Error fetching client segments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/client-segments', async (req, res) => {
    try {
        const segment = await db.createClientSegment(req.body);
        res.json(segment);
    }
    catch (error) {
        console.error('Error creating client segment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.put('/api/client-segments/:id', async (req, res) => {
    try {
        const segment = await db.updateClientSegment(req.params.id, req.body);
        res.json(segment);
    }
    catch (error) {
        console.error('Error updating client segment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.delete('/api/client-segments/:id', async (req, res) => {
    try {
        await db.deleteClientSegment(req.params.id);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error deleting client segment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/api/services', async (req, res) => {
    try {
        const services = await db.getServices();
        res.json(services);
    }
    catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/services', async (req, res) => {
    try {
        const service = await db.createService(req.body);
        res.json(service);
    }
    catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.put('/api/services/:id', async (req, res) => {
    try {
        const service = await db.updateService(req.params.id, req.body);
        res.json(service);
    }
    catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.delete('/api/services/:id', async (req, res) => {
    try {
        await db.deleteService(req.params.id);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/api/testimonials', async (req, res) => {
    try {
        const testimonials = await db.getTestimonials();
        res.json(testimonials);
    }
    catch (error) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/testimonials', async (req, res) => {
    try {
        const testimonial = await db.createTestimonial(req.body);
        res.json(testimonial);
    }
    catch (error) {
        console.error('Error creating testimonial:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.put('/api/testimonials/:id', async (req, res) => {
    try {
        const testimonial = await db.updateTestimonial(req.params.id, req.body);
        res.json(testimonial);
    }
    catch (error) {
        console.error('Error updating testimonial:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.delete('/api/testimonials/:id', async (req, res) => {
    try {
        await db.deleteTestimonial(req.params.id);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error deleting testimonial:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await db.getProjects();
        res.json(projects);
    }
    catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/projects', async (req, res) => {
    try {
        const project = await db.createProject(req.body);
        res.json(project);
    }
    catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.put('/api/projects/:id', async (req, res) => {
    try {
        const project = await db.updateProject(req.params.id, req.body);
        res.json(project);
    }
    catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.delete('/api/projects/:id', async (req, res) => {
    try {
        await db.deleteProject(req.params.id);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/api/inquiries', async (req, res) => {
    try {
        const inquiries = await db.getInquiries();
        res.json(inquiries);
    }
    catch (error) {
        console.error('Error fetching inquiries:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/inquiries', async (req, res) => {
    try {
        const inquiry = await db.createInquiry(req.body);
        res.json(inquiry);
    }
    catch (error) {
        console.error('Error creating inquiry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.put('/api/inquiries/:id', async (req, res) => {
    try {
        const inquiry = await db.updateInquiry(req.params.id, req.body);
        res.json(inquiry);
    }
    catch (error) {
        console.error('Error updating inquiry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.delete('/api/inquiries/:id', async (req, res) => {
    try {
        await db.deleteInquiry(req.params.id);
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error deleting inquiry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Serve React app for all other routes (SPA fallback)
app.use((req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
        return next();
    }
    // For all other routes, serve the React app
    res.sendFile(path.join(projectRoot, 'dist/index.html'));
});
// Start server
const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Server is listening and ready to accept connections...');
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Keep the process alive
setInterval(() => {
    // Keep alive
}, 1000);
