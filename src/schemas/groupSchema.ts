import { z } from "zod";

export const groupCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(100),

  ageGroup: z
    .string()
    .trim()
    .max(50)
    .optional(),

  description: z
    .string()
    .trim()
    .optional(),
});

export const groupUpdateSchema =
  groupCreateSchema.partial();