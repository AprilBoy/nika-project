const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class AppDatabase {
  constructor() {
    const dbPath = path.join(__dirname, '../../database/app.db');

    // Ensure data directory exists
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    this.db = new Database(dbPath);

    // Enable WAL mode for better concurrency
    this.db.pragma('journal_mode = WAL');

    this.initTables();
    this.initData();
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
        highlights TEXT NOT NULL, -- JSON array
        image TEXT,
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
        examples TEXT, -- JSON array
        details TEXT, -- JSON array
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
        sortOrder INTEGER DEFAULT 0,
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
        examples TEXT, -- JSON array
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
        status TEXT,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Add status column if it doesn't exist (for existing databases)
    try {
      this.db.exec(`ALTER TABLE projects ADD COLUMN status TEXT`);
    } catch (e) {
      // Column already exists, ignore
    }

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

  initData() {
    // Import default content
    const contentPath = path.join(__dirname, '../../src/data/content.ts');
    let defaultContent;

    try {
      // Read and parse the TypeScript file (simplified approach)
      const content = fs.readFileSync(contentPath, 'utf8');

      // Extract data using regex (basic approach)
      const heroMatch = content.match(/export const heroContent = ({[\s\S]*?});/);
      const aboutMatch = content.match(/export const aboutContent = ({[\s\S]*?});/);
      const processMatch = content.match(/export const processSteps = (\[[\s\S]*?\]);/);
      const clientsMatch = content.match(/export const clientSegments = (\[[\s\S]*?\]);/);
      const servicesMatch = content.match(/export const serviceFormats = (\[[\s\S]*?\]);/);
      const testimonialsMatch = content.match(/export const testimonials = (\[[\s\S]*?\]);/);

      if (heroMatch && aboutMatch && processMatch && clientsMatch && servicesMatch && testimonialsMatch) {
        // Use eval to parse the JavaScript objects (not recommended for production)
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
      // Fallback default content
      defaultContent = {
        heroContent: {
          badge: "15+ лет опыта в управлении",
          title: "Ника Шихлинская",
          subtitle: "Системный операционный партнер",
          description: "Превращаю хаос в работающие процессы | Запускаю проекты, строю команды, чиню что сломано | Позабочусь о ваших интересах, как о своих",
          primaryCTA: "Связаться",
          secondaryCTA: "Онлайн-консультация",
          telegramLink: "https://t.me/nikashikh",
          image: "/assets/images/IMG_6236.png"
        },
        aboutContent: {
          title: "Кто я?",
          subtitle: "Системный операционный партнер, который превращает хаос в вашем бизнесе/инфобизнесе в работающую машину - быстро, с заботой и без драмы",
          highlights: [
            "Опыт в сфере управления персонала (руководитель HR-команд) более 6 лет",
            "Руковожу онлайн-школами, проектами и продуктами более 5 лет",
            "Наибольшее кол-во подчиненных в команде - 50 человек",
            "Обучалась у всех лидеров и топов рынка (Гребенюк, Тимочко, Дымшаков и другие)"
          ],
          image: "/assets/images/IMG_6310.png"
        },
        processSteps: [],
        clientSegments: [],
        serviceFormats: [],
        testimonials: []
      };
    }

    // Initialize hero data
    const heroExists = this.db.prepare('SELECT id FROM hero WHERE id = 1').get();
    if (!heroExists) {
      const insertHero = this.db.prepare(`
        INSERT INTO hero (id, badge, title, subtitle, description, primaryCTA, secondaryCTA, telegramLink, image)
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insertHero.run(
        defaultContent.heroContent.badge,
        defaultContent.heroContent.title,
        defaultContent.heroContent.subtitle,
        defaultContent.heroContent.description,
        defaultContent.heroContent.primaryCTA,
        defaultContent.heroContent.secondaryCTA,
        defaultContent.heroContent.telegramLink,
        defaultContent.heroContent.image
      );
    }

    // Initialize about data
    const aboutExists = this.db.prepare('SELECT id FROM about WHERE id = 1').get();
    if (!aboutExists) {
      const insertAbout = this.db.prepare(`
        INSERT INTO about (id, title, subtitle, highlights, image)
        VALUES (1, ?, ?, ?, ?)
      `);
      insertAbout.run(
        defaultContent.aboutContent.title,
        defaultContent.aboutContent.subtitle,
        JSON.stringify(defaultContent.aboutContent.highlights),
        defaultContent.heroContent.image
      );
    }

    // Initialize process steps
    const processCount = this.db.prepare('SELECT COUNT(*) as count FROM process_steps').get();
    if (processCount.count === 0 && defaultContent.processSteps.length > 0) {
      const insertProcess = this.db.prepare(`
        INSERT INTO process_steps (id, number, title, description, examples, details)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      defaultContent.processSteps.forEach(step => {
        insertProcess.run(
          `process-${step.id}`,
          step.number,
          step.title,
          step.description,
          step.examples ? JSON.stringify(step.examples) : null,
          step.details ? JSON.stringify(step.details) : null
        );
      });
    }

    // Initialize client segments
    const clientCount = this.db.prepare('SELECT COUNT(*) as count FROM client_segments').get();
    if (clientCount.count === 0 && defaultContent.clientSegments.length > 0) {
      const insertClient = this.db.prepare(`
        INSERT INTO client_segments (id, title, description, icon, sortOrder)
        VALUES (?, ?, ?, ?, ?)
      `);

      defaultContent.clientSegments.forEach((segment, index) => {
        insertClient.run(
          `client-${segment.id}`,
          segment.title,
          segment.description,
          segment.icon || null,
          segment.sortOrder || null
        );
      });
    }

    // Initialize services
    const serviceCount = this.db.prepare('SELECT COUNT(*) as count FROM services').get();
    if (serviceCount.count === 0 && defaultContent.serviceFormats.length > 0) {
      const insertService = this.db.prepare(`
        INSERT INTO services (id, title, price, duration, description, examples, cta, available, featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      defaultContent.serviceFormats.forEach(service => {
        insertService.run(
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

    // Initialize testimonials
    const testimonialCount = this.db.prepare('SELECT COUNT(*) as count FROM testimonials').get();
    if (testimonialCount.count === 0 && defaultContent.testimonials.length > 0) {
      const insertTestimonial = this.db.prepare(`
        INSERT INTO testimonials (id, name, role, company, quote)
        VALUES (?, ?, ?, ?, ?)
      `);

      defaultContent.testimonials.forEach(testimonial => {
        insertTestimonial.run(
          `testimonial-${testimonial.id}`,
          testimonial.name,
          testimonial.role,
          testimonial.company,
          testimonial.quote
        );
      });
    }
  }

  // Hero methods
  getHero() {
    const row = this.db.prepare('SELECT * FROM hero WHERE id = 1').get();
    if (row) {
      return {
        id: row.id,
        badge: row.badge,
        title: row.title,
        subtitle: row.subtitle,
        description: row.description,
        primaryCTA: row.primaryCTA,
        secondaryCTA: row.secondaryCTA,
        telegramLink: row.telegramLink,
        image: row.image,
        updatedAt: row.updatedAt
      };
    }
    return null;
  }

  updateHero(data) {
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
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = 1
    `);

    update.run(
      data.badge,
      data.title,
      data.subtitle,
      data.description,
      data.primaryCTA,
      data.secondaryCTA,
      data.telegramLink,
      data.image
    );

    return this.getHero();
  }

  // About methods
  getAbout() {
    const row = this.db.prepare('SELECT * FROM about WHERE id = 1').get();
    if (row) {
      return {
        id: row.id,
        title: row.title,
        subtitle: row.subtitle,
        highlights: JSON.parse(row.highlights),
        updatedAt: row.updatedAt
      };
    }
    return null;
  }

  updateAbout(data) {
    const update = this.db.prepare(`
      UPDATE about SET
        title = ?,
        subtitle = ?,
        highlights = ?,
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = 1
    `);

    update.run(
      data.title,
      data.subtitle,
      JSON.stringify(data.highlights)
    );

    return this.getAbout();
  }

  // Process steps methods
  getProcessSteps() {
    const rows = this.db.prepare('SELECT * FROM process_steps ORDER BY number').all();
    return rows.map(row => ({
      id: row.id,
      number: row.number,
      title: row.title,
      description: row.description,
      examples: row.examples ? JSON.parse(row.examples) : null,
      details: row.details ? JSON.parse(row.details) : null,
      updatedAt: row.updatedAt
    }));
  }

  createProcessStep(data) {
    const id = `process-${Date.now()}`;
    const insert = this.db.prepare(`
      INSERT INTO process_steps (id, number, title, description, examples, details)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      data.number,
      data.title,
      data.description,
      data.examples ? JSON.stringify(data.examples) : null,
      data.details ? JSON.stringify(data.details) : null
    );

    return this.getProcessStep(id);
  }

  getProcessStep(id) {
    const row = this.db.prepare('SELECT * FROM process_steps WHERE id = ?').get(id);
    if (row) {
      return {
        id: row.id,
        number: row.number,
        title: row.title,
        description: row.description,
        examples: row.examples ? JSON.parse(row.examples) : null,
        details: row.details ? JSON.parse(row.details) : null,
        updatedAt: row.updatedAt
      };
    }
    return null;
  }

  updateProcessStep(id, data) {
    const update = this.db.prepare(`
      UPDATE process_steps SET
        number = ?,
        title = ?,
        description = ?,
        examples = ?,
        details = ?,
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    update.run(
      data.number,
      data.title,
      data.description,
      data.examples ? JSON.stringify(data.examples) : null,
      data.details ? JSON.stringify(data.details) : null,
      id
    );

    return this.getProcessStep(id);
  }

  deleteProcessStep(id) {
    const deleteStmt = this.db.prepare('DELETE FROM process_steps WHERE id = ?');
    deleteStmt.run(id);

    // Renumber remaining steps
    const rows = this.db.prepare('SELECT id FROM process_steps ORDER BY number').all();
    rows.forEach((row, index) => {
      this.db.prepare('UPDATE process_steps SET number = ? WHERE id = ?').run(index + 1, row.id);
    });
  }

  // Client segments methods
  getClientSegments() {
    const rows = this.db.prepare('SELECT * FROM client_segments ORDER BY sortOrder').all();
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      icon: row.icon,
      sortOrder: row.sortOrder,
      updatedAt: row.updatedAt
    }));
  }

  createClientSegment(data) {
    const id = `client-${Date.now()}`;
    const insert = this.db.prepare(`
      INSERT INTO client_segments (id, title, description, icon, sortOrder)
      VALUES (?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      data.title,
      data.description,
      data.icon || null,
      data.sortOrder || 0
    );

    return this.getClientSegment(id);
  }

  getClientSegment(id) {
    const row = this.db.prepare('SELECT * FROM client_segments WHERE id = ?').get(id);
    if (row) {
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        icon: row.icon,
        sortOrder: row.sortOrder,
        updatedAt: row.updatedAt
      };
    }
    return null;
  }

  updateClientSegment(id, data) {
    const update = this.db.prepare(`
      UPDATE client_segments SET
        title = ?,
        description = ?,
        icon = ?,
        sortOrder = ?,
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    update.run(
      data.title,
      data.description,
      data.icon || null,
      data.sortOrder || 0,
      id
    );

    return this.getClientSegment(id);
  }

  deleteClientSegment(id) {
    const deleteStmt = this.db.prepare('DELETE FROM client_segments WHERE id = ?');
    deleteStmt.run(id);
  }

  // Services methods
  getServices() {
    const rows = this.db.prepare('SELECT * FROM services ORDER BY id').all();
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      price: row.price,
      duration: row.duration,
      description: row.description,
      examples: row.examples ? JSON.parse(row.examples) : null,
      cta: row.cta,
      available: Boolean(row.available),
      featured: Boolean(row.featured),
      updatedAt: row.updatedAt
    }));
  }

  createService(data) {
    const id = `service-${Date.now()}`;
    const insert = this.db.prepare(`
      INSERT INTO services (id, title, price, duration, description, examples, cta, available, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      data.title,
      data.price,
      data.duration || null,
      data.description || null,
      data.examples ? JSON.stringify(data.examples) : null,
      data.cta,
      data.available ? 1 : 0,
      data.featured ? 1 : 0
    );

    return this.getService(id);
  }

  getService(id) {
    const row = this.db.prepare('SELECT * FROM services WHERE id = ?').get(id);
    if (row) {
      return {
        id: row.id,
        title: row.title,
        price: row.price,
        duration: row.duration,
        description: row.description,
        examples: row.examples ? JSON.parse(row.examples) : null,
        cta: row.cta,
        available: Boolean(row.available),
        featured: Boolean(row.featured),
        updatedAt: row.updatedAt
      };
    }
    return null;
  }

  updateService(id, data) {
    const update = this.db.prepare(`
      UPDATE services SET
        title = ?,
        price = ?,
        duration = ?,
        description = ?,
        examples = ?,
        cta = ?,
        available = ?,
        featured = ?,
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    update.run(
      data.title,
      data.price,
      data.duration || null,
      data.description || null,
      data.examples ? JSON.stringify(data.examples) : null,
      data.cta,
      data.available ? 1 : 0,
      data.featured ? 1 : 0,
      id
    );

    return this.getService(id);
  }

  deleteService(id) {
    const deleteStmt = this.db.prepare('DELETE FROM services WHERE id = ?');
    deleteStmt.run(id);
  }

  // Testimonials methods
  getTestimonials() {
    const rows = this.db.prepare('SELECT * FROM testimonials ORDER BY createdAt DESC').all();
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      role: row.role,
      company: row.company,
      quote: row.quote,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }));
  }

  createTestimonial(data) {
    const id = `testimonial-${Date.now()}`;
    const insert = this.db.prepare(`
      INSERT INTO testimonials (id, name, role, company, quote)
      VALUES (?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      data.name,
      data.role,
      data.company,
      data.quote
    );

    return this.getTestimonial(id);
  }

  getTestimonial(id) {
    const row = this.db.prepare('SELECT * FROM testimonials WHERE id = ?').get(id);
    if (row) {
      return {
        id: row.id,
        name: row.name,
        role: row.role,
        company: row.company,
        quote: row.quote,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
      };
    }
    return null;
  }

  updateTestimonial(id, data) {
    const update = this.db.prepare(`
      UPDATE testimonials SET
        name = ?,
        role = ?,
        company = ?,
        quote = ?,
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    update.run(
      data.name,
      data.role,
      data.company,
      data.quote,
      id
    );

    return this.getTestimonial(id);
  }

  deleteTestimonial(id) {
    const deleteStmt = this.db.prepare('DELETE FROM testimonials WHERE id = ?');
    deleteStmt.run(id);
  }

  // Projects methods
  getProjects() {
    const rows = this.db.prepare('SELECT * FROM projects ORDER BY featured DESC, updatedAt DESC').all();
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      imageUrl: row.imageUrl,
      link: row.link,
      featured: Boolean(row.featured),
      status: row.status || null,
      updatedAt: row.updatedAt
    }));
  }

  createProject(data) {
    const id = `project-${Date.now()}`;
    const insert = this.db.prepare(`
      INSERT INTO projects (id, title, description, category, imageUrl, link, featured, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      data.title,
      data.description,
      data.category,
      data.imageUrl || null,
      data.link || null,
      data.featured ? 1 : 0,
      data.status || null
    );

    return this.getProject(id);
  }

  getProject(id) {
    const row = this.db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    if (row) {
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category,
        imageUrl: row.imageUrl,
        link: row.link,
        featured: Boolean(row.featured),
        status: row.status || null,
        updatedAt: row.updatedAt
      };
    }
    return null;
  }

  updateProject(id, data) {
    const update = this.db.prepare(`
      UPDATE projects SET
        title = ?,
        description = ?,
        category = ?,
        imageUrl = ?,
        link = ?,
        featured = ?,
        status = ?,
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    update.run(
      data.title,
      data.description,
      data.category,
      data.imageUrl || null,
      data.link || null,
      data.featured ? 1 : 0,
      data.status || null,
      id
    );

    return this.getProject(id);
  }

  deleteProject(id) {
    const deleteStmt = this.db.prepare('DELETE FROM projects WHERE id = ?');
    deleteStmt.run(id);
  }

  // Inquiries methods
  getInquiries() {
    const rows = this.db.prepare('SELECT * FROM inquiries ORDER BY createdAt DESC').all();
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      message: row.message,
      serviceType: row.serviceType,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }));
  }

  createInquiry(data) {
    const id = `inquiry-${Date.now()}`;
    const insert = this.db.prepare(`
      INSERT INTO inquiries (id, name, email, phone, message, serviceType, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      data.name,
      data.email,
      data.phone || null,
      data.message,
      data.serviceType || null,
      data.status || 'new'
    );

    return this.getInquiry(id);
  }

  getInquiry(id) {
    const row = this.db.prepare('SELECT * FROM inquiries WHERE id = ?').get(id);
    if (row) {
      return {
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        message: row.message,
        serviceType: row.serviceType,
        status: row.status,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
      };
    }
    return null;
  }

  updateInquiry(id, data) {
    const update = this.db.prepare(`
      UPDATE inquiries SET
        name = ?,
        email = ?,
        phone = ?,
        message = ?,
        serviceType = ?,
        status = ?,
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    update.run(
      data.name,
      data.email,
      data.phone || null,
      data.message,
      data.serviceType || null,
      data.status,
      id
    );

    return this.getInquiry(id);
  }

  deleteInquiry(id) {
    const deleteStmt = this.db.prepare('DELETE FROM inquiries WHERE id = ?');
    deleteStmt.run(id);
  }

  // Admin session methods
  createAdminSession(expiresAt) {
    const id = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const insert = this.db.prepare(`
      INSERT INTO admin_sessions (id, expiresAt)
      VALUES (?, ?)
    `);

    insert.run(id, expiresAt);
    return id;
  }

  getAdminSession(id) {
    const row = this.db.prepare('SELECT * FROM admin_sessions WHERE id = ? AND expiresAt > datetime("now")').get(id);
    return row || null;
  }

  deleteAdminSession(id) {
    const deleteStmt = this.db.prepare('DELETE FROM admin_sessions WHERE id = ?');
    deleteStmt.run(id);
  }

  cleanupExpiredSessions() {
    const deleteStmt = this.db.prepare('DELETE FROM admin_sessions WHERE expiresAt <= datetime("now")');
    deleteStmt.run();
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

export default AppDatabase;
