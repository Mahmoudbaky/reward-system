import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

// export async function POST(request: NextRequest) {
//   try {

//       return NextResponse.json(
//         {
//           purchase,
//           currentPurchaseCount: updatedCustomer.purchaseCount,
//           newReward,
//         },
//         { status: 201 }
//       );
//     });
//   } catch (error) {
//     console.error("Failed to record purchase:", error);
//     return NextResponse.json(
//       { error: "Failed to record purchase" },
//       { status: 400 }
//     );
//   }
// }
