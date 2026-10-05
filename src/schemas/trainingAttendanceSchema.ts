import { z } from "zod";

export const attendanceStatusSchema =
  z.enum([
    "unknown",
    "attending",
    "absent",
    "injured",
  ]);

export const attendanceUpdateSchema =
  z.object({
    status:
      attendanceStatusSchema,

    notes:
      z
        .string()
        .trim()
        .nullable()
        .optional(),
  });

export const attendanceBulkUpdateSchema =
  z.object({
    attendance: z
      .array(
        z.object({
          playerId:
            z.coerce
              .number()
              .int()
              .positive(),

          status:
            attendanceStatusSchema,

          notes:
            z
              .string()
              .trim()
              .nullable()
              .optional(),
        })
      )
      .min(1),
  });