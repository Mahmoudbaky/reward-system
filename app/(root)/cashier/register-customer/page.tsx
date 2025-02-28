"use client";

// import { FormEvent, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateCustomerSchema } from "@/lib/validators";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createCustomer } from "@/lib/actions/customer.actions";

export default function RegisterPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof CreateCustomerSchema>>({
    resolver: zodResolver(CreateCustomerSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CreateCustomerSchema>) => {
    const response = await createCustomer(values);

    console.log(values);

    // const customer = await getCustomerByPhoneNumber(values.phoneNumber);
    // router.push(`/customer/${customer.id}`);
    // // console.log( customer);
  };

  return (
    <div className="mx-auto min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create customer</CardTitle>
          <CardDescription>Enter customer info</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Customer"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        {/* <CardFooter className="flex flex-col">
          {error && (
            <div className="text-destructive text-sm w-full text-center p-2">
              {error}
            </div>
          )}
        </CardFooter> */}
      </Card>
    </div>
  );
}
