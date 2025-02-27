import { QRCodeDataSchema } from "@/lib/validators";
import { z } from "zod";

export type QRCodeData = z.infer<typeof QRCodeDataSchema>;
