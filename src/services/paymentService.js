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
