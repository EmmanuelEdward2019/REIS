import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { useRegion } from '@/contexts/RegionContext';
import { toast } from '@/components/ui/sonner';
import { useTranslation } from 'react-i18next';
import { 
  ShoppingCart, 
  Star, 
  Truck, 
  Shield, 
  ArrowLeft,
  Check,
  Package,
  AlertCircle
} from 'lucide-react';

// Import fallback image
import productCommercialSolar from '@/assets/product-commercial-solar.jpg';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price_ngn: number;
  price_gbp: number;
  currency: string;
  stock_quantity: number;
  sku: string;
  brand: string;
  specifications: any;
  images: string[];
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
}

interface Review {
  id: string;
  rating: number;
  review_text: string;
  is_verified_purchase: boolean;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string;
  };
}

const ProductDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { region, formatCurrency } = useRegion();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchReviews();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setProduct(data);
      
      // Fetch related products
      if (data) {
        const { data: related } = await supabase
          .from('products')
          .select('*')
          .eq('category', data.category)
          .eq('is_active', true)
          .neq('id', id)
          .limit(4);
        
        setRelatedProducts(related || []);
      }
    } catch (error: any) {
      console.error('Error fetching product:', error);
      toast({
        title: 'Error',
        description: 'Failed to load product details',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select(`
          *,
          profiles:user_id (
            full_name
          )
        `)
        .eq('product_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product.id, quantity);
  };

  const getProductPrice = () => {
    if (!product) return 0;
    return region.currency === 'GBP' ? product.price_gbp : product.price_ngn;
  };

  const getProductImage = (images: string[], index: number = 0) => {
    if (images && images.length > index) {
      return images[index];
    }
    return productCommercialSolar;
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getStockStatus = () => {
    if (!product) return { text: t('product.out_of_stock'), color: 'destructive', icon: AlertCircle };

    if (product.stock_quantity === 0) {
      return { text: t('product.out_of_stock'), color: 'destructive' as const, icon: AlertCircle };
    } else if (product.stock_quantity < 10) {
      return { text: t('product.low_stock', { count: product.stock_quantity }), color: 'warning' as const, icon: AlertCircle };
    } else {
      return { text: t('product.in_stock'), color: 'default' as const, icon: Check };
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-96 bg-muted rounded"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-12 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen bg-background pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Button onClick={() => navigate('/shop')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const stockStatus = getStockStatus();
  const StockIcon = stockStatus.icon;

  return (
    <Layout>
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/shop')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Button>

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={getProductImage(product.images, selectedImage)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = productCommercialSolar;
                  }}
                />
              </div>
              
              {/* Image Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-md overflow-hidden border-2 ${
                        selectedImage === index ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = productCommercialSolar;
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category & Brand */}
              <div className="flex items-center gap-2">
                <Badge variant="outline">{product.category.replace('_', ' ')}</Badge>
                {product.is_featured && <Badge variant="default">Featured</Badge>}
              </div>

              {/* Product Name */}
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                {product.brand && (
                  <p className="text-lg text-muted-foreground">by {product.brand}</p>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(Number(calculateAverageRating()))
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {calculateAverageRating()} ({reviews.length} {t('product.reviews')})
                </span>
              </div>

              {/* Price */}
              <div className="text-4xl font-bold text-primary">
                {formatCurrency(getProductPrice())}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <StockIcon className="w-5 h-5" />
                <Badge variant={stockStatus.color}>{stockStatus.text}</Badge>
                <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
              </div>

              <Separator />

              {/* Quantity Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="px-6 font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      disabled={quantity >= product.stock_quantity}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {t('product.add_to_cart')}
              </Button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <Truck className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">{t('product.free_shipping')}</p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">{t('product.warranty')}</p>
                </div>
                <div className="text-center">
                  <Package className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">{t('product.easy_returns')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <Tabs defaultValue="description" className="mb-12">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">{t('product.description')}</TabsTrigger>
              <TabsTrigger value="specifications">{t('product.specifications')}</TabsTrigger>
              <TabsTrigger value="reviews">{t('product.reviews')} ({reviews.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground whitespace-pre-line">
                    {product.description || t('product.no_description')}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  {product.specifications && typeof product.specifications === 'object' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between border-b pb-2">
                          <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>
                          <span className="text-muted-foreground">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">{t('product.no_specifications')}</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-muted-foreground">{t('product.no_reviews')}</p>
                    </CardContent>
                  </Card>
                ) : (
                  reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium">
                              {review.profiles?.full_name || 'Anonymous'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              {review.is_verified_purchase && (
                                <Badge variant="outline" className="text-xs">
                                  {t('product.verified_purchase')}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {review.review_text && (
                          <p className="text-muted-foreground mt-2">{review.review_text}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">{t('product.related_products')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Card
                    key={relatedProduct.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/product/${relatedProduct.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="aspect-square rounded-md overflow-hidden mb-4 bg-muted">
                        <img
                          src={getProductImage(relatedProduct.images, 0)}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = productCommercialSolar;
                          }}
                        />
                      </div>
                      <h3 className="font-semibold mb-2 line-clamp-2">{relatedProduct.name}</h3>
                      {relatedProduct.brand && (
                        <p className="text-sm text-muted-foreground mb-2">{relatedProduct.brand}</p>
                      )}
                      <p className="text-lg font-bold text-primary">
                        {formatCurrency(
                          region.currency === 'GBP'
                            ? relatedProduct.price_gbp
                            : relatedProduct.price_ngn
                        )}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;

