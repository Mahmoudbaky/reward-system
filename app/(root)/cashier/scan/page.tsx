"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { parseQRCode } from "@/lib/actions/qr-code.actions";
import { CustomerCreateSchema } from "@/lib/validators";

interface Customer {
  qrCodeId: string;
  name: string;
  email: string;
  purchaseCount: number;
  rewardsEarned: number;
  rewardsUsed: number;
}

const ScanPage = () => {
  const [scanning, setScanning] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [reward, setReward] = useState(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Initialize scanner
    if (!scanning) {
      return;
    }

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(onScanSuccess, onScanFailure);

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [scanning]);

  const onScanSuccess = async (decodedText: any) => {
    try {
      // Stop scanning
      if (scannerRef.current) {
        scannerRef.current.clear();
        setScanning(false);
      }

      // Parse QR code data
      let qrData;
      try {
        qrData = parseQRCode(decodedText);
      } catch (parseError) {
        // If parsing as JSON fails, try using the raw string as the QR code ID
        // This handles the case where the QR might just contain the ID directly
        qrData = { customerId: decodedText };
      }

      // Fetch customer data using the QR code ID
      if (!qrData) {
        throw new Error("QR data is undefined");
      }
      const response = await fetch(`/api/customers/qr/${qrData.customerId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch customer data");
      }

      const customerData = await response.json();
      setCustomer(customerData);
    } catch (error) {
      console.error("QR scan processing error:", error);
      setError("Invalid QR code or customer not found");
    }
  };

  const onScanFailure = (error: any) => {
    console.warn(`QR code scan error: ${error}`);
  };

  const handleStartScan = () => {
    setScanning(true);
    setCustomer(null);
    setError("");
    setSuccess(false);
    setReward(null);
  };

  const handlePurchaseSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!customer || !amount) {
      setError("Customer and amount are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/purchases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qrCodeId: customer.qrCodeId,
          amount: parseFloat(amount),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to record purchase");
      }

      const result = await response.json();
      setSuccess(true);

      if (result.newReward) {
        setReward(result.newReward);
      }

      // Update customer data with new purchase count
      setCustomer({
        ...customer,
        purchaseCount: result.currentPurchaseCount,
      });

      setAmount("");
    } catch (error) {
      console.error("Purchase submission error:", error);
      setError("Failed to record purchase");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Cashier Station</h1>

      {!scanning && !customer && (
        <button
          onClick={handleStartScan}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Scan Customer QR Code
        </button>
      )}

      {scanning && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Scan Customer QR Code</h2>
          <div id="reader" className="w-full max-w-md"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {customer && (
        <div className="bg-black shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
          <p>
            <strong>Name:</strong> {customer.name || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {customer.email || "N/A"}
          </p>
          <p>
            <strong>Purchase Count:</strong> {customer.purchaseCount}
          </p>
          <p>
            <strong>Available Rewards:</strong>{" "}
            {customer.rewardsEarned - customer.rewardsUsed}
          </p>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Record Purchase</h3>
            <form onSubmit={handlePurchaseSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                {loading ? "Processing..." : "Record Purchase"}
              </button>
            </form>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Purchase recorded successfully!
        </div>
      )}

      {reward && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
          <p className="font-bold">🎉 Reward Earned! 🎉</p>
          <p>
            The customer has earned a free reward! They can redeem it on their
            next visit.
          </p>
        </div>
      )}

      {customer && (
        <div className="mt-6">
          <button
            onClick={handleStartScan}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Scan New Customer
          </button>
        </div>
      )}
    </div>
  );
};

export default ScanPage;
