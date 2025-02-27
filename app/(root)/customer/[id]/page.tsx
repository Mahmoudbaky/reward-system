import { prisma } from "@/db/prisma";
import { generateQRCode } from "@/lib/actions/qr-code.actions";
import Image from "next/image";
import { notFound } from "next/navigation";

export const generateMetadata = async ({ params }) => {
  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
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

const CustomerInterface = () => {
  return <div>CustomerInterface</div>;
};

export default CustomerInterface;
