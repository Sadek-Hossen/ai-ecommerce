import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, ShieldCheck, Truck, RotateCcw, Plus, Minus } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from './AppContext';
import { Product, Variant } from './types';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const found = products.find(p => p.id === id);
    if (found) {
      setProduct(found);
      setSelectedVariant(found.variants[0]);
    }
  }, [id, products]);

  if (!product) return <div className="pt-40 text-center">Loading product...</div>;

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 text-sm font-medium text-brand-500 hover:text-brand-900 flex items-center gap-2"
      >
        ← Back to Collection
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-[3/4] bg-brand-50 rounded-sm overflow-hidden"
          >
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-brand-50 rounded-sm overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                <img src={`${product.image}?sig=${i}`} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-400 mb-2">{product.category}</p>
            <h1 className="text-4xl font-serif mb-4">{product.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-serif">${product.price}</span>
              <div className="flex items-center gap-1 text-brand-900">
                <Star size={16} fill="currentColor" />
                <span className="text-sm font-bold">{product.rating}</span>
                <span className="text-sm text-brand-400">({product.reviews} reviews)</span>
              </div>
            </div>
          </div>

          <p className="text-brand-600 leading-relaxed">
            {product.description}
          </p>

          {/* Variant Selection */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider">Select Size</h4>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((v, i) => (
                <button 
                  key={i}
                  onClick={() => setSelectedVariant(v)}
                  className={`min-w-[60px] h-12 rounded-full border text-sm font-medium transition-all ${
                    selectedVariant === v 
                      ? 'bg-brand-900 text-white border-brand-900' 
                      : 'bg-white text-brand-900 border-brand-200 hover:border-brand-900'
                  }`}
                >
                  {v.size || v.color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex gap-4">
            <div className="flex items-center gap-4 border border-brand-200 rounded-full px-6 py-4">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus size={18} /></button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)}><Plus size={18} /></button>
            </div>
            <button 
              onClick={() => selectedVariant && addToCart(product, selectedVariant)}
              className="flex-1 bg-brand-900 text-white rounded-full font-medium hover:bg-black transition-colors"
            >
              Add to Bag
            </button>
            <button className="p-4 border border-brand-200 rounded-full hover:bg-brand-50 transition-colors">
              <Heart size={20} />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-brand-100">
            <div className="flex flex-col items-center text-center gap-2">
              <ShieldCheck size={24} className="text-brand-400" />
              <span className="text-[10px] uppercase font-bold tracking-widest">Ethical Factory</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <Truck size={24} className="text-brand-400" />
              <span className="text-[10px] uppercase font-bold tracking-widest">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <RotateCcw size={24} className="text-brand-400" />
              <span className="text-[10px] uppercase font-bold tracking-widest">60-Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
