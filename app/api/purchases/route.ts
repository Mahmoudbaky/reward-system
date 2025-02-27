import { prisma } from "@/db/prisma";
import { PurchaseCreateSchema } from "@/lib/validators";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { qrCodeId, amount } = PurchaseCreateSchema.parse(body);

    // Start a transaction
    return await prisma.$transaction(async (tx) => {
      // Find customer by QR code ID
      const customer = await tx.customer.findUnique({
        where: { qrCodeId },
      });

      if (!customer) {
        return NextResponse.json(
          { error: "Customer not found" },
          { status: 404 }
        );
      }

      // Create purchase record
      const purchase = await tx.purchase.create({
        data: {
          customerId: customer.id,
          amount,
        },
      });

      // Increment purchase count
      const updatedCustomer = await tx.customer.update({
        where: { id: customer.id },
        data: {
          purchaseCount: { increment: 1 },
        },
      });

      // Check if customer qualifies for a reward

      let newReward = null;
      if (updatedCustomer.purchaseCount % 5 === 0) {
        // Create a reward
        newReward = await tx.reward.create({
          data: {
            customerId: customer.id,
          },
        });

        // Update rewards earned count
        await tx.customer.update({
          where: { id: customer.id },
          data: {
            rewardsEarned: { increment: 1 },
          },
        });
      }

      return NextResponse.json(
        {
          purchase,
          currentPurchaseCount: updatedCustomer.purchaseCount,
          newReward,
        },
        { status: 201 }
      );
    });
  } catch (error) {
    console.error("Failed to record purchase:", error);
    return NextResponse.json(
      { error: "Failed to record purchase" },
      { status: 400 }
    );
  }
}
