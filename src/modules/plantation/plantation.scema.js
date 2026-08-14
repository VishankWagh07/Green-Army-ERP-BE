import z from "zod";
import { STOCK_TYPES } from "../../constants/common";

export const plantationIdParamSchema = z.object({
  plantationId: z.uuidv4(),
});

export const plantationSchema = z.object({
  plantation: z.object({
    plantationDate: z.string().date("plantationDate must be a valid date in YYYY-MM-DD format"),

    locationName: z.string().trim().min(1, "locationName is required").max(150, "locationName must not exceed 150 characters"),

    latitude: z.number().min(-90).max(90),

    longitude: z.number().min(-180).max(180),

    googleMapLink: z.string().trim().min(1, "googleMapLink is required").max(255, "googleMapLink must not exceed 255 characters"),

    description: z.string().trim().max(500, "description must not exceed 500 characters").nullable().optional(),

    teamId: z.uuidv4("teamId must be a valid UUID"),

    donorId: z.uuidv4("donorId must be a valid UUID").nullable().optional(),

    donationId: z.uuidv4("donationId must be a valid UUID").nullable().optional(),

    createdBy: z.uuidv4("createdBy must be a valid UUID"),
  }),

  stockUsed: z.array(
    z.object({
      stockId: z.uuidv4(),

      variantType: z.enum(Object.values(STOCK_TYPES)),

      quantityUsed: z.number().positive().optional(),
    })
  ),
})

export const plantationUpdateSchema = z.object({
  locationName: z.string().trim().min(1, "locationName is required").max(150, "locationName must not exceed 150 characters"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  googleMapLink: z.string().trim().min(1, "googleMapLink is required").max(255, "googleMapLink must not exceed 255 characters"),
  description: z.string().trim().max(500, "description must not exceed 500 characters").nullable().optional(),
})
  .partial()
  .refine(
    (data) => {
      const hasLat = data.latitude !== undefined;
      const hasLong = data.longitude !== undefined;
      return hasLat === hasLong;
    },
    {
      message: "Both latitude & longitude must be present or both must be absent",
      path: ["latitude"],
    }
  );