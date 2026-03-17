/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './AppContext';
import { Navbar } from './Navbar';
import { Storefront } from './Storefront';
import { AdminDashboard } from './AdminDashboard';
import { ProductDetail } from './ProductDetail';
import { CategoryPage } from './CategoryPage';
import { Auth } from './Auth';
import { UserDashboard } from './UserDashboard';
import { Checkout } from './Checkout';
import { AIChatBot } from './components/AIChatBot';

const AppContent = () => {
  const { user } = useApp();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Storefront />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/women" element={<CategoryPage title="Women's Collection" category="Dresses" />} />
          <Route path="/men" element={<CategoryPage title="Men's Collection" category="Knitwear" />} />
          <Route path="/new-arrivals" element={<CategoryPage title="New Arrivals" />} />
          <Route path="/sustainability" element={<CategoryPage title="Our Sustainability Efforts" />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={user ? <Navigate to="/" /> : <Auth mode="login" />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Auth mode="register" />} />
          
          {/* Protected Routes */}
          <Route path="/account" element={user ? <UserDashboard /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" />} />
        </Routes>
      </main>
      
      <AIChatBot />
      
      {/* Footer */}
      <footer className="bg-brand-950 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-serif tracking-tight">EVERLANE</h2>
            <p className="text-brand-400 text-sm leading-relaxed">
              We believe we can all make a difference. Our mission is to provide modern essentials while being transparent about our impact.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-6 uppercase text-xs tracking-widest">Shop</h4>
            <ul className="space-y-4 text-sm text-brand-400">
              <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sale</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-6 uppercase text-xs tracking-widest">About</h4>
            <ul className="space-y-4 text-sm text-brand-400">
              <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Factories</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-6 uppercase text-xs tracking-widest">Support</h4>
            <ul className="space-y-4 text-sm text-brand-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-brand-500 uppercase tracking-widest">
          <p>© 2026 Everlane Luxe. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}

