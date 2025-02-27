import { QRCodeData } from "@/types";
import { QRCodeDataSchema } from "../validators";
import QRCode from "qrcode";

/**
 * Generate a QR code for a customer
 * @param customerId Customer's unique ID
 * @returns Base64 encoded QR code image
 */
export async function generateQRCode(customerId: string): Promise<string> {
  const qrData: QRCodeData = {
    customerId,
    timestamp: Date.now(),
  };

  // Convert QR data to JSON string
  const qrString = JSON.stringify(qrData);

  // Generate QR code as base64 string
  try {
    const qrBase64 = await QRCode.toDataURL(qrString, {
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
    const parsed = JSON.parse(qrData);
    return QRCodeDataSchema.parse(parsed);
  } catch (error) {
    console.error("Failed to parse QR code data:", error);
    throw new Error("Invalid QR code format");
  }
}
