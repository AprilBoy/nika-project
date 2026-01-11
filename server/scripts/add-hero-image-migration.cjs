#!/usr/bin/env node

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Migration to add image field to hero table
class HeroImageMigration {
  constructor() {
    const dbPath = path.join(__dirname, '../../database/app.db');

    // Ensure data directory exists
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
  }

  async migrate() {
    console.log('Starting hero image field migration...');

    try {
      // Check if image column exists in hero table
      const columns = this.db.prepare("PRAGMA table_info(hero)").all();
      const hasImageColumn = columns.some(col => col.name === 'image');

      if (!hasImageColumn) {
        console.log('Adding image column to hero table...');

        // Add image column to hero table
        this.db.exec(`
          ALTER TABLE hero ADD COLUMN image TEXT;
        `);

        console.log('Image column added successfully');
      } else {
        console.log('Image column already exists in hero table');
      }

      // Check if there's existing hero data and set default image if image is null
      const heroRow = this.db.prepare('SELECT * FROM hero WHERE id = 1').get();
      if (heroRow && !heroRow.image) {
        console.log('Setting default image for existing hero data...');

        this.db.prepare(`
          UPDATE hero SET image = ? WHERE id = 1 AND image IS NULL
        `).run('/assets/images/IMG_6310.png');

        console.log('Default image set for existing hero data');
      }

      console.log('Hero image migration completed successfully!');
    } catch (error) {
      console.error('Error during hero image migration:', error);
      throw error;
    }
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

// Run migration
async function runMigration() {
  const migrator = new HeroImageMigration();

  try {
    await migrator.migrate();
    console.log('Hero image migration script completed successfully!');
  } catch (error) {
    console.error('Hero image migration failed:', error);
    process.exit(1);
  } finally {
    migrator.close();
  }
}

if (require.main === module) {
  runMigration();
}

module.exports = HeroImageMigration;
