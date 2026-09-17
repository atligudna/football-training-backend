import { z } from "zod";

const drillTypeSchema = z.enum([
  "drill",
  "station",
  "game",
  "break",
  "reflection",
]);

const coachingPointSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
});

const equipmentItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const drillCreateSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  type: drillTypeSchema,
  description: z.string().optional().default(""),
  durationMinutes: z.number().int().nonnegative().optional().default(0),
  ageGroup: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  coachingPoints: z.array(coachingPointSchema).optional().default([]),
  equipment: z.array(equipmentItemSchema).optional().default([]),
});

export const drillUpdateSchema = drillCreateSchema.partial();