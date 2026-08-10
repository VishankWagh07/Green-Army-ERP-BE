import z from "zod";
import { ATTENDANCE_STATUS } from "../../constants/common.js";

export const userIdParamSchema = z.object({
    userId: z.uuidv4(),
});

export const typeParamSchema = z.object({
    type: z.enum(["IN", "OUT"]),
});

export const attendanceQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    // userId: z.coerce.number().int().positive().optional(),
    from: z.string().date().optional(),
    to: z.string().date().optional(),
})

export const updateAttendanceSchema = z.object({
    status: z.enum(Object.keys(ATTENDANCE_STATUS)).optional(),
    checkInTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Use HH:MM or HH:MM:SS').optional(),
    checkOutTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Use HH:MM or HH:MM:SS').optional(),
});

export const idParamSchema = z.object({
    attendanceId: z.uuidv4(),
});



export const dailyLogSchema = z.object({
    locationName: z.string().trim().max(150),
    googleMapLink: z.string().trim().max(225),
    description: z.string().max(500),
});

export const historyQuerySchema = z.object({
  date: z.string().date().optional(),
});
