#!/usr/bin/env node

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class ImageColumnMigration {
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

  async runMigration() {
    console.log('🔄 Checking if image column migration is needed...');

    try {
      // Check if image column already exists
      const columns = this.db.prepare(`
        PRAGMA table_info(hero)
      `).all();

      const hasImageColumn = columns.some(col => col.name === 'image');

      if (hasImageColumn) {
        console.log('✅ Image column already exists. Migration not needed.');
        return;
      }

      console.log('📝 Adding image column to hero table...');

      // Add image column to existing hero table
      this.db.exec(`
        ALTER TABLE hero ADD COLUMN image TEXT;
      `);

      console.log('✅ Successfully added image column to hero table');

      // Optionally, set default image value if hero record exists
      const heroExists = this.db.prepare('SELECT id FROM hero WHERE id = 1').get();
      if (heroExists) {
        console.log('📝 Setting default image value for existing hero record...');
        this.db.prepare(`
          UPDATE hero SET image = NULL WHERE id = 1
        `).run();
      }

    } catch (error) {
      console.error('❌ Migration failed:', error);
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
async function runImageColumnMigration() {
  const migrator = new ImageColumnMigration();

  try {
    await migrator.runMigration();
    console.log('🎉 Image column migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    migrator.close();
  }
}

if (require.main === module) {
  runImageColumnMigration();
}

module.exports = ImageColumnMigration;
