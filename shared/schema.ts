import { pgTable, text, serial, integer, boolean, timestamp, numeric, date } from "drizzle-orm/pg-core";
export * from "./models/chat";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const farmers = pgTable("farmers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  languagePreference: text("language_preference").default('en'),
  locationLat: text("location_lat"),
  locationLng: text("location_lng"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const farms = pgTable("farms", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
  sizeAcres: numeric("size_acres").notNull(),
  soilType: text("soil_type").notNull(),
  primaryCrop: text("primary_crop").notNull(),
});

export const marketPrices = pgTable("market_prices", {
  id: serial("id").primaryKey(),
  state: text("state").notNull(),
  market: text("market").notNull(),
  crop: text("crop").notNull(),
  variety: text("variety").default("General"),
  minPrice: integer("min_price").notNull().default(0),
  maxPrice: integer("max_price").notNull().default(0),
  pricePerQuintal: integer("price_per_quintal").notNull(),
  date: timestamp("date").defaultNow(),
  source: text("source").default("manual"),
});

export const priceHistory = pgTable("price_history", {
  id: serial("id").primaryKey(),
  crop: text("crop").notNull(),
  state: text("state").notNull(),
  market: text("market").notNull(),
  variety: text("variety").default("General"),
  minPrice: integer("min_price").notNull(),
  maxPrice: integer("max_price").notNull(),
  modalPrice: integer("modal_price").notNull(),
  recordDate: date("record_date").notNull(),
});

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull().unique(),
  role: text("role").default("admin"),
});

export const insertFarmerSchema = createInsertSchema(farmers).omit({ id: true, createdAt: true });
export const insertFarmSchema = createInsertSchema(farms).omit({ id: true });
export const insertMarketPriceSchema = createInsertSchema(marketPrices).omit({ id: true, date: true });
export const insertPriceHistorySchema = createInsertSchema(priceHistory).omit({ id: true });

export type Farmer = typeof farmers.$inferSelect;
export type InsertFarmer = z.infer<typeof insertFarmerSchema>;

export type Farm = typeof farms.$inferSelect;
export type InsertFarm = z.infer<typeof insertFarmSchema>;

export type MarketPrice = typeof marketPrices.$inferSelect;
export type InsertMarketPrice = z.infer<typeof insertMarketPriceSchema>;

export type PriceHistory = typeof priceHistory.$inferSelect;
export type InsertPriceHistory = z.infer<typeof insertPriceHistorySchema>;

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'Seeds', 'Fertilizers', 'Pesticides', 'Tools'
  price: integer("price").notNull(), // stored as INR
  imageUrl: text("image_url").notNull(),
  description: text("description").notNull(),
  compatibility: text("compatibility"),
  usage: text("usage").default("General usage instructions apply."),
  benefits: text("benefits").default("Supports healthy crop growth."),
  buyUrl: text("buy_url").default("https://amazon.in"),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
