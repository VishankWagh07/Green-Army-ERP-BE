import z from "zod";
import { STOCK_TYPES } from "../../constants/common.js";

// Stock variant

export const variantIdParamSchema = z.object({
    variantId: z.uuidv4(),
});

export const stockVariantSchema = z.object({
    type: z.enum(Object.keys(STOCK_TYPES), {
        error: "Invalid variant type",
    }),

    variantName: z.string().trim().min(2, "Variant name must be at least 2 characters").max(150, "Variant name cannot exceed 150 characters"),

    unitPrice: z.number().positive().optional(),
});

export const stockVariantUpdateSchema = stockVariantSchema.partial();


// Stock

export const idParamSchema = z.object({
    stockId: z.uuidv4(),
});

export const stockSchema = z.object({
    donationId: z.uuidv4(),

    amount: z.number().positive(),
    
    variantId: z.uuidv4(),
    
    quantityBought: z.number().positive(),
});

export const stockUpdateSchema = z.object({
    variantId: z.uuidv4(),
    
    amount: z.number().positive(),

    quantity: z.number().positive(),
}).partial();





// export const stockLogsQuerySchema = z.object({
//     page: z.coerce.number().int().positive().default(1),
//     limit: z.coerce.number().int().positive().max(100).default(20),
//     stockType: z.enum(['IN', 'OUT'], {
//         error: "Invalid log type type",
//     }),
//     from: z.string().date().optional(),
//     to: z.string().date().optional(),
// });

// export const stockLogSchema = z.object({
//     stockId: z.string().uuid("stockId must be a valid UUID"),

//     type: z.enum(["IN", "OUT"], { message: "type must be either IN or OUT", }),

//     quantity: z.number().int("quantity must be an integer").positive("quantity must be greater than 0"),

//     amountSpent: z.number().nonnegative("amountSpent cannot be negative"),

//     referenceType: z.enum(Object.values(STOCK_LOG_REFS), { message: "Invalid referenceType", }),

//     referenceId: z.string().uuid("referenceId must be a valid UUID"),

//     logDate: z.string().date("logDate must be a valid date in YYYY-MM-DD format"),
// });