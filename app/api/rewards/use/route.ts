import { prisma } from "@/db/prisma";
import { UseRewardSchema } from "@/lib/validators";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rewardId } = UseRewardSchema.parse(body);

    // Start a transaction
    return await prisma.$transaction(async (tx) => {
      // Find the reward
      const reward = await tx.reward.findUnique({
        where: { id: rewardId },
        include: { customer: true },
      });

      if (!reward) {
        return NextResponse.json(
          { error: "Reward not found" },
          { status: 404 }
        );
      }

      if (reward.isUsed) {
        return NextResponse.json(
          { error: "Reward has already been used" },
          { status: 400 }
        );
      }

      // Mark reward as used
      const updatedReward = await tx.reward.update({
        where: { id: rewardId },
        data: {
          isUsed: true,
          usedAt: new Date(),
        },
      });

      // Increment rewards used count
      await tx.customer.update({
        where: { id: reward.customerId },
        data: {
          rewardsUsed: { increment: 1 },
        },
      });

      return NextResponse.json(
        {
          reward: updatedReward,
        },
        { status: 200 }
      );
    });
  } catch (error) {
    console.error("Failed to use reward:", error);
    return NextResponse.json(
      { error: "Failed to use reward" },
      { status: 400 }
    );
  }
}
