import { z } from "zod";
import { BootcampDataSchema } from "./schemas";

export type Subpage = "bootcamp-data" | "review-diplomas";
export type BootcampData = z.infer<typeof BootcampDataSchema>;
