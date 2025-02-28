import { prisma } from "@/db/prisma";
import { generateQRCode } from "@/lib/actions/qr-code.actions";
import Image from "next/image";
import { notFound } from "next/navigation";

export const generateMetadata = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await props.params;
  const customer = await prisma.customer.findUnique({
    where: { id },
  });

  if (!customer) {
    return {
      title: "Customer Not Found",
    };
  }

  return {
    title: `${customer.name || "Customer"} Rewards`,
  };
};

const CustomerPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await props.params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      purchases: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      rewards: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!customer) {
    notFound();
  }

  // Generate QR code
  const qrCodeImage = await generateQRCode(customer.qrCodeId);

  // Calculate available rewards
  const availableRewards = customer.rewards.filter((r) => !r.isUsed).length;

  // Calculate purchases until next reward
  const purchasesUntilReward = 5 - (customer.purchaseCount % 5);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className=" text-2xl font-bold mb-6">
        {customer.name ? `${customer.name}'s` : "Your"} Rewards Card
      </h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-black text-xl font-semibold">
                {customer.name || "Valued Customer"}
              </h2>
              {customer.email && (
                <p className="text-gray-600">{customer.email}</p>
              )}
            </div>

            <div className="text-center bg-blue-50 p-3 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {availableRewards}
              </div>
              <div className="text-sm text-blue-600">Available Rewards</div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-gray-700">
              Total Purchases:{" "}
              <span className="font-semibold">{customer.purchaseCount}</span>
            </p>

            <div className="mt-4">
              <p className="text-gray-700 mb-2">
                {purchasesUntilReward === 0
                  ? "You've earned a reward!"
                  : `${purchasesUntilReward} more purchase${
                      purchasesUntilReward !== 1 ? "s" : ""
                    } until your next reward`}
              </p>

              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${((5 - purchasesUntilReward) / 5) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <h3 className="text-black text-lg font-medium mb-4">Your QR Code</h3>

          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-lg shadow">
              <Image
                src={qrCodeImage}
                alt="Reward QR Code"
                width={200}
                height={200}
              />
            </div>
          </div>

          <p className="text-center mt-4 text-gray-600">
            Present this QR code when making purchases
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Purchases</h2>

        {customer.purchases.length > 0 ? (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customer.purchases.map((purchase) => (
                  <tr key={purchase.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(purchase.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-3">
                        <Image
                          src="/images/riyal.PNG"
                          alt="riyal"
                          width={15}
                          height={15}
                        />
                        <p>{purchase.amount.toFixed(2)}</p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No purchase history yet.</p>
        )}
      </div>
    </div>
  );
};

export default CustomerPage;
