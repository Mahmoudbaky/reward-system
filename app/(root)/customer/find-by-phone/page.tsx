"use client";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FindCustomerSchema } from "@/lib/validators";
import { getCustomerByPhoneNumber } from "@/lib/actions/customer.actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import { Input } from "@/components/ui/input"
// import { lookupCustomer } from "@/lib/actions"
// import type { CustomerData } from "@/lib/types"
// import { CustomerDetails } from "@/components/customer-details"

const FindByPhone = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof FindCustomerSchema>>({
    resolver: zodResolver(FindCustomerSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FindCustomerSchema>) => {
    const customer = await getCustomerByPhoneNumber(values.phoneNumber);
    router.push(`/customer/${customer.id}`);
    // console.log( customer);
  };

  return (
    <div className="mx-auto min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Customer Lookup</CardTitle>
          <CardDescription>
            Enter your phone number to retrieve your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="phoneNumber"
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
                    Looking up...
                  </>
                ) : (
                  "Lookup Customer"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col">
          {error && (
            <div className="text-destructive text-sm w-full text-center p-2">
              {error}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default FindByPhone;
