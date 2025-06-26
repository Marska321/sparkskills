import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserProgressSchema, insertActivitySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user (default user for now)
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser(1);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all lessons
  app.get("/api/lessons", async (req, res) => {
    try {
      const lessons = await storage.getAllLessons();
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get specific lesson
  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const lesson = await storage.getLesson(id);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user progress
  app.get("/api/progress", async (req, res) => {
    try {
      const userId = 1; // Default user
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get lesson progress
  app.get("/api/progress/:lessonId", async (req, res) => {
    try {
      const userId = 1; // Default user
      const lessonId = parseInt(req.params.lessonId);
      const progress = await storage.getLessonProgress(userId, lessonId);
      res.json(progress || null);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update lesson progress
  app.post("/api/progress/:lessonId", async (req, res) => {
    try {
      const userId = 1; // Default user
      const lessonId = parseInt(req.params.lessonId);
      const updates = insertUserProgressSchema.partial().parse(req.body);
      
      const progress = await storage.updateProgress(userId, lessonId, updates);
      
      // Check if lesson is completed and award badge
      if (updates.isCompleted) {
        try {
          await storage.awardBadge(userId, lessonId);
        } catch (error) {
          // Badge might already be awarded, ignore error
        }
      }
      
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Complete section
  app.post("/api/progress/:lessonId/section/:sectionId", async (req, res) => {
    try {
      const userId = 1; // Default user
      const lessonId = parseInt(req.params.lessonId);
      const sectionId = parseInt(req.params.sectionId);
      
      const currentProgress = await storage.getLessonProgress(userId, lessonId);
      const completedSections = currentProgress?.completedSections || [];
      
      if (!completedSections.includes(sectionId)) {
        completedSections.push(sectionId);
      }
      
      // Check if all sections are completed
      const lesson = await storage.getLesson(lessonId);
      const isCompleted = lesson ? completedSections.length >= lesson.sections.length : false;
      
      const progress = await storage.updateProgress(userId, lessonId, {
        completedSections,
        isCompleted,
      });
      
      // Award badge if lesson is completed
      if (isCompleted) {
        try {
          await storage.awardBadge(userId, lessonId);
        } catch (error) {
          // Badge might already be awarded, ignore error
        }
      }
      
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user badges
  app.get("/api/badges", async (req, res) => {
    try {
      const userId = 1; // Default user
      const userBadges = await storage.getUserBadges(userId);
      res.json(userBadges);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all available badges
  app.get("/api/badges/all", async (req, res) => {
    try {
      const badges = await storage.getAllBadges();
      res.json(badges);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Save activity
  app.post("/api/activities", async (req, res) => {
    try {
      const activity = insertActivitySchema.parse(req.body);
      const savedActivity = await storage.saveActivity(activity);
      res.json(savedActivity);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user activities
  app.get("/api/activities", async (req, res) => {
    try {
      const userId = 1; // Default user
      const lessonId = req.query.lessonId ? parseInt(req.query.lessonId as string) : undefined;
      const activities = await storage.getUserActivities(userId, lessonId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
