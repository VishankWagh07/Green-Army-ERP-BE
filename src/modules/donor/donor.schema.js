import z from "zod";

export const postDonorSchema = z.object({
  fullName: z.string().min(2).max(150),
  mobileNumber: z.string().regex(/^\d{10}$/, 'Must be a 10-digit mobile number').optional(),
  address: z.string().max(500).optional(),
  panNumber: z.string().regex(/^[A-Z]{5}\d{4}[A-Z]$/, 'Invalid PAN format').optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Expected YYYY-MM-DD").nullish(),          // 'YYYY-MM-DD'
  anniversaryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Expected YYYY-MM-DD").nullish(),
  assignedUserId: z.uuidv4().optional(),
});

export const putDonorSchema = postDonorSchema.partial();

export const donorIdSchema = z.object({
    donorId: z.uuidv4(),
})