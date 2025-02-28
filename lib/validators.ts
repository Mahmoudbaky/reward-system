import { z } from "zod";

// QR code data schema
export const QRCodeDataSchema = z.object({
  customerId: z.string(),
  timestamp: z.number().optional(),
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

export const FindCustomerSchema = z.object({
  phoneNumber: z.string().min(1, "Phone number is required"),
});

export const CreateCustomerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
});
