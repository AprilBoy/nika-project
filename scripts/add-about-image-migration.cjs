#!/usr/bin/env node

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Migration to add image field to about table
class AboutImageMigration {
  constructor() {
    const dbPath = path.join(__dirname, '../data/app.db');

    // Ensure data directory exists
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
  }

  async migrate() {
    console.log('Starting about image field migration...');

    try {
      // Check if image column exists in about table
      const columns = this.db.prepare("PRAGMA table_info(about)").all();
      const hasImageColumn = columns.some(col => col.name === 'image');

      if (!hasImageColumn) {
        console.log('Adding image column to about table...');

        // Add image column to about table
        this.db.exec(`
          ALTER TABLE about ADD COLUMN image TEXT;
        `);

        console.log('Image column added successfully');
      } else {
        console.log('Image column already exists in about table');
      }

      console.log('About image migration completed successfully!');
    } catch (error) {
      console.error('Error during about image migration:', error);
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
  const migrator = new AboutImageMigration();

  try {
    await migrator.migrate();
    console.log('About image migration script completed successfully!');
  } catch (error) {
    console.error('About image migration failed:', error);
    process.exit(1);
  } finally {
    migrator.close();
  }
}

if (require.main === module) {
  runMigration();
}

module.exports = AboutImageMigration;
