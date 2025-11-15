import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useRegion } from '@/contexts/RegionContext';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';

// Import fallback image
import productCommercialSolar from '@/assets/product-commercial-solar.jpg';

const Cart = () => {
  const { t } = useTranslation();
  const { cartItems, cartItemCount, isLoading, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { region, formatCurrency } = useRegion();
  const navigate = useNavigate();

  // Get product image
  const getProductImage = (images: string[]) => {
    if (images && images.length > 0) {
      return images[0];
    }
    return productCommercialSolar;
  };

  // Get product price in current currency
  const getProductPrice = (item: any) => {
    return region.currency === 'GBP' ? item.product.price_gbp : item.product.price_ngn;
  };

  // Calculate subtotal for an item
  const getItemSubtotal = (item: any) => {
    return getProductPrice(item) * item.quantity;
  };

  // Calculate cart totals
  const subtotal = getCartTotal(region.currency as 'NGN' | 'GBP');
  const tax = subtotal * 0.075; // 7.5% VAT
  const shipping = subtotal > 0 ? (region.currency === 'GBP' ? 50 : 5000) : 0;
  const total = subtotal + tax + shipping;

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/shop')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('cart.continue_shopping')}
            </Button>
            <h1 className="text-3xl font-bold text-foreground">{t('cart.title')}</h1>
            <p className="text-muted-foreground mt-2">
              {cartItemCount} {cartItemCount === 1 ? t('cart.item') : t('cart.items')} {t('cart.in_cart')}
            </p>
          </div>

          {/* Empty Cart */}
          {cartItems.length === 0 && (
            <Card className="text-center py-16">
              <CardContent>
                <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2">{t('cart.empty')}</h2>
                <p className="text-muted-foreground mb-6">
                  {t('cart.empty_description')}
                </p>
                <Button onClick={() => navigate('/shop')}>
                  {t('cart.browse_products')}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Cart Items */}
          {cartItems.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items List */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={getProductImage(item.product.images)}
                            alt={item.product.name}
                            className="w-24 h-24 object-cover rounded-md"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = productCommercialSolar;
                            }}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">
                                {item.product.name}
                              </h3>
                              {item.product.brand && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  {item.product.brand}
                                </p>
                              )}
                              <p className="text-lg font-bold text-primary">
                                {formatCurrency(getProductPrice(item))}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center border rounded-md">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="h-8 w-8"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="px-4 font-medium">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.stock_quantity}
                                className="h-8 w-8"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Stock Warning */}
                            {item.quantity >= item.product.stock_quantity && (
                              <Badge variant="destructive" className="text-xs">
                                {t('cart.max_stock')}
                              </Badge>
                            )}

                            {/* Subtotal */}
                            <div className="ml-auto">
                              <p className="text-sm text-muted-foreground">{t('cart.subtotal')}</p>
                              <p className="font-bold">
                                {formatCurrency(getItemSubtotal(item))}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>{t('cart.order_summary')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('cart.tax')}</span>
                      <span className="font-medium">{formatCurrency(tax)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('cart.shipping')}</span>
                      <span className="font-medium">{formatCurrency(shipping)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>{t('cart.total')}</span>
                      <span className="text-primary">{formatCurrency(total)}</span>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {t('cart.prices_in')} {region.currency}
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => navigate('/checkout')}
                    >
                      {t('cart.checkout')}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate('/shop')}
                    >
                      {t('cart.continue_shopping')}
                    </Button>

                    {/* Trust Badges */}
                    <div className="pt-4 space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {t('cart.secure_checkout')}
                        </Badge>
                      </div>
                      <p>
                        • {t('cart.free_shipping')} {formatCurrency(region.currency === 'GBP' ? 500 : 500000)}
                      </p>
                      <p>• {t('cart.return_policy')}</p>
                      <p>• {t('cart.warranty')}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Cart;

