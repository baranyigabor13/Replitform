import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User account for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Form schema for ad generation
export const formData = pgTable("form_data", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  businessType: text("business_type").notNull(),
  businessName: text("business_name").notNull(),
  valueProposition: text("value_proposition").notNull(),
  answers: jsonb("answers").notNull(),
  createdAt: text("created_at").notNull(),
});

// Generated ad content
export const generatedAds = pgTable("generated_ads", {
  id: serial("id").primaryKey(),
  formDataId: integer("form_data_id").references(() => formData.id),
  headline: text("headline").notNull(),
  content: text("content").notNull(),
  tone: text("tone").notNull(), // professional, casual, urgent
  length: text("length").notNull(), // short, medium, long
  tags: text("tags").array().notNull(),
  emojiCount: integer("emoji_count").notNull(),
  createdAt: text("created_at").notNull(),
});

// Form validation schemas
export const initialFormSchema = z.object({
  businessType: z.enum(["product", "service", "event"]),
  businessName: z.string().min(2, "Business name is required"),
  valueProposition: z.string().min(10, "Value proposition must be at least 10 characters"),
});

export const dynamicFormSchema = z.record(z.any());

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type FormData = typeof formData.$inferSelect;
export type GeneratedAd = typeof generatedAds.$inferSelect;
export type InitialFormData = z.infer<typeof initialFormSchema>;

// Types for API responses
export type GenerateQuestionsResponse = {
  questions: Question[];
};

export type GenerateAdsResponse = {
  ads: AdContent[];
};

export type AdContent = {
  headline: string;
  content: string;
  tone: "professional" | "casual" | "urgent";
  length: "short" | "medium" | "long";
  tags: string[];
  emojiCount: number;
};

export type Question = {
  id: string;
  text: string;
  type: "radio" | "checkbox" | "slider" | "text";
  options?: {
    value: string;
    label: string;
    icon?: string;
    description?: string;
  }[];
  min?: number;
  max?: number;
  defaultValue?: any;
  required?: boolean;
  color?: "blue" | "purple" | "green";
  multiline?: boolean;
  placeholder?: string;
};

export type FormStep = {
  title: string;
  description?: string;
  questions: Question[];
};
