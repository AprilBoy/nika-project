#!/usr/bin/env node

/**
 * Safe migration script for Nika Project
 *
 * - no eval, no regex
 * - uses better-sqlite3 synchronously
 * - creates missing tables/columns
 * - simple migrations table for idempotence
 * - reads default content from ../src/data/content.json (optional)
 */

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, '../data/app.db');
const DEFAULT_CONTENT_PATH = path.join(__dirname, '../src/data/content.json');

function loadDefaultContent() {
  if (!fs.existsSync(DEFAULT_CONTENT_PATH)) {
    console.warn(`Default content file not found at ${DEFAULT_CONTENT_PATH}. Skipping default data initialization.`);
    return null;
  }

  try {
    const txt = fs.readFileSync(DEFAULT_CONTENT_PATH, 'utf8');
    const parsed = JSON.parse(txt);
    console.log('Loaded default content from default-content.json');
    return parsed;
  } catch (err) {
    console.error('Failed to parse default-content.json:', err);
    return null;
  }
}

// Utility: check if column exists
function hasColumn(db, table, column) {
  try {
    const cols = db.prepare(`PRAGMA table_info(${table})`).all();
    return cols.some(c => c.name === column);
  } catch (err) {
    return false;
  }
}

// Utility: create directory and DB connection
function openDatabase() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const db = new Database(DB_PATH);
  // enable WAL for safety/performance
  try { db.pragma('journal_mode = WAL'); } catch (e) { /* ignore */ }
  return db;
}

// Simple migrations mechanism
const MIGRATIONS = [
  {
    id: '000_create_base_tables',
    up(db) {
      // Create migrations table
      db.exec(`
        CREATE TABLE IF NOT EXISTS migrations (
          id TEXT PRIMARY KEY,
          appliedAt TEXT NOT NULL
        );
      `);

      // hero table (single row with id 1)
      db.exec(`
        CREATE TABLE IF NOT EXISTS hero (
          id INTEGER PRIMARY KEY,
          badge TEXT,
          title TEXT,
          subtitle TEXT,
          description TEXT,
          primaryCTA TEXT,
          secondaryCTA TEXT,
          telegramLink TEXT,
          image TEXT,
          updatedAt TEXT
        );
      `);

      // about table
      db.exec(`
        CREATE TABLE IF NOT EXISTS about (
          id INTEGER PRIMARY KEY,
          title TEXT,
          subtitle TEXT,
          highlights TEXT,
          image TEXT,
          updatedAt TEXT
        );
      `);

      // process_steps
      db.exec(`
        CREATE TABLE IF NOT EXISTS process_steps (
          id TEXT PRIMARY KEY,
          number INTEGER,
          title TEXT,
          description TEXT,
          examples TEXT,
          details TEXT
        );
      `);

      // client_segments
      db.exec(`
        CREATE TABLE IF NOT EXISTS client_segments (
          id TEXT PRIMARY KEY,
          title TEXT,
          description TEXT,
          icon TEXT,
          sortOrder INTEGER DEFAULT 0
        );
      `);

      // services
      db.exec(`
        CREATE TABLE IF NOT EXISTS services (
          id TEXT PRIMARY KEY,
          title TEXT,
          price TEXT,
          duration TEXT,
          description TEXT,
          examples TEXT,
          cta TEXT,
          available INTEGER DEFAULT 0,
          featured INTEGER DEFAULT 0
        );
      `);

      // testimonials
      db.exec(`
        CREATE TABLE IF NOT EXISTS testimonials (
          id TEXT PRIMARY KEY,
          name TEXT,
          role TEXT,
          company TEXT,
          quote TEXT
        );
      `);

      // projects
      db.exec(`
        CREATE TABLE IF NOT EXISTS projects (
          id TEXT PRIMARY KEY,
          title TEXT,
          description TEXT,
          category TEXT,
          imageUrl TEXT,
          link TEXT,
          featured INTEGER DEFAULT 0
        );
      `);

      // inquiries
      db.exec(`
        CREATE TABLE IF NOT EXISTS inquiries (
          id TEXT PRIMARY KEY,
          name TEXT,
          email TEXT,
          phone TEXT,
          message TEXT,
          serviceType TEXT,
          status TEXT DEFAULT 'new'
        );
      `);
    }
  },
  {
    id: '001_ensure_columns_image',
    up(db) {
      // Ensure hero.image exists
      if (!hasColumn(db, 'hero', 'image')) {
        db.exec(`ALTER TABLE hero ADD COLUMN image TEXT;`);
        console.log('Added column hero.image');
      }

      // Ensure about.image exists
      if (!hasColumn(db, 'about', 'image')) {
        db.exec(`ALTER TABLE about ADD COLUMN image TEXT;`);
        console.log('Added column about.image');
      }

      // Ensure services.available and services.featured exist (in case older schema)
      if (!hasColumn(db, 'services', 'available')) {
        db.exec(`ALTER TABLE services ADD COLUMN available INTEGER DEFAULT 0;`);
        console.log('Added column services.available');
      }
      if (!hasColumn(db, 'services', 'featured')) {
        db.exec(`ALTER TABLE services ADD COLUMN featured INTEGER DEFAULT 0;`);
        console.log('Added column services.featured');
      }

      // Ensure client_segments.sortOrder exists
      if (!hasColumn(db, 'client_segments', 'sortOrder')) {
        db.exec(`ALTER TABLE client_segments ADD COLUMN sortOrder INTEGER DEFAULT 0;`);
        console.log('Added column client_segments.sortOrder');
      }
    }
  }
];

// Apply migrations idempotently
function applyMigrations(db) {
  // ensure migrations table exists (first migration will create it)
  db.exec(`CREATE TABLE IF NOT EXISTS migrations (id TEXT PRIMARY KEY, appliedAt TEXT NOT NULL);`);

  const getMigration = db.prepare('SELECT id FROM migrations WHERE id = ?');

  const insertMigration = db.prepare('INSERT INTO migrations (id, appliedAt) VALUES (?, ?)');

  for (const m of MIGRATIONS) {
    const found = getMigration.get(m.id);
    if (found) {
      console.log(`Migration ${m.id} already applied, skipping`);
      continue;
    }

    console.log(`Applying migration ${m.id}...`);
    const txn = db.transaction(() => {
      m.up(db);
      insertMigration.run(m.id, new Date().toISOString());
    });

    try {
      txn();
      console.log(`Migration ${m.id} applied`);
    } catch (err) {
      console.error(`Failed to apply migration ${m.id}:`, err);
      throw err;
    }
  }
}

// Initialize default data (only if tables empty)
function initializeDefaultData(db, defaultContent) {
  if (!defaultContent) {
    console.log('No default content provided - skipping default data init.');
    return;
  }

  // HERO - if hero table empty, insert or upsert a row with id=1
  const heroCount = db.prepare('SELECT COUNT(*) as c FROM hero').get().c;
  if (heroCount === 0) {
    const insertHero = db.prepare(`
      INSERT INTO hero (id, badge, title, subtitle, description, primaryCTA, secondaryCTA, telegramLink, image, updatedAt)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertHero.run(
      defaultContent.heroContent?.badge || null,
      defaultContent.heroContent?.title || null,
      defaultContent.heroContent?.subtitle || null,
      defaultContent.heroContent?.description || null,
      defaultContent.heroContent?.primaryCTA || null,
      defaultContent.heroContent?.secondaryCTA || null,
      defaultContent.heroContent?.telegramLink || null,
      defaultContent.heroContent?.image || null,
      new Date().toISOString()
    );
    console.log('Inserted default hero row');
  } else {
    // optional: update existing hero with defaults (non-destructive)
    const updateHero = db.prepare(`
      UPDATE hero SET
        badge = COALESCE(?, badge),
        title = COALESCE(?, title),
        subtitle = COALESCE(?, subtitle),
        description = COALESCE(?, description),
        primaryCTA = COALESCE(?, primaryCTA),
        secondaryCTA = COALESCE(?, secondaryCTA),
        telegramLink = COALESCE(?, telegramLink),
        image = COALESCE(?, image),
        updatedAt = ?
      WHERE id = 1
    `);
    updateHero.run(
      defaultContent.heroContent?.badge || null,
      defaultContent.heroContent?.title || null,
      defaultContent.heroContent?.subtitle || null,
      defaultContent.heroContent?.description || null,
      defaultContent.heroContent?.primaryCTA || null,
      defaultContent.heroContent?.secondaryCTA || null,
      defaultContent.heroContent?.telegramLink || null,
      defaultContent.heroContent?.image || null,
      new Date().toISOString()
    );
    console.log('Updated existing hero row with defaults where applicable');
  }

  // ABOUT
  const aboutCount = db.prepare('SELECT COUNT(*) as c FROM about').get().c;
  if (aboutCount === 0) {
    const insertAbout = db.prepare(`
      INSERT INTO about (id, title, subtitle, highlights, image, updatedAt)
      VALUES (1, ?, ?, ?, ?, ?)
    `);
    insertAbout.run(
      defaultContent.aboutContent?.title || null,
      defaultContent.aboutContent?.subtitle || null,
      defaultContent.aboutContent?.highlights ? JSON.stringify(defaultContent.aboutContent.highlights) : null,
      defaultContent.aboutContent?.image || null,
      new Date().toISOString()
    );
    console.log('Inserted default about row');
  } else {
    const updateAbout = db.prepare(`
      UPDATE about SET
        title = COALESCE(?, title),
        subtitle = COALESCE(?, subtitle),
        highlights = COALESCE(?, highlights),
        image = COALESCE(?, image),
        updatedAt = ?
      WHERE id = 1
    `);
    updateAbout.run(
      defaultContent.aboutContent?.title || null,
      defaultContent.aboutContent?.subtitle || null,
      defaultContent.aboutContent?.highlights ? JSON.stringify(defaultContent.aboutContent.highlights) : null,
      defaultContent.aboutContent?.image || null,
      new Date().toISOString()
    );
    console.log('Updated existing about row with defaults where applicable');
  }

  // PROCESS STEPS - clear only if table empty
  const processCount = db.prepare('SELECT COUNT(*) as c FROM process_steps').get().c;
  if (processCount === 0 && Array.isArray(defaultContent.processSteps)) {
    const insert = db.prepare(`
      INSERT INTO process_steps (id, number, title, description, examples, details)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const t = db.transaction((steps) => {
      steps.forEach(step => {
        insert.run(
          `process-${step.id || step.number || Math.random().toString(36).slice(2,8)}`,
          step.number || null,
          step.title || null,
          step.description || null,
          step.examples ? JSON.stringify(step.examples) : null,
          step.details ? JSON.stringify(step.details) : null
        );
      });
    });
    t(defaultContent.processSteps);
    console.log(`Inserted ${defaultContent.processSteps.length} process steps`);
  }

  // CLIENT SEGMENTS
  const clientCount = db.prepare('SELECT COUNT(*) as c FROM client_segments').get().c;
  if (clientCount === 0 && Array.isArray(defaultContent.clientSegments)) {
    const insert = db.prepare(`
      INSERT INTO client_segments (id, title, description, icon, sortOrder)
      VALUES (?, ?, ?, ?, ?)
    `);
    const t = db.transaction((list) => {
      list.forEach((item, index) => {
        insert.run(
          `client-${item.id || Math.random().toString(36).slice(2,8)}`,
          item.title || null,
          item.description || null,
          item.icon || null,
          index
        );
      });
    });
    t(defaultContent.clientSegments);
    console.log(`Inserted ${defaultContent.clientSegments.length} client segments`);
  }

  // SERVICES
  const servicesCount = db.prepare('SELECT COUNT(*) as c FROM services').get().c;
  if (servicesCount === 0 && Array.isArray(defaultContent.serviceFormats)) {
    const insert = db.prepare(`
      INSERT INTO services (id, title, price, duration, description, examples, cta, available, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const t = db.transaction((list) => {
      list.forEach(item => {
        insert.run(
          `service-${item.id || Math.random().toString(36).slice(2,8)}`,
          item.title || null,
          item.price || null,
          item.duration || null,
          item.description ? item.description : null,
          item.examples ? JSON.stringify(item.examples) : null,
          item.cta || null,
          item.available ? 1 : 0,
          item.featured ? 1 : 0
        );
      });
    });
    t(defaultContent.serviceFormats);
    console.log(`Inserted ${defaultContent.serviceFormats.length} services`);
  }

  // TESTIMONIALS
  const testimonialsCount = db.prepare('SELECT COUNT(*) as c FROM testimonials').get().c;
  if (testimonialsCount === 0 && Array.isArray(defaultContent.testimonials)) {
    const insert = db.prepare(`
      INSERT INTO testimonials (id, name, role, company, quote)
      VALUES (?, ?, ?, ?, ?)
    `);
    const t = db.transaction((list) => {
      list.forEach(item => {
        insert.run(
          `testimonial-${item.id || Math.random().toString(36).slice(2,8)}`,
          item.name || null,
          item.role || null,
          item.company || null,
          item.quote || null
        );
      });
    });
    t(defaultContent.testimonials);
    console.log(`Inserted ${defaultContent.testimonials.length} testimonials`);
  }

  // PROJECTS
  const projectsCount = db.prepare('SELECT COUNT(*) as c FROM projects').get().c;
  if (projectsCount === 0 && Array.isArray(defaultContent.projects)) {
    const insert = db.prepare(`
      INSERT INTO projects (id, title, description, category, imageUrl, link, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const t = db.transaction((list) => {
      list.forEach(item => {
        insert.run(
          `project-${item.id || Math.random().toString(36).slice(2,8)}`,
          item.title || null,
          item.description || null,
          item.category || null,
          item.imageUrl || null,
          item.link || null,
          item.featured ? 1 : 0
        );
      });
    });
    t(defaultContent.projects);
    console.log(`Inserted ${defaultContent.projects.length} projects`);
  }

  // INQUIRIES - not usually seeded
  console.log('Default data initialization completed.');
}

function main() {
  console.log('Migration started');

  const defaultContent = loadDefaultContent();

  const db = openDatabase();

  try {
    // Apply migrations
    applyMigrations(db);

    // Initialize default data if needed
    initializeDefaultData(db, defaultContent);

    console.log('Migration finished successfully');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  } finally {
    try { db.close(); } catch (e) { /* ignore */ }
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  openDatabase,
  applyMigrations,
  initializeDefaultData,
  loadDefaultContent
};
