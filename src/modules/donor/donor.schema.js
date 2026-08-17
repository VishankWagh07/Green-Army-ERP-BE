import z from "zod";
import { PAYMENT_STATUS, PLANTATION_STATUS } from "../../constants/common.js";

export const postDonorSchema = z.object({
  fullName: z.string().min(2).max(150),
  mobileNumber: z
    .string()
    .regex(/^\d{10}$/, "Must be a 10-digit mobile number")
    .optional(),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  address: z.string().max(500).optional(),
  panNumber: z
    .string()
    .regex(/^[A-Z]{5}\d{4}[A-Z]$/, "Invalid PAN format")
    .optional(),
  dateOfBirth: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Invalid date format. Expected YYYY-MM-DD in DOB",
    )
    .nullish(), // 'YYYY-MM-DD'
  anniversaryDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Invalid date format. Expected YYYY-MM-DD in anniversary date",
    )
    .nullish(),
  assignedUserId: z.uuidv4().optional(),
  treeGuardsProvided: z.number().int().min(0).optional(),
  saplingsProvided: z.number().int().min(0).optional(),
});

export const putDonorSchema = postDonorSchema.partial();

export const donorIdSchema = z.object({
  donorId: z.uuidv4(),
});

export const donorIdOptionalSchema = donorIdSchema.partial();

export const donorFilterSchema = z.object({
  donorId: z.uuidv4().optional(),
  donationGte: z.string().optional(),
});

// DONATIONS

export const postDonationSchema = z.object({
  amount: z.number().min(0),
  donationDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Invalid date format. Expected YYYY-MM-DD in donation date",
    ),
  stickersPrepared: z.number().int().min(0).optional(),
  paymentMode: z.string().max(50).optional(),
  paymentStatus: z
    .enum(Object.values(PAYMENT_STATUS), {
      error: "Invalid Payment Status",
    })
    .optional(),
});

export const donationFilterSchema = z
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
  })
  .transform((data) => ({
    from: data.from,
    to: data.to ?? data.from,
  }))
  .refine(
    (data) => {
      const fromDate = new Date(data.from);
      const toDate = new Date(data.to);
      return fromDate <= toDate;
    },
    {
      message: "The 'to' date must be greater than or equal to the 'from' date",
      path: ["to"],
    },
  );

export const putDonationSchema = postDonationSchema.partial();

export const donorDonationIdSchema = z.object({
  donorId: z.uuidv4(),
  donationId: z.uuidv4(),
});
