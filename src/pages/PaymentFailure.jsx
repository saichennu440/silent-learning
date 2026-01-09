import React from 'react';
const PaymentFailure = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <h1 className="text-3xl font-bold text-red-700 mb-4">
        ❌ Payment Failed
      </h1>
      <p className="text-gray-700">
        Something went wrong with your payment. Please try again.
      </p>
    </div>
  );
};

export default PaymentFailure;
