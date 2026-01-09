import { supabase } from '../config/supabase';

/**
 * Initiate Easebuzz payment
 */
export const initiateEasebuzzPayment = async (paymentData) => {
  try {
    const FUNCTIONS_URL = import.meta.env.VITE_EASEBUZZ_FUNCTION_URL; // set this in .env
    const res = await fetch(`${FUNCTIONS_URL}/easebuzz-initiate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Initiate payment failed');

    return data;
  } catch (err) {
    console.error("initiateEasebuzzPayment error:", err);
    throw err;
  }
};


/**
 * Save payment record to database
 */
export const savePaymentRecord = async (paymentData) => {
  try {
    const { data, error } = await supabase
      .from('payment_transactions')
      .insert([paymentData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving payment record:', error);
    throw error;
  }
};

/**
 * Update payment status
 */
export const updatePaymentStatus = async (transactionId, status, easebuzzData = {}) => {
  try {
    const { data, error } = await supabase
      .from('payment_transactions')
      .update({
        status,
        easebuzz_payment_id: easebuzzData.easepayid || null,
        payment_response: easebuzzData,
        updated_at: new Date().toISOString(),
      })
      .eq('transaction_id', transactionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};