"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Customer {
  id: string;
  qrCodeId: string;
  name: string;
  email: string;
  purchaseCount: number;
  rewardsEarned: number;
  rewardsUsed: number;
}

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [qrCode, setQrCode] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name || undefined, // Don't send empty strings
          email: email || undefined,
          phone: phone || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to register customer");
      }

      const data = await response.json();
      setCustomer(data.customer);
      setQrCode(data.qrCodeImage);

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Register New Customer</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!customer ? (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name (Optional)
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email (Optional)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              {loading ? "Registering..." : "Register Customer"}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="mb-4 text-center">
            <div className="text-lg font-semibold text-green-600 mb-2">
              Customer Successfully Registered!
            </div>
            {customer.name && (
              <p className="text-xl font-bold">{customer.name}</p>
            )}
            {customer.email && (
              <p className="text-gray-600">{customer.email}</p>
            )}
          </div>

          <div className="flex flex-col items-center mb-6">
            <h3 className="text-lg font-medium mb-4">Customer QR Code</h3>
            {qrCode && (
              <div className="p-4 bg-white rounded-lg shadow mb-4">
                <Image
                  src={qrCode}
                  alt="Customer QR Code"
                  width={200}
                  height={200}
                />
              </div>
            )}
            <p className="text-gray-600 text-center">
              Scan this QR code at checkout to record purchases
            </p>
          </div>

          <div className="flex justify-between">
            <Link
              href={`/customer/${customer.id}`}
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              View Customer Portal
            </Link>

            <button
              onClick={() => {
                setCustomer(null);
                setQrCode("");
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Register Another Customer
            </button>
          </div>
        </div>
      )}

      <div className="mt-6">
        <Link href="/" className="text-blue-500 hover:text-blue-700">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
