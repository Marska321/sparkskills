import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  avatar: text("avatar").default("👦"),
  level: integer("level").default(1),
  totalBadges: integer("total_badges").default(0),
  currentStreak: integer("current_streak").default(0),
  ideasCreated: integer("ideas_created").default(0),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  description: text("description").notNull(),
  emoji: text("emoji").notNull(),
  duration: text("duration").notNull(),
  sections: jsonb("sections").notNull().$type<Section[]>(),
  objectives: text("objectives").array(),
  tools: text("tools").array(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  completedSections: integer("completed_sections").array().default([]),
  isCompleted: boolean("is_completed").default(false),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
  data: jsonb("data").$type<Record<string, any>>().default({}),
});

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  emoji: text("emoji").notNull(),
  color: text("color").notNull(),
  requirement: text("requirement").notNull(),
});

export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  badgeId: integer("badge_id").notNull().references(() => badges.id),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  sectionId: integer("section_id").notNull(),
  type: text("type").notNull(), // 'reflection', 'creation', 'sharing', etc.
  data: jsonb("data").notNull().$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Types
export interface Section {
  id: number;
  title: string;
  timeMinutes: number;
  tools: string[];
  content: string;
  activities?: Activity[];
  tips?: string[];
}

export interface Activity {
  type: 'input' | 'textarea' | 'drawing' | 'selection' | 'creation';
  prompt: string;
  placeholder?: string;
  options?: string[];
}

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  totalBadges: true,
  currentStreak: true,
  ideasCreated: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  lastAccessedAt: true,
});

export const insertBadgeSchema = createInsertSchema(badges).omit({
  id: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type Badge = typeof badges.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type UserBadge = typeof userBadges.$inferSelect;
export type ActivityRecord = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
