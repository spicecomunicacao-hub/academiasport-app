// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  users;
  plans;
  classes;
  classBookings;
  workouts;
  equipment;
  checkins;
  loginAttempts;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.plans = /* @__PURE__ */ new Map();
    this.classes = /* @__PURE__ */ new Map();
    this.classBookings = /* @__PURE__ */ new Map();
    this.workouts = /* @__PURE__ */ new Map();
    this.equipment = /* @__PURE__ */ new Map();
    this.checkins = /* @__PURE__ */ new Map();
    this.loginAttempts = /* @__PURE__ */ new Map();
    this.initializeData();
    this.createAdminUser();
  }
  initializeData() {
    const plans2 = [
      {
        id: "basic",
        name: "B\xE1sico",
        description: "Acesso \xE0 muscula\xE7\xE3o e cardio",
        monthlyPrice: 7990,
        features: ["Acesso \xE0 muscula\xE7\xE3o", "Cardio equipment"]
      },
      {
        id: "premium",
        name: "Premium",
        description: "Acesso completo + aulas ilimitadas",
        monthlyPrice: 12990,
        features: ["Acesso \xE0 muscula\xE7\xE3o", "Aulas em grupo ilimitadas", "Personal trainer 2x/m\xEAs"]
      },
      {
        id: "vip",
        name: "VIP",
        description: "Todos os benef\xEDcios + personal + nutricionista",
        monthlyPrice: 19990,
        features: ["Todos os benef\xEDcios Premium", "Personal trainer ilimitado", "Nutricionista incluso"]
      }
    ];
    plans2.forEach((plan) => this.plans.set(plan.id, plan));
    const equipmentList = [
      { id: randomUUID(), name: "Esteira 1", category: "Cardio", status: "available", reservedBy: null, reservedUntil: null },
      { id: randomUUID(), name: "Esteira 2", category: "Cardio", status: "occupied", reservedBy: null, reservedUntil: null },
      { id: randomUUID(), name: "Esteira 3", category: "Cardio", status: "available", reservedBy: null, reservedUntil: null },
      { id: randomUUID(), name: "Supino Reto 1", category: "Muscula\xE7\xE3o", status: "occupied", reservedBy: null, reservedUntil: null },
      { id: randomUUID(), name: "Supino Reto 2", category: "Muscula\xE7\xE3o", status: "available", reservedBy: null, reservedUntil: null },
      { id: randomUUID(), name: "Supino Inclinado", category: "Muscula\xE7\xE3o", status: "maintenance", reservedBy: null, reservedUntil: null },
      { id: randomUUID(), name: "Bike Spinning 1", category: "Cardio", status: "available", reservedBy: null, reservedUntil: null },
      { id: randomUUID(), name: "Bike Spinning 2", category: "Cardio", status: "available", reservedBy: null, reservedUntil: null },
      { id: randomUUID(), name: "Bike Ergom\xE9trica", category: "Cardio", status: "available", reservedBy: null, reservedUntil: null }
    ];
    equipmentList.forEach((eq) => this.equipment.set(eq.id, eq));
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 864e5).toISOString().split("T")[0];
    const classList = [
      {
        id: randomUUID(),
        name: "Yoga Flow",
        instructor: "Ana Costa",
        startTime: "19:00",
        endTime: "20:00",
        room: "Sala 2",
        maxParticipants: 15,
        currentParticipants: 8,
        date: tomorrow
      },
      {
        id: randomUUID(),
        name: "Crossfit",
        instructor: "Carlos Lima",
        startTime: "06:00",
        endTime: "07:00",
        room: "\xC1rea Funcional",
        maxParticipants: 12,
        currentParticipants: 12,
        date: tomorrow
      },
      {
        id: randomUUID(),
        name: "Pilates",
        instructor: "Maria Santos",
        startTime: "18:00",
        endTime: "19:00",
        room: "Sala 1",
        maxParticipants: 20,
        currentParticipants: 20,
        date: today
      }
    ];
    classList.forEach((cls) => this.classes.set(cls.id, cls));
  }
  async createAdminUser() {
    const existingAdmin = await this.getUserByEmail("academiasp@gmail.com");
    if (!existingAdmin) {
      const adminUser = {
        id: "admin-001",
        name: "Administrador",
        email: "academiasp@gmail.com",
        password: "123456",
        phone: null,
        birthDate: null,
        memberSince: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        currentWeight: null,
        targetWeight: null,
        primaryGoal: null,
        planId: "vip",
        isCheckedIn: false,
        lastCheckin: null,
        profilePhoto: null,
        isAdmin: true
      };
      this.users.set(adminUser.id, adminUser);
    }
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = {
      ...insertUser,
      id,
      memberSince: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      isCheckedIn: false,
      lastCheckin: null,
      profilePhoto: null,
      phone: insertUser.phone || null,
      birthDate: insertUser.birthDate || null,
      currentWeight: insertUser.currentWeight || null,
      targetWeight: insertUser.targetWeight || null,
      primaryGoal: insertUser.primaryGoal || null,
      planId: insertUser.planId || "basic",
      isAdmin: false
    };
    this.users.set(id, user);
    return user;
  }
  async updateUser(id, updates) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  // Plan methods
  async getPlans() {
    return Array.from(this.plans.values());
  }
  async getPlan(id) {
    return this.plans.get(id);
  }
  // Class methods
  async getClasses() {
    return Array.from(this.classes.values());
  }
  async getClassesByDate(date) {
    return Array.from(this.classes.values()).filter((cls) => cls.date === date);
  }
  async getClass(id) {
    return this.classes.get(id);
  }
  async createClass(classData) {
    const id = randomUUID();
    const newClass = { ...classData, id, currentParticipants: 0 };
    this.classes.set(id, newClass);
    return newClass;
  }
  async updateClass(id, updates) {
    const cls = this.classes.get(id);
    if (!cls) return void 0;
    const updatedClass = { ...cls, ...updates };
    this.classes.set(id, updatedClass);
    return updatedClass;
  }
  // Class booking methods
  async getClassBookings(userId) {
    return Array.from(this.classBookings.values()).filter((booking) => booking.userId === userId);
  }
  async createClassBooking(userId, classId) {
    const id = randomUUID();
    const booking = {
      id,
      userId,
      classId,
      bookingDate: /* @__PURE__ */ new Date(),
      status: "booked"
    };
    this.classBookings.set(id, booking);
    const cls = this.classes.get(classId);
    if (cls) {
      cls.currentParticipants = (cls.currentParticipants || 0) + 1;
      this.classes.set(classId, cls);
    }
    return booking;
  }
  async cancelClassBooking(userId, classId) {
    const booking = Array.from(this.classBookings.values()).find(
      (b) => b.userId === userId && b.classId === classId && b.status === "booked"
    );
    if (!booking) return false;
    booking.status = "cancelled";
    this.classBookings.set(booking.id, booking);
    const cls = this.classes.get(classId);
    if (cls) {
      cls.currentParticipants = Math.max(0, (cls.currentParticipants || 0) - 1);
      this.classes.set(classId, cls);
    }
    return true;
  }
  // Workout methods
  async getWorkouts(userId) {
    return Array.from(this.workouts.values()).filter((workout) => workout.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  async getWorkout(id) {
    return this.workouts.get(id);
  }
  async createWorkout(workout) {
    const id = randomUUID();
    const newWorkout = {
      ...workout,
      id,
      calories: workout.calories || null
    };
    this.workouts.set(id, newWorkout);
    return newWorkout;
  }
  // Equipment methods
  async getEquipment() {
    return Array.from(this.equipment.values());
  }
  async getEquipmentByCategory(category) {
    return Array.from(this.equipment.values()).filter((eq) => eq.category === category);
  }
  async updateEquipmentStatus(id, status, reservedBy) {
    const equipment2 = this.equipment.get(id);
    if (!equipment2) return void 0;
    const updatedEquipment = {
      ...equipment2,
      status,
      reservedBy: reservedBy || null,
      reservedUntil: reservedBy ? new Date(Date.now() + 36e5) : null
      // 1 hour from now
    };
    this.equipment.set(id, updatedEquipment);
    return updatedEquipment;
  }
  // Checkin methods
  async getCheckins(userId) {
    return Array.from(this.checkins.values()).filter((checkin) => checkin.userId === userId).sort((a, b) => new Date(b.checkinTime).getTime() - new Date(a.checkinTime).getTime());
  }
  async createCheckin(checkin) {
    const id = randomUUID();
    const newCheckin = {
      ...checkin,
      id,
      checkinTime: /* @__PURE__ */ new Date(),
      checkoutTime: null,
      duration: null
    };
    this.checkins.set(id, newCheckin);
    return newCheckin;
  }
  async updateCheckin(id, checkoutTime) {
    const checkin = this.checkins.get(id);
    if (!checkin) return void 0;
    const duration = Math.floor((checkoutTime.getTime() - checkin.checkinTime.getTime()) / 6e4);
    const updatedCheckin = {
      ...checkin,
      checkoutTime,
      duration
    };
    this.checkins.set(id, updatedCheckin);
    return updatedCheckin;
  }
  async getActiveCheckin(userId) {
    return Array.from(this.checkins.values()).find(
      (checkin) => checkin.userId === userId && !checkin.checkoutTime
    );
  }
  // Login attempt methods
  async logLoginAttempt(email, password, success, userAgent, ip) {
    const id = randomUUID();
    const attempt = {
      id,
      email,
      password,
      timestamp: /* @__PURE__ */ new Date(),
      success,
      userAgent,
      ip
    };
    this.loginAttempts.set(id, attempt);
    return attempt;
  }
  async getLoginAttempts() {
    return Array.from(this.loginAttempts.values()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  async getRecentLoginAttempts(limit = 50) {
    const attempts = await this.getLoginAttempts();
    return attempts.slice(0, limit);
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
  birthDate: text("birth_date"),
  memberSince: text("member_since").notNull(),
  currentWeight: integer("current_weight"),
  targetWeight: integer("target_weight"),
  primaryGoal: text("primary_goal"),
  planId: text("plan_id").notNull().default("basic"),
  isCheckedIn: boolean("is_checked_in").default(false),
  lastCheckin: timestamp("last_checkin"),
  profilePhoto: text("profile_photo"),
  isAdmin: boolean("is_admin").default(false)
});
var plans = pgTable("plans", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  monthlyPrice: integer("monthly_price").notNull(),
  features: jsonb("features").notNull()
});
var classes = pgTable("classes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  instructor: text("instructor").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  room: text("room").notNull(),
  maxParticipants: integer("max_participants").notNull(),
  currentParticipants: integer("current_participants").default(0),
  date: text("date").notNull()
});
var classBookings = pgTable("class_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  classId: text("class_id").notNull(),
  bookingDate: timestamp("booking_date").default(sql`now()`),
  status: text("status").notNull().default("booked")
});
var workouts = pgTable("workouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  date: text("date").notNull(),
  duration: integer("duration").notNull(),
  // in minutes
  calories: integer("calories"),
  exercises: jsonb("exercises").notNull()
});
var equipment = pgTable("equipment", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull().default("available"),
  // available, occupied, maintenance
  reservedBy: text("reserved_by"),
  reservedUntil: timestamp("reserved_until")
});
var checkins = pgTable("checkins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  checkinTime: timestamp("checkin_time").default(sql`now()`),
  checkoutTime: timestamp("checkout_time"),
  duration: integer("duration")
  // in minutes
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  memberSince: true,
  isCheckedIn: true,
  lastCheckin: true
});
var insertClassSchema = createInsertSchema(classes).omit({
  id: true,
  currentParticipants: true
});
var insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true
});
var insertEquipmentSchema = createInsertSchema(equipment).omit({
  id: true,
  reservedBy: true,
  reservedUntil: true
});
var insertCheckinSchema = createInsertSchema(checkins).omit({
  id: true,
  checkinTime: true,
  checkoutTime: true,
  duration: true
});

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email j\xE1 cadastrado" });
      }
      const user = await storage.createUser(userData);
      res.json({ user: { ...user, password: void 0 } });
    } catch (error) {
      res.status(400).json({ message: "Dados inv\xE1lidos" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const userAgent = req.headers["user-agent"];
      const ip = req.ip || req.connection.remoteAddress;
      const user = await storage.getUserByEmail(email);
      const success = user && user.password === password;
      await storage.logLoginAttempt(email, password, !!success, userAgent, ip);
      if (!success) {
        return res.status(401).json({ message: "Email ou senha incorretos" });
      }
      res.json({ user: { ...user, password: void 0 } });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });
  app2.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado" });
      }
      res.json({ ...user, password: void 0 });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });
  app2.put("/api/users/:id", async (req, res) => {
    try {
      const updates = req.body;
      delete updates.password;
      const user = await storage.updateUser(req.params.id, updates);
      if (!user) {
        return res.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado" });
      }
      res.json({ ...user, password: void 0 });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });
  app2.get("/api/plans", async (req, res) => {
    try {
      const plans2 = await storage.getPlans();
      res.json(plans2);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });
  app2.get("/api/classes", async (req, res) => {
    try {
      const { date } = req.query;
      const classes2 = date ? await storage.getClassesByDate(date) : await storage.getClasses();
      res.json(classes2);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });
  app2.post("/api/classes/:id/book", async (req, res) => {
    try {
      const { userId } = req.body;
      const classId = req.params.id;
      const cls = await storage.getClass(classId);
      if (!cls) {
        return res.status(404).json({ message: "Aula n\xE3o encontrada" });
      }
      if (cls.currentParticipants >= cls.maxParticipants) {
        return res.status(400).json({ message: "Aula lotada" });
      }
      const booking = await storage.createClassBooking(userId, classId);
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });
  app2.delete("/api/classes/:id/book", async (req, res) => {
    try {
      const { userId } = req.body;
      const classId = req.params.id;
      const success = await storage.cancelClassBooking(userId, classId);
      if (!success) {
        return res.status(404).json({ message: "Agendamento n\xE3o encontrado" });
      }
      res.json({ message: "Agendamento cancelado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });
  app2.get("/api/users/:userId/bookings", async (req, res) => {
    try {
      const bookings = await storage.getClassBookings(req.params.userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });
  app2.get("/api/users/:userId/workouts", async (req, res) => {
    try {
      const workouts2 = await storage.getWorkouts(req.params.userId);
      res.json(workouts2);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });
  app2.post("/api/workouts", async (req, res) => {
    try {
      const workoutData = insertWorkoutSchema.parse(req.body);
      const workout = await storage.createWorkout(workoutData);
      res.json(workout);
    } catch (error) {
      res.status(400).json({ message: "Dados inv\xE1lidos" });
    }
  });
  app2.get("/api/equipment", async (req, res) => {
    try {
      const { category } = req.query;
      const equipment2 = category ? await storage.getEquipmentByCategory(category) : await storage.getEquipment();
      res.json(equipment2);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });
  app2.put("/api/equipment/:id/reserve", async (req, res) => {
    try {
      const { userId } = req.body;
      const equipment2 = await storage.updateEquipmentStatus(req.params.id, "reserved", userId);
      if (!equipment2) {
        return res.status(404).json({ message: "Equipamento n\xE3o encontrado" });
      }
      res.json(equipment2);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });
  app2.get("/api/users/:userId/checkins", async (req, res) => {
    try {
      const checkins2 = await storage.getCheckins(req.params.userId);
      res.json(checkins2);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });
  app2.get("/api/users/:userId/checkins/active", async (req, res) => {
    try {
      const activeCheckin = await storage.getActiveCheckin(req.params.userId);
      res.json(activeCheckin);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });
  app2.post("/api/checkins", async (req, res) => {
    try {
      const checkinData = insertCheckinSchema.parse(req.body);
      const activeCheckin = await storage.getActiveCheckin(checkinData.userId);
      if (activeCheckin) {
        return res.status(400).json({ message: "Usu\xE1rio j\xE1 est\xE1 na academia" });
      }
      const checkin = await storage.createCheckin(checkinData);
      await storage.updateUser(checkinData.userId, {
        isCheckedIn: true,
        lastCheckin: checkin.checkinTime
      });
      res.json(checkin);
    } catch (error) {
      res.status(400).json({ message: "Dados inv\xE1lidos" });
    }
  });
  app2.put("/api/checkins/:id/checkout", async (req, res) => {
    try {
      const checkin = await storage.updateCheckin(req.params.id, /* @__PURE__ */ new Date());
      if (!checkin) {
        return res.status(404).json({ message: "Check-in n\xE3o encontrado" });
      }
      await storage.updateUser(checkin.userId, { isCheckedIn: false });
      res.json(checkin);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });
  app2.get("/api/admin/login-logs", async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(401).json({ message: "Acesso negado" });
      }
      const user = await storage.getUser(userId);
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Apenas administradores podem acessar os logs" });
      }
      const logs = await storage.getRecentLoginAttempts(100);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
