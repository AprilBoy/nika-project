#!/usr/bin/env node

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Import default content
const contentPath = path.join(__dirname, '../src/data/content.js');
let defaultContent;

try {
  // Read and parse the TypeScript file
  const content = fs.readFileSync(contentPath, 'utf8');

  // Extract data using regex
  const heroMatch = content.match(/export const heroContent = ({[\s\S]*?});/);
  const aboutMatch = content.match(/export const aboutContent = ({[\s\S]*?});/);
  const processMatch = content.match(/export const processSteps = (\[[\s\S]*?\]);/);
  const clientsMatch = content.match(/export const clientSegments = (\[[\s\S]*?\]);/);
  const servicesMatch = content.match(/export const serviceFormats = (\[[\s\S]*?\]);/);
  const testimonialsMatch = content.match(/export const testimonials = (\[[\s\S]*?\]);/);

  if (heroMatch && aboutMatch && processMatch && clientsMatch && servicesMatch && testimonialsMatch) {
    // Use eval to parse the JavaScript objects
    const heroContent = eval(`(${heroMatch[1]})`);
    const aboutContent = eval(`(${aboutMatch[1]})`);
    const processSteps = eval(`(${processMatch[1]})`);
    const clientSegments = eval(`(${clientsMatch[1]})`);
    const serviceFormats = eval(`(${servicesMatch[1]})`);
    const testimonials = eval(`(${testimonialsMatch[1]})`);

    defaultContent = {
      heroContent,
      aboutContent,
      processSteps,
      clientSegments,
      serviceFormats,
      testimonials
    };
  }
} catch (error) {
  console.error('Error reading default content:', error);
}

if (!defaultContent) {
  console.error('Could not parse default content. Exiting...');
  process.exit(1);
}

class MigrationScript {
  constructor() {
    const dbPath = path.join(__dirname, '../data/app.db');
    const dataDir = path.dirname(dbPath);

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
  }

  async migrateFromLocalStorage() {
    console.log('Starting migration from localStorage...');

    // First, ensure database schema is up to date
    this.ensureSchemaUpToDate();

    // Check if we have localStorage data (simulate browser environment)
    const localStoragePath = path.join(__dirname, '../localStorage_backup.json');

    if (!fs.existsSync(localStoragePath)) {
      console.log('No localStorage backup found. Initializing with default data...');
      this.initDefaultData();
      return;
    }

    try {
      const localStorageData = JSON.parse(fs.readFileSync(localStoragePath, 'utf8'));
      console.log('Found localStorage backup. Migrating data...');

      // Migrate each section
      this.migrateHero(localStorageData.hero);
      this.migrateAbout(localStorageData.about);
      this.migrateProcessSteps(localStorageData.processSteps);
      this.migrateClientSegments(localStorageData.clientSegments);
      this.migrateServices(localStorageData.services);
      this.migrateTestimonials(localStorageData.testimonials);
      this.migrateProjects(localStorageData.projects);
      this.migrateInquiries(localStorageData.inquiries);

      console.log('Migration completed successfully!');
    } catch (error) {
      console.error('Error during migration:', error);
      console.log('Falling back to default data...');
      this.initDefaultData();
    }
  }

  ensureSchemaUpToDate() {
    console.log('Ensuring database schema is up to date...');

    try {
      // Check if image column exists in hero table
      const columns = this.db.prepare(`
        PRAGMA table_info(hero)
      `).all();

      const hasImageColumn = columns.some(col => col.name === 'image');

      if (!hasImageColumn) {
        console.log('Adding image column to hero table...');
        this.db.exec(`
          ALTER TABLE hero ADD COLUMN image TEXT;
        `);
        console.log('✅ Image column added successfully');
      } else {
        console.log('✅ Image column already exists');
      }
    } catch (error) {
      console.error('Error ensuring schema is up to date:', error);
      throw error;
    }
  }

  migrateHero(heroData) {
    if (!heroData) return;

    const update = this.db.prepare(`
      UPDATE hero SET
        badge = ?,
        title = ?,
        subtitle = ?,
        description = ?,
        primaryCTA = ?,
        secondaryCTA = ?,
        telegramLink = ?,
        image = ?,
        updatedAt = ?
      WHERE id = 1
    `);

    update.run(
      heroData.badge,
      heroData.title,
      heroData.subtitle,
      heroData.description,
      heroData.primaryCTA,
      heroData.secondaryCTA,
      heroData.telegramLink,
      heroData.image || null,
      new Date().toISOString()
    );

    console.log('Hero data migrated');
  }

  migrateAbout(aboutData) {
    if (!aboutData) return;

    const update = this.db.prepare(`
      UPDATE about SET
        title = ?,
        subtitle = ?,
        highlights = ?,
        updatedAt = ?
      WHERE id = 1
    `);

    update.run(
      aboutData.title,
      aboutData.subtitle,
      JSON.stringify(aboutData.highlights),
      new Date().toISOString()
    );

    console.log('About data migrated');
  }

  migrateProcessSteps(processSteps) {
    if (!processSteps || !Array.isArray(processSteps)) return;

    // Clear existing data
    this.db.prepare('DELETE FROM process_steps').run();

    const insert = this.db.prepare(`
      INSERT INTO process_steps (id, number, title, description, examples, details)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    processSteps.forEach(step => {
      insert.run(
        `process-${step.id}`,
        step.number,
        step.title,
        step.description,
        step.examples ? JSON.stringify(step.examples) : null,
        step.details ? JSON.stringify(step.details) : null
      );
    });

    console.log(`${processSteps.length} process steps migrated`);
  }

  migrateClientSegments(clientSegments) {
    if (!clientSegments || !Array.isArray(clientSegments)) return;

    // Clear existing data
    this.db.prepare('DELETE FROM client_segments').run();

    const insert = this.db.prepare(`
      INSERT INTO client_segments (id, title, description, icon)
      VALUES (?, ?, ?, ?)
    `);

    clientSegments.forEach(segment => {
      insert.run(
        `client-${segment.id}`,
        segment.title,
        segment.description,
        segment.icon || null
      );
    });

    console.log(`${clientSegments.length} client segments migrated`);
  }

  migrateServices(services) {
    if (!services || !Array.isArray(services)) return;

    // Clear existing data
    this.db.prepare('DELETE FROM services').run();

    const insert = this.db.prepare(`
      INSERT INTO services (id, title, price, duration, description, examples, cta, available, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    services.forEach(service => {
      insert.run(
        `service-${service.id}`,
        service.title,
        service.price,
        service.duration || null,
        service.description || null,
        service.examples ? JSON.stringify(service.examples) : null,
        service.cta,
        service.available ? 1 : 0,
        service.featured ? 1 : 0
      );
    });

    console.log(`${services.length} services migrated`);
  }

  migrateTestimonials(testimonials) {
    if (!testimonials || !Array.isArray(testimonials)) return;

    // Clear existing data
    this.db.prepare('DELETE FROM testimonials').run();

    const insert = this.db.prepare(`
      INSERT INTO testimonials (id, name, role, company, quote)
      VALUES (?, ?, ?, ?, ?)
    `);

    testimonials.forEach(testimonial => {
      insert.run(
        `testimonial-${testimonial.id}`,
        testimonial.name,
        testimonial.role,
        testimonial.company,
        testimonial.quote
      );
    });

    console.log(`${testimonials.length} testimonials migrated`);
  }

  migrateProjects(projects) {
    if (!projects || !Array.isArray(projects)) return;

    // Clear existing data
    this.db.prepare('DELETE FROM projects').run();

    const insert = this.db.prepare(`
      INSERT INTO projects (id, title, description, category, imageUrl, link, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    projects.forEach(project => {
      insert.run(
        `project-${project.id}`,
        project.title,
        project.description,
        project.category,
        project.imageUrl || null,
        project.link || null,
        project.featured ? 1 : 0
      );
    });

    console.log(`${projects.length} projects migrated`);
  }

  migrateInquiries(inquiries) {
    if (!inquiries || !Array.isArray(inquiries)) return;

    // Clear existing data
    this.db.prepare('DELETE FROM inquiries').run();

    const insert = this.db.prepare(`
      INSERT INTO inquiries (id, name, email, phone, message, serviceType, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    inquiries.forEach(inquiry => {
      insert.run(
        `inquiry-${inquiry.id}`,
        inquiry.name,
        inquiry.email,
        inquiry.phone || null,
        inquiry.message,
        inquiry.serviceType || null,
        inquiry.status || 'new'
      );
    });

    console.log(`${inquiries.length} inquiries migrated`);
  }

  initDefaultData() {
    // Initialize with default content from content.ts
    console.log('Initializing with default data...');

    // Hero
    const heroUpdate = this.db.prepare(`
      UPDATE hero SET
        badge = ?,
        title = ?,
        subtitle = ?,
        description = ?,
        primaryCTA = ?,
        secondaryCTA = ?,
        telegramLink = ?,
        image = ?,
        updatedAt = ?
      WHERE id = 1
    `);

    heroUpdate.run(
      defaultContent.heroContent.badge,
      defaultContent.heroContent.title,
      defaultContent.heroContent.subtitle,
      defaultContent.heroContent.description,
      defaultContent.heroContent.primaryCTA,
      defaultContent.heroContent.secondaryCTA,
      defaultContent.heroContent.telegramLink,
      defaultContent.heroContent.image || null,
      new Date().toISOString()
    );

    // About
    const aboutUpdate = this.db.prepare(`
      UPDATE about SET
        title = ?,
        subtitle = ?,
        highlights = ?,
        updatedAt = ?,
        image = ?
      WHERE id = 1
    `);

    aboutUpdate.run(
      defaultContent.aboutContent.title,
      defaultContent.aboutContent.subtitle,
      JSON.stringify(defaultContent.aboutContent.highlights),
      defaultContent.aboutContent.image || null,
      new Date().toISOString()
    );

    // Process steps
    const processInsert = this.db.prepare(`
      INSERT INTO process_steps (id, number, title, description, examples, details)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    defaultContent.processSteps.forEach(step => {
      processInsert.run(
        `process-${step.id}`,
        step.number,
        step.title,
        step.description,
        step.examples ? JSON.stringify(step.examples) : null,
        step.details ? JSON.stringify(step.details) : null
      );
    });

    // Client segments
    const clientInsert = this.db.prepare(`
      INSERT INTO client_segments (id, title, description, icon)
      VALUES (?, ?, ?, ?)
    `);

    defaultContent.clientSegments.forEach(segment => {
      clientInsert.run(
        `client-${segment.id}`,
        segment.title,
        segment.description,
        segment.icon || null
      );
    });

    // Services
    const serviceInsert = this.db.prepare(`
      INSERT INTO services (id, title, price, duration, description, examples, cta, available, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    defaultContent.serviceFormats.forEach(service => {
      serviceInsert.run(
        `service-${service.id}`,
        service.title,
        service.price,
        service.duration || null,
        service.description || null,
        service.examples ? JSON.stringify(service.examples) : null,
        service.cta,
        service.available ? 1 : 0,
        service.featured ? 1 : 0
      );
    });

    // Testimonials
    const testimonialInsert = this.db.prepare(`
      INSERT INTO testimonials (id, name, role, company, quote)
      VALUES (?, ?, ?, ?, ?)
    `);

    defaultContent.testimonials.forEach(testimonial => {
      testimonialInsert.run(
        `testimonial-${testimonial.id}`,
        testimonial.name,
        testimonial.role,
        testimonial.company,
        testimonial.quote
      );
    });

    console.log('Default data initialized successfully');
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

// Run migration
async function runMigration() {
  const migrator = new MigrationScript();

  try {
    await migrator.migrateFromLocalStorage();
    console.log('Migration script completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    migrator.close();
  }
}

if (require.main === module) {
  runMigration();
}

module.exports = MigrationScript;
