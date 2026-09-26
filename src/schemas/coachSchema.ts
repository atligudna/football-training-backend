import { z } from "zod";

export const coachCreateSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(1)
      .max(150),

    email: z
      .string()
      .trim()
      .email()
      .max(255)
      .optional(),

    phone: z
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

export const coachUpdateSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(1)
      .max(150)
      .optional(),

    email: z
      .string()
      .trim()
      .email()
      .max(255)
      .nullable()
      .optional(),

    phone: z
      .string()
      .trim()
      .max(50)
      .nullable()
      .optional(),

    notes: z
      .string()
      .trim()
      .nullable()
      .optional(),

    active: z
      .boolean()
      .optional(),
  });