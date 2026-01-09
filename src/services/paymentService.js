import { supabase } from '../config/supabase';

const EDGE_BASE_URL = import.meta.env.VITE_SUPABASE_EDGE_URL;

export const initiateEasebuzzPayment = async (paymentData) => {
  const response = await fetch(
    `${EDGE_BASE_URL}/easebuzz-initiate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    }
  );

  const text = await response.text();

  // IMPORTANT: avoid JSON crash
  if (!text) {
    throw new Error("Empty response from Edge Function");
  }

  return JSON.parse(text);
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