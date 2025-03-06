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
import { toast } from "sonner";
import { Toaster } from "sonner";

import { useTransition } from "react"; // for loader fix

// import { Input } from "@/components/ui/input"
// import { lookupCustomer } from "@/lib/actions"
// import type { CustomerData } from "@/lib/types"
// import { CustomerDetails } from "@/components/customer-details"

const FindByPhone = () => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof FindCustomerSchema>>({
    resolver: zodResolver(FindCustomerSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FindCustomerSchema>) => {
    try {
      // Clear any previous errors
      setError(null);

      // Call the server action
      const res = await getCustomerByPhoneNumber(values.phoneNumber);

      if (!res.success) {
        toast.error(`${res.message}`, {
          duration: 3000,
          style: { backgroundColor: "red", color: "white" },
        });
        return;
      }

      // Use startTransition for the navigation to show loading state
      startTransition(() => {
        router.push(`/customer/${res.data?.id}`);
      });
    } catch (e) {
      setError("An unexpected error occurred. Please try again.");
      toast.error("Failed to look up customer", {
        duration: 3000,
        style: { backgroundColor: "red", color: "white" },
      });
    }
  };

  return (
    <div className="mx-auto min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-amber-100">
      {/* Add a full-page loading overlay */}
      {isPending && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500 mb-2" />
            <p>Loading customer data...</p>
          </div>
        </div>
      )}

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
      <Toaster />
    </div>
  );
};

export default FindByPhone;
