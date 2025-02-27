import { QRCodeData } from "@/types";
import { QRCodeDataSchema } from "../validators";
import QRCode from "qrcode";

/**
 * Generate a QR code for a customer
 * @param qrCodeId Customer's unique QR code ID
 * @returns Base64 encoded QR code image
 */
export async function generateQRCode(qrCodeId: string): Promise<string> {
  // We'll just use the QR code ID directly in the QR code
  // This simplifies scanning and reduces chances of errors

  // Generate QR code as base64 string
  try {
    const qrBase64 = await QRCode.toDataURL(qrCodeId, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 300,
    });
    return qrBase64;
  } catch (error) {
    console.error("Failed to generate QR code:", error);
    throw new Error("Failed to generate QR code");
  }
}

/**
 * Parse QR code data
 * @param qrData String data from scanned QR code
 * @returns Parsed QR code data object
 */
export function parseQRCode(qrData: string): QRCodeData {
  try {
    // First try to parse as JSON
    const parsed = JSON.parse(qrData);
    return QRCodeDataSchema.parse(parsed);
  } catch (error) {
    // If parsing as JSON fails, assume the raw string is the QR code ID
    return { customerId: qrData };
  }
}
