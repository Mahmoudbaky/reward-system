import Link from "next/link";
import { QrCode } from "lucide-react";
import { User } from "lucide-react";

export default function CashierHomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
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
          <Link
            href="/cashier/scan"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
          >
            Go to Cashier Portal
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-3">
            <User />
            <h2 className="text-2xl font-bold ">Customer Registration</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Register new customers and generate their reward QR codes.
          </p>
          <Link
            href="/cashier/register-customer"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded"
          >
            Register Customer
          </Link>
        </div>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="text-3xl font-bold text-blue-500 mb-2">1</div>
            <h3 className="font-semibold text-lg mb-2">Register Customers</h3>
            <p className="text-gray-600">
              Create customer profiles and generate unique QR codes for them.
            </p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <div className="text-3xl font-bold text-green-500 mb-2">2</div>
            <h3 className="font-semibold text-lg mb-2">Scan & Record</h3>
            <p className="text-gray-600">
              Scan customer QR codes and record their purchases.
            </p>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg">
            <div className="text-3xl font-bold text-purple-500 mb-2">3</div>
            <h3 className="font-semibold text-lg mb-2">Earn Rewards</h3>
            <p className="text-gray-600">
              Customers automatically earn rewards after every 5th purchase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
