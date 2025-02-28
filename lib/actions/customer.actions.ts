"use server";

import { prisma } from "@/db/prisma";
import { CreateCustomerSchema } from "../validators";
import { z } from "zod";
import { formatError } from "../utils";

export const getCustomerByPhoneNumber = async (phoneNumber: string) => {
  const customer = await prisma.customer.findUnique({
    where: {
      phone: phoneNumber,
    },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  return customer;
};

export const createCustomer = async (
  values: z.infer<typeof CreateCustomerSchema>
) => {
  try {
    const customerExists = await prisma.customer.findFirst({
      where: { phone: values.phone },
    });

    if (customerExists) {
      throw new Error("Customer already exists");
    }

    const customer = CreateCustomerSchema.parse(values);

    await prisma.customer.create({
      data: {
        ...customer,
        qrCodeId: crypto.randomUUID(),
      },
    });

    return { success: true, message: "Customer created successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};
