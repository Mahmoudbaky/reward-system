import { z } from "zod";

// QR code data schema
export const QRCodeDataSchema = z.object({
  customerId: z.string(),
  timestamp: z.number(),
});

// Create customer data schema
export const CustomerCreateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export const PurchaseCreateSchema = z.object({
  qrCodeId: z.string(),
  amount: z.number().positive(),
});

export const UseRewardSchema = z.object({
  rewardId: z.string(),
});
