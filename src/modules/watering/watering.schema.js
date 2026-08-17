import z from "zod";

// Watering Location

export const postLocationSchema = z.object({
  plantationId: z.uuidv4(),
  frequencyDays: z.number().int().min(1), // every how many days
});

export const putLocationSchema = z.object({
  frequencyDays: postLocationSchema.shape.frequencyDays,
});

export const locationIdSchema = z.object({
  locationId: z.uuidv4(),
});

export const locationFilterSchema = z.object({
  locationId: z.uuidv4().optional(),
  plantationId: z.uuidv4().optional(),
});

// Watering schedule

export const postScheduleSchema = z.object({
  wateringLocationId: z.uuidv4(),
  scheduledDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Invalid date format. Expected YYYY-MM-DD in schedule date",
    ),

  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  locationName: z.string().max(150).optional(),
  googleMapLink: z.string().max(255).optional(),

  assignedUserId: z.uuidv4().optional(),
  reminderTime: z.iso.time(),
  notes: z.string().max(300).optional(),
});

export const scheduleFilterSchema = z
  .object({
    from: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Invalid date format. Expected YYYY-MM-DD in from date",
      ),

    to: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Invalid date format. Expected YYYY-MM-DD in to date",
      )
      .optional(),

    isCompleted: z.boolean().optional(),
  })
  .refine(
    (data) => {
      const fromDate = new Date(data.from);
      const toDate = new Date(data.to ?? data.from);

      return fromDate <= toDate;
    },
    {
      message: "The 'to' date must be greater than or equal to the 'from' date",
      path: ["to"],
    },
  );
