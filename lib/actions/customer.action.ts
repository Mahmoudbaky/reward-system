import { prisma } from "@/db/prisma";

(async () => {
  await prisma.customer.create({
    data: {
      name: "mahmoud",
      email: "houdbaky@gmail.com",
      phone: "1234567890",
      qrCodeId: "some-qr-code-id", // Add a valid qrCodeId here
    },
  });

  console.log("Customer created successfully");
})();
