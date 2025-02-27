import { prisma } from "@/db/prisma";
import { generateQRCode } from "@/lib/actions/qr-code.actions";
import { CustomerCreateSchema } from "@/lib/validators";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CustomerCreateSchema.parse(body);

    // Generate a unique QR code ID
    const qrCodeId = crypto.randomUUID();

    // Create customer in database
    const customer = await prisma.customer.create({
      data: {
        ...validatedData,
        qrCodeId,
      },
    });

    // Generate QR code image
    const qrCodeImage = await generateQRCode(customer.qrCodeId);

    return NextResponse.json(
      {
        customer,
        qrCodeImage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 400 }
    );
  }
}

// The 'crypto' module in JavaScript provides cryptographic functionality that includes a set of wrappers for OpenSSL's hash, HMAC, cipher, decipher, sign, and verify functions.
// It is used for secure encryption and decryption, generating cryptographic keys, creating hashes, and more.
// Common use cases include generating random values, creating secure passwords, and ensuring data integrity.
// Example usage:
// const crypto = require('crypto');
// const hash = crypto.createHash('sha256').update('some data').digest('hex');
// console.log(hash); // Outputs the SHA-256 hash of 'some data'
