import { prisma } from "@/db/prisma";

(async () => {
  console.log("hi");
  await prisma.customer.create({
    data: {
      name: "kiksh",
      phone: "8748928",
      qrCodeId: crypto.randomUUID(), // Add a valid qrCodeId here
    },
  });

  console.log("Customer created successfully");
})();
