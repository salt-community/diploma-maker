import { BootcampData } from "./types";

export const BOOTCAMP_DATA_FORM_ID = "BOOTCAMP_DATA_FORM";

export const DEFAULT_BOOTCAMP_DATA = {
  track: "",
  graduationDate: new Date(Date.now()).toISOString().split("T")[0],
  students: [{ name: "", email: "" }],
} as BootcampData;
