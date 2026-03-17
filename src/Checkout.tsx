import React, { useState } from 'react';
import { useApp } from './AppContext';
import { motion } from 'motion/react';
import { CreditCard, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Checkout = () => {
  const { cart, user, clearCart } = useApp();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(async () => {
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id,
            items: cart,
            total: cartTotal,
            customer: {
              name: user?.name,
              email: user?.email
            }
          })
        });
        if (res.ok) {
          setIsCompleted(true);
          clearCart();
        }
      } catch (error) {
        console.error('Order failed:', error);
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  if (isCompleted) {
    return (
      <div className="pt-40 pb-20 px-4 text-center max-w-lg mx-auto space-y-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto"
        >
          <CheckCircle2 size={40} />
        </motion.div>
        <h1 className="text-4xl font-serif">Thank you for your order!</h1>
        <p className="text-brand-500">
          Your order has been placed successfully. We'll send you an email confirmation with your order details.
        </p>
        <Link to="/account" className="inline-block bg-brand-900 text-white px-8 py-4 rounded-full font-medium hover:bg-black transition-colors">
          View My Orders
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-20 px-4 text-center">
        <h1 className="text-3xl font-serif mb-4">Your bag is empty</h1>
        <Link to="/" className="text-brand-900 font-bold uppercase tracking-widest hover:underline">
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Checkout Form */}
        <div className="space-y-12">
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
            <span className={step >= 1 ? 'text-brand-900' : 'text-brand-300'}>Shipping</span>
            <ChevronRight size={14} className="text-brand-300" />
            <span className={step >= 2 ? 'text-brand-900' : 'text-brand-300'}>Payment</span>
            <ChevronRight size={14} className="text-brand-300" />
            <span className={step >= 3 ? 'text-brand-900' : 'text-brand-300'}>Review</span>
          </div>

          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <h2 className="text-3xl font-serif">Shipping Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-brand-400">Street Address</label>
                  <input type="text" className="w-full px-4 py-3 bg-brand-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900" placeholder="123 Luxury Ave" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-brand-400">City</label>
                  <input type="text" className="w-full px-4 py-3 bg-brand-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900" placeholder="Luxe City" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-brand-400">ZIP Code</label>
                  <input type="text" className="w-full px-4 py-3 bg-brand-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900" placeholder="90210" />
                </div>
              </div>
              <button onClick={() => setStep(2)} className="w-full bg-brand-900 text-white py-4 rounded-full font-medium hover:bg-black transition-colors">
                Continue to Payment
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <h2 className="text-3xl font-serif">Payment Method</h2>
              <div className="space-y-4">
                <div className="p-6 border-2 border-brand-900 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CreditCard className="text-brand-900" />
                    <div>
                      <p className="font-medium">Credit or Debit Card</p>
                      <p className="text-xs text-brand-400">Safe and secure payment</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full border-4 border-brand-900" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-brand-400">Card Number</label>
                  <input type="text" className="w-full px-4 py-3 bg-brand-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900" placeholder="•••• •••• •••• ••••" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-brand-400">Expiry Date</label>
                    <input type="text" className="w-full px-4 py-3 bg-brand-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-brand-400">CVV</label>
                    <input type="text" className="w-full px-4 py-3 bg-brand-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900" placeholder="•••" />
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 border border-brand-200 py-4 rounded-full font-medium hover:bg-brand-50 transition-colors">Back</button>
                <button onClick={() => setStep(3)} className="flex-[2] bg-brand-900 text-white py-4 rounded-full font-medium hover:bg-black transition-colors">Review Order</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <h2 className="text-3xl font-serif">Review Order</h2>
              <div className="p-6 bg-brand-50 rounded-2xl space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-widest text-brand-400 mb-2">Shipping To</h4>
                    <p className="text-sm">123 Luxury Ave, Luxe City, 90210</p>
                  </div>
                  <button onClick={() => setStep(1)} className="text-xs font-bold uppercase tracking-widest text-brand-900 hover:underline">Edit</button>
                </div>
                <div className="pt-4 border-t border-brand-100 flex justify-between items-start">
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-widest text-brand-400 mb-2">Payment</h4>
                    <p className="text-sm">Visa ending in 4242</p>
                  </div>
                  <button onClick={() => setStep(2)} className="text-xs font-bold uppercase tracking-widest text-brand-900 hover:underline">Edit</button>
                </div>
              </div>
              <button 
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full bg-brand-900 text-white py-4 rounded-full font-medium hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Place Order • $${cartTotal}`
                )}
              </button>
            </motion.div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-32 h-fit space-y-8">
          <div className="bg-white p-8 rounded-2xl luxury-shadow border border-brand-100">
            <h3 className="text-xl font-serif mb-8">Order Summary</h3>
            <div className="space-y-6 mb-8">
              {cart.map((item) => (
                <div key={`${item.id}-${JSON.stringify(item.selectedVariant)}`} className="flex gap-4">
                  <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-sm" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.name}</h4>
                    <p className="text-xs text-brand-400 mb-1">
                      {item.selectedVariant.size || item.selectedVariant.color} × {item.quantity}
                    </p>
                    <p className="text-sm font-serif">${item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4 pt-6 border-t border-brand-100">
              <div className="flex justify-between text-sm">
                <span className="text-brand-500">Subtotal</span>
                <span>${cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-500">Shipping</span>
                <span className="text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between text-lg font-serif pt-4 border-t border-brand-100">
                <span>Total</span>
                <span>${cartTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
