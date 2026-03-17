import React from 'react';
import { useApp } from './AppContext';
import { ProductCard } from './Storefront';

export const CategoryPage = ({ title, category }: { title: string, category?: string }) => {
  const { products } = useApp();
  
  const filteredProducts = category 
    ? products.filter(p => p.category === category)
    : products;

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-serif mb-4">{title}</h1>
        <p className="text-brand-500 max-w-xl mx-auto">
          Explore our curated selection of {title.toLowerCase()}, designed for longevity and crafted with the finest materials.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
