import Link from "next/link";
import { QrCode } from "lucide-react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CashierHomePage() {
  return (
    <div className="bg-gradient-to-b from-amber-50 to-amber-100 min-h-screen">
      <div className="container mx-auto px-4 py-12 ">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Cafe Rewards System</h1>
          <p className="text-xl text-gray-600">Cashier Portal</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4  mb-3">
              <QrCode />
              <h2 className="text-2xl font-bold ">Scan customer Qr-code</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Scan customer QR codes, record purchases, and apply rewards.
            </p>
            <Button asChild variant="default">
              <Link
                href="/cashier/scan"
                // className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
              >
                Go to Cashier Portal
              </Link>
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-3">
              <User />
              <h2 className="text-2xl font-bold ">Customer Registration</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Register new customers and generate their reward QR codes.
            </p>
            <Button asChild variant="default">
              <Link
                href="/cashier/register-customer"
                // className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded"
              >
                Register Customer
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
