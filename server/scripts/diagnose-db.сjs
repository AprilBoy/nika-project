#!/usr/bin/env node

/**
 * Database diagnostic script for production issues
 * Run this in the Docker container to check database state
 */

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../database/app.db');

console.log('Database Diagnostic Script');
console.log('==========================');
console.log(`Database path: ${DB_PATH}`);
console.log(`Database exists: ${fs.existsSync(DB_PATH)}`);

if (!fs.existsSync(DB_PATH)) {
  console.error('Database file does not exist!');
  process.exit(1);
}

// Check file permissions
try {
  const stats = fs.statSync(DB_PATH);
  console.log(`File size: ${stats.size} bytes`);
  console.log(`File permissions: ${stats.mode.toString(8)}`);
  console.log(`File owner: ${stats.uid}`);
} catch (error) {
  console.error('Error checking file stats:', error);
}

try {
  console.log('\nOpening database...');
  const db = new Database(DB_PATH);

  // Enable WAL mode
  db.pragma('journal_mode = WAL');

  // Check if tables exist
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log(`\nFound ${tables.length} tables:`);
  tables.forEach(table => console.log(`  - ${table.name}`));

  // Check client_segments table specifically
  if (tables.some(t => t.name === 'client_segments')) {
    console.log('\nChecking client_segments table...');
    const count = db.prepare('SELECT COUNT(*) as count FROM client_segments').get();
    console.log(`Client segments count: ${count.count}`);

    if (count.count > 0) {
      const segments = db.prepare('SELECT id, title, sortOrder FROM client_segments ORDER BY sortOrder').all();
      console.log('Client segments:');
      segments.forEach(segment => {
        console.log(`  ID: ${segment.id}, Title: ${segment.title}, Sort: ${segment.sortOrder}`);
      });
    }

    // Test the exact query used in getClientSegments
    console.log('\nTesting getClientSegments query...');
    const rows = db.prepare('SELECT * FROM client_segments ORDER BY sortOrder').all();
    console.log(`Query returned ${rows.length} rows`);

    // Test mapping
    const result = rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      icon: row.icon,
      sortOrder: row.sortOrder,
      updatedAt: row.updatedAt
    }));
    console.log('Mapping successful, first result:', result[0]);
  } else {
    console.error('client_segments table does not exist!');
  }

  db.close();
  console.log('\nDatabase check completed successfully');

} catch (error) {
  console.error('Database error:', error);
  console.error('Error stack:', error.stack);
  process.exit(1);
}
