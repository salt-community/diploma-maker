import { z } from "zod";

export const BootcampDataSchema = z.object({
  track: z.string().min(1, "Track is required"),
  graduationDate: z.string().date(),
  students: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email(),
    }),
  ),
});
