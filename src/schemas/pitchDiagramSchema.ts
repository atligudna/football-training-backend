import { z } from "zod";

const pitchObjectSchema = z
  .object({
    id: z.string().min(1),

    type: z.enum([
      "cone",
      "pole",
      "ball",
      "goal",
      "player",
      "arrow",
      "area",
      "label",
    ]),

    x: z
      .number()
      .min(0)
      .max(100),

    y: z
      .number()
      .min(0)
      .max(100),

    rotation: z
      .number()
      .optional(),

    size: z
      .enum([
        "small",
        "medium",
        "large",
      ])
      .optional(),

    color: z
      .enum([
        "blue",
        "red",
        "yellow",
        "white",
        "black",
      ])
      .optional(),

    goalType: z
      .enum([
        "full",
        "seven",
        "mini",
      ])
      .optional(),

    lineStyle: z
      .enum([
        "solid",
        "dashed",
      ])
      .optional(),

    text: z
      .string()
      .max(40)
      .optional(),

    width: z
      .number()
      .positive()
      .optional(),

    height: z
      .number()
      .positive()
      .optional(),
  })
  .strict();

export const pitchDiagramCreateSchema =
  z.object({
    title: z
      .string()
      .trim()
      .min(1)
      .max(150),

    orientation: z.enum([
      "landscape",
      "portrait",
    ]),

    objects: z
      .array(pitchObjectSchema)
      .default([]),
  });

  export const pitchDiagramUpdateSchema =
  z.object({
    title: z
      .string()
      .trim()
      .min(1)
      .max(150)
      .optional(),

    orientation: z
      .enum([
        "landscape",
        "portrait",
      ])
      .optional(),

    objects: z
      .array(pitchObjectSchema)
      .optional(),
  });