import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from './AppContext';
import { Product } from './types';

export const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useApp();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-50 rounded-sm mb-4">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity luxury-shadow">
          <Heart size={18} />
        </button>
        
        <div className={`absolute inset-x-0 bottom-0 p-4 transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl luxury-shadow space-y-3">
            <div className="flex gap-2 justify-center">
              {product.variants.map((v, i) => (
                <button 
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariant(v);
                  }}
                  className={`w-8 h-8 rounded-full border text-[10px] font-bold transition-all ${
                    selectedVariant === v 
                      ? 'bg-brand-900 text-white border-brand-900 scale-110' 
                      : 'bg-white text-brand-500 border-brand-200 hover:border-brand-400'
                  }`}
                >
                  {v.size || v.color?.charAt(0)}
                </button>
              ))}
            </div>
            <button 
              onClick={() => addToCart(product, selectedVariant)}
              className="w-full bg-brand-900 text-white py-3 rounded-full text-sm font-medium hover:bg-black transition-colors flex items-center justify-center gap-2"
            >
              Add to Bag <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-brand-900 group-hover:text-brand-500 transition-colors">{product.name}</h3>
          <span className="font-serif">${product.price}</span>
        </div>
        <p className="text-xs text-brand-400 uppercase tracking-widest">{product.category}</p>
        <div className="flex items-center gap-1 text-brand-400">
          <Star size={12} fill="currentColor" className="text-brand-900" />
          <span className="text-xs font-medium text-brand-900">{product.rating}</span>
          <span className="text-xs">({product.reviews})</span>
        </div>
      </div>
    </motion.div>
  );
};

export const Storefront = () => {
  const { products, categories } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative h-[70vh] rounded-2xl overflow-hidden mb-20">
        <img 
          src="https://picsum.photos/seed/hero/1920/1080" 
          alt="Hero" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white text-center p-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm uppercase tracking-[0.3em] mb-4"
          >
            Spring Collection 2026
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif mb-8 max-w-2xl"
          >
            Modern Essentials for a Better World
          </motion.h2>
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white text-brand-900 px-10 py-4 rounded-full font-medium hover:bg-brand-100 transition-colors"
          >
            Shop Now
          </motion.button>
        </div>
      </section>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
        <button 
          onClick={() => setSelectedCategory('All')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === 'All' ? 'bg-brand-900 text-white' : 'bg-brand-50 text-brand-500 hover:bg-brand-100'}`}
        >
          All
        </button>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-brand-900 text-white' : 'bg-brand-50 text-brand-500 hover:bg-brand-100'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
