import z from "zod";
import { RADIUS_ENTITIES, REPORT_WISE } from "../../constants/common.js";

export const overallActivityQuerySchema = z.object({
    from: z.iso.date(),
    to: z.iso.date(),
});

export const teamActivityQuerySchema = z.object({
    teamId: z.uuid(),
    from: z.iso.date(),
    to: z.iso.date(),
});

export const plantationQuerySchema = z.object({
    reportWise: z.enum(Object.values(REPORT_WISE)),
    from: z.iso.date(),
    to: z.iso.date(),
    area: z.string().optional()
});

export const radiusReportQuerySchema = z.object({
    latitude: z.coerce.number().min(-90, "Invalid latitude range").max(90, "Invalid latitude range"),

    longitude: z.coerce.number().min(-180, "Invalid longitude range").max(180, "Invalid longitude range"),

    distance: z.coerce.number(),

    entity: z.enum(RADIUS_ENTITIES),

    from: z.iso.date(),

    to: z.iso.date(),
});