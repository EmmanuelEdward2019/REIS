import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/contexts/CartContext';
import { useRegion } from '@/contexts/RegionContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { ArrowLeft, CreditCard, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  initializePaystackPayment,
  generatePaymentReference,
  convertToSmallestUnit,
  PaystackResponse
} from '@/utils/payment';

// Import fallback image
import productCommercialSolar from '@/assets/product-commercial-solar.jpg';

interface ShippingAddress {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

const Checkout = () => {
  const { t } = useTranslation();
  const { cartItems, cartItemCount, getCartTotal, clearCart } = useCart();
  const { region, formatCurrency } = useRegion();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'stripe'>('paystack');

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: region.country
  });

  const [billingAddress, setBillingAddress] = useState<ShippingAddress>({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: region.country
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // Redirect if cart is empty
    if (!loading && cartItemCount === 0) {
      toast.error('Please add items to your cart before checking out');
      navigate('/shop');
    }
  }, [cartItemCount, loading]);

  useEffect(() => {
    // Auto-select payment method based on currency
    if (region.currency === 'NGN') {
      setPaymentMethod('paystack');
    } else if (region.currency === 'GBP') {
      setPaymentMethod('stripe');
    }
  }, [region.currency]);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        setUserEmail(user.email || '');

        // Load user profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, phone_number')
          .eq('user_id', user.id)
          .single();

        if (profile) {
          setShippingAddress(prev => ({
            ...prev,
            full_name: profile.full_name || '',
            phone: profile.phone_number || ''
          }));
          setBillingAddress(prev => ({
            ...prev,
            full_name: profile.full_name || '',
            phone: profile.phone_number || ''
          }));
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  };

  const handleShippingChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
    if (sameAsShipping) {
      setBillingAddress(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleBillingChange = (field: keyof ShippingAddress, value: string) => {
    setBillingAddress(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!shippingAddress.full_name || !shippingAddress.phone ||
      !shippingAddress.address_line1 || !shippingAddress.city ||
      !shippingAddress.state || !shippingAddress.country) {
      toast.error('Please fill in all required shipping address fields');
      return false;
    }

    if (!sameAsShipping) {
      if (!billingAddress.full_name || !billingAddress.phone ||
        !billingAddress.address_line1 || !billingAddress.city ||
        !billingAddress.state || !billingAddress.country) {
        toast.error('Please fill in all required billing address fields');
        return false;
      }
    }

    return true;
  };

  const generateOrderNumber = async (): Promise<string> => {
    // Get next sequence value
    const { data, error } = await supabase.rpc('nextval', {
      sequence_name: 'order_number_seq'
    });

    if (error) {
      console.error('Error generating order number:', error);
      // Fallback to timestamp-based order number
      return `ORD-${Date.now()}`;
    }

    const orderNum = data || Math.floor(Math.random() * 1000000);
    return `ORD-${String(orderNum).padStart(6, '0')}`;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    // If guest, validate email
    if (!userId && !userEmail) {
      toast.error('Please provide an email address');
      return;
    }

    try {
      setLoading(true);

      let currentUserId = userId;

      // Auto-onboard if guest
      if (!currentUserId) {
        try {
          // Create user
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: userEmail,
            password: 'MySoft@2025', // Default password
            options: {
              data: {
                full_name: shippingAddress.full_name,
                phone_number: shippingAddress.phone,
              }
            }
          });

          if (authError) {
            if (authError.message.includes('already registered')) {
              toast.error('Account already exists. Please log in to continue.');
              setLoading(false);
              return;
            }
            throw authError;
          }

          if (authData.user) {
            currentUserId = authData.user.id;
            toast.success('Account created! Check your email for login details.');
          }
        } catch (err: any) {
          console.error('Error creating account:', err);
          toast.error('Failed to create account. ' + err.message);
          setLoading(false);
          return;
        }
      }

      if (!currentUserId) {
        toast.error('Could not verify user identity.');
        setLoading(false);
        return;
      }

      // Calculate totals
      const subtotal = getCartTotal(region.currency as 'NGN' | 'GBP');
      const tax = subtotal * 0.075; // 7.5% VAT
      const shipping = region.currency === 'GBP' ? 50 : 5000;
      const total = subtotal + tax + shipping;

      // Generate order number
      const orderNumber = await generateOrderNumber();

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_id: currentUserId,
          status: 'pending',
          payment_status: 'pending',
          subtotal: subtotal,
          tax: tax,
          shipping_fee: shipping,
          total: total,
          currency: region.currency,
          shipping_address: shippingAddress,
          billing_address: sameAsShipping ? shippingAddress : billingAddress,
          payment_method: paymentMethod
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product.name,
        product_sku: item.product.brand || '',
        quantity: item.quantity,
        unit_price: region.currency === 'GBP' ? item.product.price_gbp : item.product.price_ngn,
        total_price: (region.currency === 'GBP' ? item.product.price_gbp : item.product.price_ngn) * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Initialize payment based on selected method
      if (paymentMethod === 'paystack' && region.currency === 'NGN') {
        // Paystack payment for NGN
        const paymentReference = generatePaymentReference(order.id);
        const amountInKobo = convertToSmallestUnit(total, 'NGN');

        // Store payment reference in order
        await supabase
          .from('orders')
          .update({ payment_reference: paymentReference })
          .eq('id', order.id);

        initializePaystackPayment(
          {
            email: userEmail,
            amount: amountInKobo,
            reference: paymentReference,
            currency: 'NGN',
            metadata: {
              order_id: order.id,
              customer_name: shippingAddress.full_name,
              order_number: orderNumber
            }
          },
          async (response: PaystackResponse) => {
            // Payment successful
            console.log('Paystack payment successful:', response);

            // Update order payment status
            await supabase
              .from('orders')
              .update({
                payment_status: 'paid',
                status: 'processing'
              })
              .eq('id', order.id);

            // Create payment transaction record
            await supabase
              .from('payment_transactions')
              .insert({
                order_id: order.id,
                transaction_reference: response.reference,
                payment_method: 'paystack',
                amount: total,
                currency: 'NGN',
                status: 'success',
                gateway_response: response
              });

            // Clear cart
            await clearCart();

            toast.success(`Order ${orderNumber} has been paid successfully`);

            navigate(`/order-confirmation/${order.id}`);
          },
          async () => {
            // Payment cancelled or closed
            console.log('Payment cancelled');

            toast.error('Payment cancelled. You can complete payment later from your orders page');

            setLoading(false);
          }
        );
      } else if (paymentMethod === 'stripe' && region.currency === 'GBP') {
        // Stripe payment for GBP
        toast.info('Stripe payment integration coming soon. Order created successfully.');

        // For now, just mark as pending and navigate to confirmation
        await clearCart();
        navigate(`/order-confirmation/${order.id}`);
      } else {
        // Fallback - just create order without payment
        await clearCart();

        toast.success(`Order ${orderNumber} has been created successfully`);

        navigate(`/order-confirmation/${order.id}`);
      }

    } catch (error: any) {
      console.error('Error placing order:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  const subtotal = getCartTotal(region.currency as 'NGN' | 'GBP');
  const tax = subtotal * 0.075;
  const shipping = subtotal > 0 ? (region.currency === 'GBP' ? 50 : 5000) : 0;
  const total = subtotal + tax + shipping;

  const getProductImage = (images: string[]) => {
    if (images && images.length > 0) {
      return images[0];
    }
    return productCommercialSolar;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/cart')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
            <h1 className="text-3xl font-bold text-foreground">{t('checkout.title')}</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information (Guest) */}
              {!userId && (
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="Enter your email for order updates"
                        required
                      />
                      <p className="text-sm text-muted-foreground">
                        We'll create an account for you so you can track your order.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('checkout.shipping_address')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shipping_full_name">{t('checkout.full_name')} *</Label>
                      <Input
                        id="shipping_full_name"
                        value={shippingAddress.full_name}
                        onChange={(e) => handleShippingChange('full_name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="shipping_phone">{t('checkout.phone')} *</Label>
                      <Input
                        id="shipping_phone"
                        value={shippingAddress.phone}
                        onChange={(e) => handleShippingChange('phone', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="shipping_address1">{t('checkout.address_line1')} *</Label>
                    <Input
                      id="shipping_address1"
                      value={shippingAddress.address_line1}
                      onChange={(e) => handleShippingChange('address_line1', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="shipping_address2">{t('checkout.address_line2')}</Label>
                    <Input
                      id="shipping_address2"
                      value={shippingAddress.address_line2}
                      onChange={(e) => handleShippingChange('address_line2', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="shipping_city">{t('checkout.city')} *</Label>
                      <Input
                        id="shipping_city"
                        value={shippingAddress.city}
                        onChange={(e) => handleShippingChange('city', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="shipping_state">{t('checkout.state')} *</Label>
                      <Input
                        id="shipping_state"
                        value={shippingAddress.state}
                        onChange={(e) => handleShippingChange('state', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="shipping_postal">{t('checkout.postal_code')}</Label>
                      <Input
                        id="shipping_postal"
                        value={shippingAddress.postal_code}
                        onChange={(e) => handleShippingChange('postal_code', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="shipping_country">{t('checkout.country')} *</Label>
                    <Input
                      id="shipping_country"
                      value={shippingAddress.country}
                      onChange={(e) => handleShippingChange('country', e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('checkout.billing_address')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="same_as_shipping"
                      checked={sameAsShipping}
                      onChange={(e) => {
                        setSameAsShipping(e.target.checked);
                        if (e.target.checked) {
                          setBillingAddress(shippingAddress);
                        }
                      }}
                      className="rounded"
                    />
                    <Label htmlFor="same_as_shipping" className="cursor-pointer">
                      {t('checkout.same_as_shipping')}
                    </Label>
                  </div>

                  {!sameAsShipping && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="billing_full_name">{t('checkout.full_name')} *</Label>
                          <Input
                            id="billing_full_name"
                            value={billingAddress.full_name}
                            onChange={(e) => handleBillingChange('full_name', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="billing_phone">{t('checkout.phone')} *</Label>
                          <Input
                            id="billing_phone"
                            value={billingAddress.phone}
                            onChange={(e) => handleBillingChange('phone', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="billing_address1">{t('checkout.address_line1')} *</Label>
                        <Input
                          id="billing_address1"
                          value={billingAddress.address_line1}
                          onChange={(e) => handleBillingChange('address_line1', e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="billing_address2">{t('checkout.address_line2')}</Label>
                        <Input
                          id="billing_address2"
                          value={billingAddress.address_line2}
                          onChange={(e) => handleBillingChange('address_line2', e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="billing_city">{t('checkout.city')} *</Label>
                          <Input
                            id="billing_city"
                            value={billingAddress.city}
                            onChange={(e) => handleBillingChange('city', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="billing_state">{t('checkout.state')} *</Label>
                          <Input
                            id="billing_state"
                            value={billingAddress.state}
                            onChange={(e) => handleBillingChange('state', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="billing_postal">{t('checkout.postal_code')}</Label>
                          <Input
                            id="billing_postal"
                            value={billingAddress.postal_code}
                            onChange={(e) => handleBillingChange('postal_code', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="billing_country">{t('checkout.country')} *</Label>
                        <Input
                          id="billing_country"
                          value={billingAddress.country}
                          onChange={(e) => handleBillingChange('country', e.target.value)}
                          required
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('checkout.payment_method')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                    {region.currency === 'NGN' && (
                      <div className="flex items-center space-x-2 border rounded-lg p-4">
                        <RadioGroupItem value="paystack" id="paystack" />
                        <Label htmlFor="paystack" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Paystack</p>
                              <p className="text-sm text-muted-foreground">Pay with card, bank transfer, or USSD</p>
                            </div>
                            <CreditCard className="w-6 h-6 text-muted-foreground" />
                          </div>
                        </Label>
                      </div>
                    )}

                    {region.currency === 'GBP' && (
                      <div className="flex items-center space-x-2 border rounded-lg p-4">
                        <RadioGroupItem value="stripe" id="stripe" />
                        <Label htmlFor="stripe" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Stripe</p>
                              <p className="text-sm text-muted-foreground">Pay securely with credit or debit card</p>
                            </div>
                            <CreditCard className="w-6 h-6 text-muted-foreground" />
                          </div>
                        </Label>
                      </div>
                    )}
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={getProductImage(item.product.images)}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = productCommercialSolar;
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="text-sm font-medium">
                            {formatCurrency(
                              (region.currency === 'GBP' ? item.product.price_gbp : item.product.price_ngn) * item.quantity
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (7.5%)</span>
                      <span className="font-medium">{formatCurrency(tax)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">{formatCurrency(shipping)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">{formatCurrency(total)}</span>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Prices shown in {region.currency}
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={loading || cartItemCount === 0}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {t('checkout.processing')}
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        {t('checkout.place_order')}
                      </>
                    )}
                  </Button>

                  {/* Security Note */}
                  <p className="text-xs text-center text-muted-foreground">
                    {t('checkout.secure_payment')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;

