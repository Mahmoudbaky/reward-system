import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ qrCodeId: string }> }
) {
  try {
    const { qrCodeId } = await props.params;

    if (!qrCodeId) {
      return NextResponse.json(
        { error: "QR code ID is required" },
        { status: 400 }
      );
    }

    // Find customer by QR code ID
    const customer = await prisma.customer.findUnique({
      where: { qrCodeId },
      include: {
        rewards: {
          where: { isUsed: false },
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Failed to fetch customer by QR code:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer data" },
      { status: 500 }
    );
  }
}
