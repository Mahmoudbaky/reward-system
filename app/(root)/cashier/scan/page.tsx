"use client";
import { useState, useEffect, useRef, FormEvent } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { parseQRCode } from "@/lib/actions/qr-code.actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatId } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Customer {
  id: string;
  qrCodeId: string;
  name: string;
  phone: string;
  email: string;
  purchaseCount: number;
  rewardsEarned: number;
  rewardsUsed: number;
}

interface Reward {
  customerId: string;
  id: string;
  isUsed: boolean;
  createdAt: string;
}

const ScanPage = () => {
  const [scanning, setScanning] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [rewards, setRewards] = useState<Reward[] | null>([]);
  const [rewardsCount, setRewardsCount] = useState(0);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (rewards && rewards.length > 0) {
      setRewardsCount(rewards.filter((reward) => !reward.isUsed).length);
    }
  }, [rewards]);

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
      console.log(decodedText);
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
      console.log(customerData);
      setCustomer(customerData);
      setRewards(customerData.rewards);
      setRewardsCount(customerData.rewardsEarned);
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
    setRewards([]);
    setRewardsCount(0);
  };

  const handlePurchaseSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(rewards);
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
        setRewards((prevRewards) =>
          prevRewards ? [...prevRewards, result.newReward] : [result.newReward]
        );
      }

      // Update customer data with new purchase count
      setCustomer({
        ...customer,
        purchaseCount: result.currentPurchaseCount,
      });

      setAmount("");

      if (success) {
        toast.success("Purchase done", {
          description: "Purchase recorded successfully!",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Purchase submission error:", error);
      setError("Failed to record purchase");
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemReward = async (rewardId: string) => {
    try {
      const response = await fetch(`/api/rewards/use`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rewardId,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `Failed to redeem reward: ${response.status} ${errorMessage}`
        );
      }
      if (!response.ok) {
        throw new Error("Failed to redeem reward");
      }
      const updatedReward = await response.json();
      console.log(updatedReward);
      setRewards((prevRewards) =>
        prevRewards
          ? prevRewards.filter((reward) => reward.id !== rewardId)
          : []
      );
      setRewardsCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Failed to redeem reward:", error);
      setError("Failed to redeem reward");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 ">
      <h1 className="text-2xl font-bold mb-6">Cashier Station</h1>

      {!scanning && !customer && (
        <Button onClick={handleStartScan}>Scan Customer QR Code</Button>
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
        <div className="bg-white text-black shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
          <p>
            <strong>Name:</strong> {customer.name || "N/A"}
          </p>
          <p>
            <strong>Phone number:</strong> {customer.phone || "N/A"}
          </p>
          <p>
            <strong>Purchase Count:</strong> {customer.purchaseCount}
          </p>
          <p>
            <strong>Available Rewards:</strong> {rewardsCount}
          </p>
          {/* <p>
            <strong>Used Rewards:</strong> {customer.rewardsUsed}
          </p> */}

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
              <div className="flex justify-between">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                  {loading ? "Processing..." : "Record Purchase"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Purchase recorded successfully!
        </div>
      )}

      {/* TODO: impelement this the toast way */}
      {/* {rewards.length > 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
          <p className="font-bold">🎉 Reward Earned! 🎉</p>
          <p>
            The customer has earned a free reward! They can redeem it on their
            next visit.
          </p>
        </div>
      )} */}

      {rewards && rewards.length > 0 && (
        <Table className="mx-auto">
          <TableCaption>A list of your recent rewards</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="">Reward</TableHead>
              <TableHead>Available?</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rewards.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">
                  {formatId(r.id || "")}
                </TableCell>
                <TableCell>
                  {r.isUsed ? (
                    <Badge variant="default" className="bg-red-500">
                      Not Available
                    </Badge>
                  ) : (
                    <Badge variant="default" className="bg-green-500">
                      Available
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      handleRedeemReward(r.id);
                    }}
                    variant="default"
                    size="sm"
                  >
                    Redeem
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {customer && (
        <div className="mt-6">
          <Button
            onClick={handleStartScan}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Scan New Customer
          </Button>
        </div>
      )}

      <Toaster />
    </div>
  );
};

export default ScanPage;
