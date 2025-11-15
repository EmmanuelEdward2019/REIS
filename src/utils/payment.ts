import { loadStripe, Stripe } from '@stripe/stripe-js';

// Payment configuration
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

// Initialize Stripe
let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

// Paystack Payment Interface
export interface PaystackPaymentData {
  email: string;
  amount: number; // Amount in kobo (NGN * 100)
  reference: string;
  currency: 'NGN';
  metadata?: {
    order_id: string;
    customer_name: string;
    [key: string]: any;
  };
}

export interface PaystackResponse {
  status: 'success' | 'failed';
  reference: string;
  trans?: string;
  transaction?: string;
  message?: string;
  trxref?: string;
}

// Initialize Paystack Payment
export const initializePaystackPayment = (
  paymentData: PaystackPaymentData,
  onSuccess: (response: PaystackResponse) => void,
  onClose: () => void
) => {
  // @ts-ignore - PaystackPop is loaded from CDN
  if (typeof PaystackPop === 'undefined') {
    console.error('Paystack script not loaded');
    return;
  }

  // @ts-ignore
  const handler = PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: paymentData.email,
    amount: paymentData.amount,
    currency: paymentData.currency,
    ref: paymentData.reference,
    metadata: paymentData.metadata,
    onClose: () => {
      console.log('Payment window closed');
      onClose();
    },
    callback: (response: PaystackResponse) => {
      console.log('Payment successful:', response);
      onSuccess(response);
    },
  });

  handler.openIframe();
};

// Stripe Payment Interface
export interface StripePaymentData {
  amount: number; // Amount in pence (GBP * 100)
  currency: 'gbp';
  orderId: string;
  customerEmail: string;
  customerName: string;
}

// Create Stripe Payment Intent (requires backend endpoint)
export const createStripePaymentIntent = async (
  paymentData: StripePaymentData
): Promise<{ clientSecret: string; error?: string }> => {
  try {
    // TODO: Replace with your actual backend endpoint
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create payment intent');
    }

    return { clientSecret: data.clientSecret };
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return { clientSecret: '', error: error.message };
  }
};

// Generate unique payment reference
export const generatePaymentReference = (orderId: string): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `${orderId}-${timestamp}-${random}`;
};

// Convert amount to smallest currency unit
export const convertToSmallestUnit = (amount: number, currency: 'NGN' | 'GBP'): number => {
  // Both NGN (kobo) and GBP (pence) use 100 as multiplier
  return Math.round(amount * 100);
};

// Verify Paystack Payment (requires backend endpoint)
export const verifyPaystackPayment = async (
  reference: string
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    // TODO: Replace with your actual backend endpoint
    const response = await fetch(`/api/verify-paystack-payment/${reference}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to verify payment');
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return { success: false, error: error.message };
  }
};

// Payment status helpers
export const getPaymentStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'paid':
    case 'success':
    case 'completed':
      return 'text-green-600 bg-green-50';
    case 'pending':
    case 'processing':
      return 'text-yellow-600 bg-yellow-50';
    case 'failed':
    case 'cancelled':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const getPaymentStatusLabel = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'paid':
      return 'Paid';
    case 'pending':
      return 'Pending';
    case 'processing':
      return 'Processing';
    case 'failed':
      return 'Failed';
    case 'cancelled':
      return 'Cancelled';
    case 'refunded':
      return 'Refunded';
    default:
      return status;
  }
};

