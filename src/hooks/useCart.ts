import { useState, useEffect } from 'react';
import { CartItem, Cart } from '@/types/cart';
import { Product, RatePlan, Feature, PricingOption } from '@/types/product';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (
    product: Product,
    pricingOption: PricingOption,
    ratePlan?: RatePlan,
    features: Feature[] = [],
    quantity: number = 1
  ) => {
    const newItem: CartItem = {
      id: `${product.id}-${pricingOption.id}-${ratePlan?.id || 'no-plan'}-${Date.now()}`,
      product,
      selected_rate_plan: ratePlan,
      selected_features: features,
      selected_pricing_option: pricingOption,
      quantity,
    };

    setCartItems(prev => [...prev, newItem]);
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate cart totals
  const calculateCart = (): Cart => {
    let subtotal = 0;
    let totalMonthlyCharges = 0;
    let totalDueNow = 0;

    cartItems.forEach(item => {
      const pricingOption = item.selected_pricing_option;
      const itemSubtotal = pricingOption.down_payment * item.quantity;
      const itemMonthly = (pricingOption.monthly_payment || 0) * item.quantity;
      
      // Add rate plan monthly cost
      if (item.selected_rate_plan) {
        totalMonthlyCharges += item.selected_rate_plan.monthly_cost * item.quantity;
      }

      // Add feature monthly costs
      item.selected_features.forEach(feature => {
        totalMonthlyCharges += feature.monthly_cost * item.quantity;
      });

      subtotal += itemSubtotal;
      totalMonthlyCharges += itemMonthly;
      totalDueNow += itemSubtotal;
    });

    const taxes = subtotal * 0.08; // 8% tax rate
    const fees = 2.99; // Processing fee
    totalDueNow += taxes + fees;

    return {
      items: cartItems,
      subtotal,
      total_monthly_charges: totalMonthlyCharges,
      total_due_now: totalDueNow,
      taxes,
      fees,
    };
  };

  const cart = calculateCart();

  return {
    cartItems,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
  };
}