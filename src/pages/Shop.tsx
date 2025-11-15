import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, ShoppingCart, Menu, Filter, X, Star, ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useRegion } from '@/contexts/RegionContext';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

// Import product images (fallback)
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

const Shop = () => {
  const { t } = useTranslation();
  const { region, formatCurrency } = useRegion();
  const { cartItemCount, addToCart } = useCart();
  const navigate = useNavigate();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [sortBy, setSortBy] = useState('newest');

  // Categories mapping
  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'solar_panel', label: 'Solar Panels' },
    { value: 'inverter', label: 'Inverters' },
    { value: 'battery', label: 'Batteries' },
    { value: 'controller', label: 'Controllers' },
    { value: 'accessory', label: 'Accessories' },
    { value: 'service', label: 'Services' }
  ];

  // Fetch products from database
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProducts(data || []);
      setFilteredProducts(data || []);

      // Set max price range based on products
      if (data && data.length > 0) {
        const maxPrice = Math.max(...data.map(p => p.price_ngn));
        setPriceRange([0, maxPrice]);
      }
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };



  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand));
    }

    // Filter by price range
    filtered = filtered.filter(p => {
      const price = region.currency === 'GBP' ? p.price_gbp : p.price_ngn;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort products
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price_ngn - b.price_ngn);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price_ngn - a.price_ngn);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setFilteredProducts(filtered);
  }, [searchQuery, activeCategory, selectedBrands, priceRange, sortBy, products, region.currency]);

  // Get unique brands
  const availableBrands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));

  // Get product price in current currency
  const getProductPrice = (product: Product) => {
    return region.currency === 'GBP' ? product.price_gbp : product.price_ngn;
  };

  // Get product image
  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return productCommercialSolar; // Fallback image
  };

  // Handle add to cart
  const handleAddToCart = async (productId: string) => {
    await addToCart(productId, 1);
  };

  return (
    <Layout>
      {/* Shop Header */}
      <div className="bg-background border-b border-border pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-foreground">Shop</h1>

              {/* Category Navigation - Desktop */}
              <nav className="hidden lg:flex items-center space-x-6">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setActiveCategory(category.value)}
                    className={`text-sm font-medium transition-colors pb-1 ${
                      activeCategory === category.value
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t('shop.search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-muted border-0"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate('/cart')}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>

              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Filter className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Filter products by category, brand, and price</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Mobile filters content - same as desktop sidebar */}
                    <div>
                      <h3 className="font-semibold mb-3">Category</h3>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <button
                            key={category.value}
                            onClick={() => setActiveCategory(category.value)}
                            className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                              activeCategory === category.value
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                            }`}
                          >
                            {category.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mt-4 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full bg-muted border-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Sort By */}
              <div>
                <h3 className="font-semibold mb-3">Sort By</h3>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name: A to Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Brands Filter */}
              {availableBrands.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Brands</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableBrands.map((brand) => (
                      <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBrands([...selectedBrands, brand]);
                            } else {
                              setSelectedBrands(selectedBrands.filter(b => b !== brand));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear Filters */}
              {(selectedBrands.length > 0 || activeCategory !== 'all') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedBrands([]);
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}
                  className="w-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Showing results in {region.currency}
                </p>
              </div>

              {/* Mobile Sort */}
              <div className="lg:hidden">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name: A to Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="aspect-square bg-muted animate-pulse" />
                    <CardContent className="p-4 space-y-3">
                      <div className="h-4 bg-muted animate-pulse rounded" />
                      <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                      <div className="h-10 bg-muted animate-pulse rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('shop.no_products')}</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search query
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                    setSelectedBrands([]);
                  }}
                >
                  {t('shop.clear_filters')}
                </Button>
              </div>
            )}

            {/* Products Grid */}
            {!loading && filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = productCommercialSolar;
                        }}
                      />
                      {product.is_featured && (
                        <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                          Featured
                        </Badge>
                      )}
                      {product.stock_quantity === 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Badge variant="destructive">Out of Stock</Badge>
                        </div>
                      )}
                      {product.stock_quantity > 0 && product.stock_quantity <= product.low_stock_threshold && (
                        <Badge className="absolute top-4 right-4 bg-orange-500 text-white">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="mb-2">
                        <Badge variant="outline" className="text-xs">
                          {categories.find(c => c.value === product.category)?.label || product.category}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      {product.brand && (
                        <p className="text-xs text-muted-foreground mb-2">{product.brand}</p>
                      )}
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-primary">
                          {formatCurrency(getProductPrice(product))}
                        </span>
                        {product.sku && (
                          <span className="text-xs text-muted-foreground">SKU: {product.sku}</span>
                        )}
                      </div>
                      <Button
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product.id);
                        }}
                        disabled={product.stock_quantity === 0}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {product.stock_quantity === 0 ? t('shop.out_of_stock') : t('shop.add_to_cart')}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;