import z from "zod";
import { USER_ROLES } from "../../constants/auth.js";

export const idParamSchema = z.object({
  userId: z.uuidv4(),
});

export const userUpdateSchema = z.object({
  role: z.enum(Object.keys(USER_ROLES), {
    error: "Invalid user role",
  }),

  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(150, "Full name cannot exceed 150 characters"),

  address: z.string().trim().max(300, "Address cannot exceed 300 characters").optional().or(z.literal("")),

  mobileNumber: z.string().trim().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),

  password: z.string().min(8, "Password must be at least 8 characters").max(100).regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/\d/, "Password must contain at least one number").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

  teamId: z.number().int().positive().nullable().optional(),

  joiningDate: z.string().date("Invalid joining date").optional().or(z.literal("")),
}).partial();