import z from "zod";


export const drillEquipmentCreateSchema = z.object({
    equipment_id: z.number(),
    quantity: z.number().min(1)
});

export const drillEquipmentUpdateSchema = z.object({
    quantity: z.number().min(1)
});