// PaymentModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Wallet, AlertCircle } from 'lucide-react';
import { initiateEasebuzzPayment, savePaymentRecord } from '../services/paymentService';

const sanitizeNumber = (s) => {
  if (s == null) return 0;
  const cleaned = String(s).replace(/[^0-9.]/g, '');
  const v = parseFloat(cleaned);
  return Number.isFinite(v) ? v : 0;
};

const PaymentModal = ({ isOpen, onClose, course }) => {
  const [paymentType, setPaymentType] = useState('full'); // 'full' or 'partial'
  const [partialAmount, setPartialAmount] = useState('5000');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!course) return null;

  // Get the current price (assuming first duration for simplicity)
  const fullAmount = sanitizeNumber(
    Array.isArray(course.durations) && course.durations.length > 0
      ? course.durations[0].priceText
      : course.priceText || '0'
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePartialAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    setPartialAmount(value);
    
    if (parseInt(value) < 5000) {
      setErrors((prev) => ({ ...prev, partialAmount: 'Minimum amount is ₹5,000' }));
    } else if (parseInt(value) > fullAmount) {
      setErrors((prev) => ({ ...prev, partialAmount: 'Cannot exceed full amount' }));
    } else {
      setErrors((prev) => ({ ...prev, partialAmount: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }

    if (paymentType === 'partial') {
      const amount = parseInt(partialAmount);
      if (amount < 5000) {
        newErrors.partialAmount = 'Minimum amount is ₹5,000';
      } else if (amount > fullAmount) {
        newErrors.partialAmount = 'Cannot exceed full amount';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const amount = paymentType === 'full' ? fullAmount : parseFloat(partialAmount);
      if (!(amount > 0)) throw new Error('Invalid amount');
      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Save payment record to database
      const paymentRecord = {
        user_name: formData.name,
        user_email: formData.email,
        user_phone: formData.phone,
        course_id: course.id,
        course_title: course.title,
        amount: amount,
        payment_type: paymentType,
        transaction_id: transactionId,
        status: 'pending',
      };

      await savePaymentRecord(paymentRecord);

// sanitize productinfo and format amount
const sanitizeProductInfo = (s) =>
  String(s || '').replace(/[^a-zA-Z0-9\s\-]/g, '').trim().slice(0, 100);

const productinfo = sanitizeProductInfo(course.title);
const paymentData = {
  txnid: transactionId,
  amount: Number(amount).toFixed(2), // e.g. "5000.00"
  productinfo,
  firstname: formData.name,
  phone: formData.phone,
  email: formData.email,
  surl: `${window.location.origin}/payment-success`,
  furl: `${window.location.origin}/payment-failure`,
  udf1: String(course.id || ""),
  udf2: String(paymentType || ""),
};

// call edge function which calls Easebuzz initiateLink and returns {status, data}
const response = await initiateEasebuzzPayment(paymentData);
console.log("EASEBUZZ EDGE RESPONSE 👉", response);
return; // ⛔ STOP HERE (important)

// 1) If Edge returned access key (preferred)
if (response && (response.status === 1 || response.status === "1") && response.data) {
  const easebuzzBase = (import.meta.env.VITE_EASEBUZZ_ENV === "prod")
    ? "https://pay.easebuzz.in"
    : "https://testpay.easebuzz.in";

  // redirect user to hosted checkout
  window.location.href = `${easebuzzBase}/pay/${response.data}`;
  return;
}

// 2) Fallback: if Edge returns action+fields (older flow), POST form to action
if (response && response.action && response.key && response.hash) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = response.action;

  // only include allowed fields (avoid any unexpected objects)
  const allowed = ['key','txnid','amount','productinfo','firstname','email','phone','surl','furl','udf1','udf2','udf3','udf4','udf5','hash'];
  allowed.forEach(k => {
    if (response[k] !== undefined && response[k] !== null) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = k;
      input.value = String(response[k]);
      form.appendChild(input);
    }
  });

  document.body.appendChild(form);
 
  return;
}

// If we reach here, show the returned error (if any)
if (response && response.error_desc) {
  throw new Error(response.error_desc || "Payment initiation failed");
}
throw new Error("Unexpected response from payment server");

} catch (error) {
  console.error("Payment error:", error);
  alert("Payment initiation failed. Please try again.");
} finally {
  setLoading(false);
}

};

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-blue-900">Complete Payment</h2>
                <p className="text-sm text-gray-600 mt-1">{course.title}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={loading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handlePayment} className="p-8">
              {/* Payment Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Option
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentType('full')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      paymentType === 'full'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    <Wallet className={`w-6 h-6 mx-auto mb-2 ${paymentType === 'full' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div className="font-semibold text-gray-900">Full Payment</div>
                    <div className="text-xl font-bold text-blue-600 mt-1">₹{fullAmount.toLocaleString()}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentType('partial')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      paymentType === 'partial'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    <CreditCard className={`w-6 h-6 mx-auto mb-2 ${paymentType === 'partial' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div className="font-semibold text-gray-900">Partial Payment</div>
                    <div className="text-sm text-gray-600 mt-1">Min ₹5,000</div>
                  </button>
                </div>
              </div>

              {/* Partial Amount Input */}
              {paymentType === 'partial' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Amount (₹)
                  </label>
                  <input
                    type="text"
                    value={partialAmount}
                    onChange={handlePartialAmountChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-lg font-semibold ${
                      errors.partialAmount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="5000"
                  />
                  {errors.partialAmount && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.partialAmount}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    Remaining: ₹{(fullAmount - parseFloat(partialAmount || 0)).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Personal Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength={10}
                      className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="9876543210"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Payment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Course:</span>
                    <span className="font-medium">{course.title}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Payment Type:</span>
                    <span className="font-medium capitalize">{paymentType}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between text-lg font-bold text-blue-900">
                    <span>Total Amount:</span>
                    <span>₹{(paymentType === 'full' ? fullAmount : parseFloat(partialAmount || 0)).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Proceed to Pay'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;