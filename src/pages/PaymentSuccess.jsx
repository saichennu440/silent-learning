import {Check} from "lucide-react";
import {updatePaymentStatus} from "../services/paymentService";
import React from "react";
import {useEffect} from "react";
// PaymentSuccess.jsx
const PaymentSuccess = () => {
  useEffect(() => {
    // Parse URL parameters from Easebuzz
    const params = new URLSearchParams(window.location.search);
    const txnid = params.get('txnid');
    const status = params.get('status');
    
    // Update payment status in database
    if (txnid && status === 'success') {
      updatePaymentStatus(txnid, 'success', Object.fromEntries(params));
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">Your enrollment has been confirmed.</p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;