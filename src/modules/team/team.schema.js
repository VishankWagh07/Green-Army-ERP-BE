import z from "zod";

export const teamNameSchema = z.object({
  teamName: z.string().min(2).max(150),
});

export const teamIdSchema = z.object({
    teamId: z.uuidv4(),
})