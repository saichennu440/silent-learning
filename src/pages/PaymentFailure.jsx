import {updatePaymentStatus} from "../services/paymentService";
import React from "react";
import {useEffect} from "react";
const PaymentFailure = () => {
  useEffect(() => {
      // Parse URL parameters from Easebuzz
      const params = new URLSearchParams(window.location.search);
      const txnid = params.get('txnid');
      const status = params.get('status');
      
      // Update payment status in database
      if (txnid && status === 'failure') {
        updatePaymentStatus(txnid, 'failure', Object.fromEntries(params));
      }
    }, []); 

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <h1 className="text-3xl font-bold text-red-700 mb-4">
        ❌ Payment Failed
      </h1>
      <p className="text-gray-700">
        Something went wrong with your payment. Please try again.
      </p>
      <button
          onClick={() => window.location.href = '/'}
          className="bg-blue-600 text-white px-8 py-3 mt-4 rounded-lg font-semibold hover:bg-blue-700"
        >
          Go to Home
        </button>
    </div>
  );
};

export default PaymentFailure;
