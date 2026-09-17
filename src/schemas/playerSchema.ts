import { z } from "zod";

export const playerCreateSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),

  birthYear: z
    .number()
    .int()
    .min(1900)
    .max(2100)
    .optional(),

  position: z
    .string()
    .trim()
    .max(50)
    .optional(),

  notes: z
    .string()
    .trim()
    .optional(),

  active: z
    .boolean()
    .optional(),
});

export const playerUpdateSchema =
  playerCreateSchema.partial();