import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X, ChevronRight, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from './AppContext';

export const Navbar = () => {
  const { cart, user, logout, products } = useApp();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredProducts = searchQuery.trim() 
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-brand-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-brand-100 rounded-full transition-colors">
              <Menu size={20} />
            </button>
            <Link to="/" className="text-2xl font-serif tracking-tight">
              EVERLANE
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide uppercase">
            <Link to="/new-arrivals" className="hover:text-brand-500 transition-colors">New Arrivals</Link>
            <Link to="/women" className="hover:text-brand-500 transition-colors">Women</Link>
            <Link to="/men" className="hover:text-brand-500 transition-colors">Men</Link>
            <Link to="/sustainability" className="hover:text-brand-500 transition-colors">Sustainability</Link>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-brand-100 rounded-full transition-colors"
            >
              <Search size={20} />
            </button>
            <Link 
              to={user ? (user.role === 'admin' ? '/admin' : '/account') : '/login'} 
              className={`p-2 rounded-full transition-colors ${user ? 'bg-brand-900 text-white' : 'hover:bg-brand-100'}`}
            >
              <User size={20} />
            </Link>
            {user && (
              <button 
                onClick={logout}
                className="hidden md:block p-2 hover:bg-red-50 text-red-600 rounded-full transition-colors"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            )}
            {user && user.role !== 'admin' && (
              <button 
                onClick={() => setIsCartOpen(true)}
                className="p-2 hover:bg-brand-100 rounded-full transition-colors relative"
              >
                <ShoppingBag size={20} />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 bg-brand-900 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {cart.length}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Side Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-full max-w-sm bg-white z-[70] p-8"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-xl font-serif">Menu</h2>
                <button onClick={() => setIsMenuOpen(false)}><X size={24} /></button>
              </div>
              <div className="space-y-6">
                {[
                  { name: 'New Arrivals', path: '/new-arrivals' },
                  { name: 'Women', path: '/women' },
                  { name: 'Men', path: '/men' },
                  { name: 'Sustainability', path: '/sustainability' },
                ].map((item) => (
                  <Link 
                    key={item.name} 
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex justify-between items-center group cursor-pointer"
                  >
                    <span className="text-lg font-medium group-hover:translate-x-2 transition-transform">{item.name}</span>
                    <ChevronRight size={18} className="text-brand-300" />
                  </Link>
                ))}
                {user && (
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex justify-between items-center group cursor-pointer text-red-600 pt-6 border-t border-brand-100"
                  >
                    <span className="text-lg font-medium">Sign Out</span>
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-[80]"
            />
            <motion.div 
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              className="fixed top-0 left-0 right-0 bg-white z-[90] p-8 luxury-shadow"
            >
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                  <Search className="text-brand-400" size={24} />
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Search for products, categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 text-2xl font-serif bg-transparent border-none focus:outline-none"
                  />
                  <button onClick={() => setIsSearchOpen(false)} className="p-2 hover:bg-brand-50 rounded-full">
                    <X size={24} />
                  </button>
                </div>

                {searchQuery.trim() && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[60vh] overflow-y-auto pr-4">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(product => (
                        <Link 
                          key={product.id}
                          to={`/product/${product.id}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex gap-4 group"
                        >
                          <img src={product.image} alt={product.name} className="w-20 h-24 object-cover rounded-sm" />
                          <div>
                            <h4 className="font-medium group-hover:text-brand-500 transition-colors">{product.name}</h4>
                            <p className="text-sm text-brand-500">{product.category}</p>
                            <p className="font-serif mt-1">${product.price}</p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="col-span-2 py-12 text-center text-brand-500">
                        No products found for "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] flex flex-col"
            >
              <div className="p-8 border-b border-brand-100 flex justify-between items-center">
                <h2 className="text-xl font-serif">Your Bag ({cart.length})</h2>
                <button onClick={() => setIsCartOpen(false)}><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {cart.length > 0 && (
                  <div className="mb-8 p-4 bg-brand-50 rounded-xl">
                    <div className="flex justify-between text-xs uppercase tracking-wider mb-2">
                      <span className="font-medium">
                        {cartTotal >= 200 ? 'You got free shipping!' : `Spend $${200 - cartTotal} more for free shipping`}
                      </span>
                      <span>{Math.min(100, (cartTotal / 200) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1 bg-brand-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (cartTotal / 200) * 100)}%` }}
                        className="h-full bg-brand-900"
                      />
                    </div>
                  </div>
                )}
                {cart.length === 0 ? (
                  <div className="text-center py-20 text-brand-500">
                    <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Your bag is empty</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={`${item.id}-${JSON.stringify(item.selectedVariant)}`} className="flex gap-4">
                      <img src={item.image} alt={item.name} className="w-24 h-32 object-cover rounded-sm" />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-brand-500 mb-2">
                          {item.selectedVariant.size || item.selectedVariant.color}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="font-serif">${item.price}</span>
                          <div className="flex items-center gap-3 border border-brand-200 rounded-full px-3 py-1">
                            <button className="text-lg">-</button>
                            <span className="text-sm">{item.quantity}</span>
                            <button className="text-lg">+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 border-t border-brand-100 space-y-4 bg-brand-50">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-brand-500">Shipping</span>
                    <span className="text-emerald-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-serif">
                    <span>Total</span>
                    <span>${cartTotal}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/checkout');
                    }}
                    className="w-full bg-brand-900 text-white py-4 rounded-full font-medium hover:bg-black transition-colors"
                  >
                    Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
