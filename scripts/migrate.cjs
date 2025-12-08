#!/usr/bin/env node

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Import default content
const contentPath = path.join(__dirname, '../src/data/content.ts');
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

    // Initialize tables
    this.initTables();
  }

  initTables() {
    // Hero table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS hero (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        badge TEXT NOT NULL,
        title TEXT NOT NULL,
        subtitle TEXT NOT NULL,
        description TEXT NOT NULL,
        primaryCTA TEXT NOT NULL,
        secondaryCTA TEXT NOT NULL,
        telegramLink TEXT NOT NULL,
        image TEXT,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // About table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS about (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        title TEXT NOT NULL,
        subtitle TEXT NOT NULL,
        highlights TEXT NOT NULL,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Process steps table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS process_steps (
        id TEXT PRIMARY KEY,
        number INTEGER NOT NULL UNIQUE,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        examples TEXT,
        details TEXT,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Client segments table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS client_segments (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        icon TEXT,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Services table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS services (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        price TEXT NOT NULL,
        duration TEXT,
        description TEXT,
        examples TEXT,
        cta TEXT NOT NULL,
        available BOOLEAN DEFAULT 1,
        featured BOOLEAN DEFAULT 0,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Testimonials table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        company TEXT NOT NULL,
        quote TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Projects table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        imageUrl TEXT,
        link TEXT,
        featured BOOLEAN DEFAULT 0,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Inquiries table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT NOT NULL,
        serviceType TEXT,
        status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in-progress', 'completed', 'cancelled')),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Admin sessions table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id TEXT PRIMARY KEY,
        expiresAt DATETIME NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async migrateFromLocalStorage() {
    console.log('Starting migration from localStorage...');

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

    // Check if data already exists
    const heroExists = this.db.prepare('SELECT COUNT(*) as count FROM hero').get().count > 0;
    const aboutExists = this.db.prepare('SELECT COUNT(*) as count FROM about').get().count > 0;
    const processExists = this.db.prepare('SELECT COUNT(*) as count FROM process_steps').get().count > 0;
    const clientExists = this.db.prepare('SELECT COUNT(*) as count FROM client_segments').get().count > 0;
    const serviceExists = this.db.prepare('SELECT COUNT(*) as count FROM services').get().count > 0;
    const testimonialExists = this.db.prepare('SELECT COUNT(*) as count FROM testimonials').get().count > 0;

    // Hero
    if (!heroExists) {
      const heroInsert = this.db.prepare(`
        INSERT INTO hero (id, badge, title, subtitle, description, primaryCTA, secondaryCTA, telegramLink, image, updatedAt)
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      heroInsert.run(
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
    } else {
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
    }

    // About
    if (!aboutExists) {
      const aboutInsert = this.db.prepare(`
        INSERT INTO about (id, title, subtitle, highlights, updatedAt)
        VALUES (1, ?, ?, ?, ?)
      `);

      aboutInsert.run(
        defaultContent.aboutContent.title,
        defaultContent.aboutContent.subtitle,
        JSON.stringify(defaultContent.aboutContent.highlights),
        new Date().toISOString()
      );
    } else {
      const aboutUpdate = this.db.prepare(`
        UPDATE about SET
          title = ?,
          subtitle = ?,
          highlights = ?,
          updatedAt = ?
        WHERE id = 1
      `);

      aboutUpdate.run(
        defaultContent.aboutContent.title,
        defaultContent.aboutContent.subtitle,
        JSON.stringify(defaultContent.aboutContent.highlights),
        new Date().toISOString()
      );
    }

    // Process steps - only insert if table is empty
    if (!processExists) {
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
    }

    // Client segments - only insert if table is empty
    if (!clientExists) {
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
    }

    // Services - only insert if table is empty
    if (!serviceExists) {
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
    }

    // Testimonials - only insert if table is empty
    if (!testimonialExists) {
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
    }

    console.log('Default data initialization completed');
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
