import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useApp } from './AppContext';
import { ShoppingBag, Settings, LogOut, Package, MapPin, CreditCard, ChevronRight, User as UserIcon } from 'lucide-react';

export const UserDashboard = () => {
  const { user, logout, setUser } = useApp();
  const [activeTab, setActiveTab] = useState('Order History');
  const [addresses, setAddresses] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState('');

  const [newAddress, setNewAddress] = useState({
    type: 'Shipping',
    street: '',
    city: '',
    state: '',
    zip: '',
    isDefault: false
  });

  const [newPayment, setNewPayment] = useState({
    type: 'Visa',
    last4: '',
    expiry: '',
    isDefault: false
  });

  const [accountSettings, setAccountSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      fetch(`/api/user/addresses/${user.id}`)
        .then(res => res.json())
        .then(setAddresses);
      
      fetch(`/api/user/payments/${user.id}`)
        .then(res => res.json())
        .then(setPayments);

      fetch(`/api/orders/${user.id}`)
        .then(res => res.json())
        .then(setOrders);
    }
  }, [user]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const res = await fetch(`/api/user/addresses/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddress)
      });
      if (res.ok) {
        const added = await res.json();
        setAddresses([...addresses, added]);
        setIsAddingAddress(false);
        setNewAddress({ type: 'Shipping', street: '', city: '', state: '', zip: '', isDefault: false });
      }
    } catch (error) {
      console.error('Failed to add address:', error);
    }
  };

  const handleRemoveAddress = async (id: string) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/user/addresses/${user.id}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAddresses(addresses.filter(a => a.id !== id));
      }
    } catch (error) {
      console.error('Failed to remove address:', error);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const res = await fetch(`/api/user/payments/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPayment)
      });
      if (res.ok) {
        const added = await res.json();
        setPayments([...payments, added]);
        setIsAddingPayment(false);
        setNewPayment({ type: 'Visa', last4: '', expiry: '', isDefault: false });
      }
    } catch (error) {
      console.error('Failed to add payment:', error);
    }
  };

  const handleRemovePayment = async (id: string) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/user/payments/${user.id}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPayments(payments.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to remove payment:', error);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (accountSettings.newPassword && accountSettings.newPassword !== accountSettings.confirmPassword) {
      setSettingsMessage('Passwords do not match');
      return;
    }
    try {
      const res = await fetch(`/api/user/settings/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: accountSettings.name,
          email: accountSettings.email,
          password: accountSettings.newPassword || undefined
        })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setSettingsMessage('Settings updated successfully');
        setTimeout(() => setSettingsMessage(''), 3000);
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      setSettingsMessage('Failed to update settings');
    }
  };

  if (!user) return <div className="pt-40 text-center">Please log in to view your account.</div>;

  const tabs = [
    { name: 'Order History', icon: Package },
    { name: 'Addresses', icon: MapPin },
    { name: 'Payment Methods', icon: CreditCard },
    { name: 'Account Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Order History':
        return (
          <section className="space-y-8">
            <h2 className="text-3xl font-serif">Order History</h2>
            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl luxury-shadow border border-brand-100 overflow-hidden">
                    <div className="p-6 border-b border-brand-50 flex justify-between items-center bg-brand-50/30">
                      <div className="flex gap-8">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-400">Order ID</p>
                          <p className="text-sm font-medium">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-400">Date</p>
                          <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-400">Total</p>
                          <p className="text-sm font-medium">${order.total}</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full">
                        {order.status}
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-4 items-center">
                          <img src={item.image} alt={item.name} className="w-12 h-16 object-cover rounded" />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">{item.name}</h4>
                            <p className="text-xs text-brand-400">
                              {item.selectedVariant.size || item.selectedVariant.color} × {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-serif">${item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl luxury-shadow border border-brand-100 overflow-hidden">
                <div className="p-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto text-brand-300">
                    <ShoppingBag size={32} />
                  </div>
                  <h3 className="text-xl font-serif">No orders yet</h3>
                  <p className="text-brand-500 text-sm max-w-xs mx-auto">
                    When you place an order, it will appear here. Start shopping our latest arrivals.
                  </p>
                  <Link to="/" className="inline-block bg-brand-900 text-white px-8 py-3 rounded-full font-medium hover:bg-black transition-colors">
                    Browse Collection
                  </Link>
                </div>
              </div>
            )}
          </section>
        );
      case 'Addresses':
        return (
          <section className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-serif">Addresses</h2>
              <button 
                onClick={() => setIsAddingAddress(true)}
                className="text-sm font-bold uppercase tracking-widest text-brand-900 hover:underline"
              >
                + Add New
              </button>
            </div>
            
            {isAddingAddress && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-brand-50 rounded-2xl border border-brand-100"
              >
                <form onSubmit={handleAddAddress} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold tracking-widest text-brand-400">Street</label>
                      <input 
                        type="text" 
                        required
                        value={newAddress.street}
                        onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                        className="w-full px-4 py-3 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold tracking-widest text-brand-400">City</label>
                      <input 
                        type="text" 
                        required
                        value={newAddress.city}
                        onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                        className="w-full px-4 py-3 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold tracking-widest text-brand-400">State</label>
                      <input 
                        type="text" 
                        required
                        value={newAddress.state}
                        onChange={e => setNewAddress({...newAddress, state: e.target.value})}
                        className="w-full px-4 py-3 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold tracking-widest text-brand-400">ZIP Code</label>
                      <input 
                        type="text" 
                        required
                        value={newAddress.zip}
                        onChange={e => setNewAddress({...newAddress, zip: e.target.value})}
                        className="w-full px-4 py-3 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button type="submit" className="bg-brand-900 text-white px-8 py-3 rounded-full font-medium hover:bg-black transition-colors">Save Address</button>
                    <button type="button" onClick={() => setIsAddingAddress(false)} className="text-brand-500 px-8 py-3 rounded-full font-medium hover:bg-brand-100 transition-colors">Cancel</button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {addresses.map((address) => (
                <div key={address.id} className="p-8 bg-white rounded-2xl border border-brand-100 luxury-shadow relative group">
                  {address.isDefault && <div className="absolute top-6 right-6 px-2 py-1 bg-brand-900 text-white text-[10px] font-bold uppercase tracking-widest rounded">Default</div>}
                  <h4 className="font-serif text-xl mb-4">{address.type} Address</h4>
                  <p className="text-sm text-brand-500 leading-relaxed">
                    {user.name}<br />
                    {address.street}<br />
                    {address.city}, {address.state} {address.zip}
                  </p>
                  <div className="mt-8 flex gap-4">
                    <button className="text-xs font-bold uppercase tracking-widest text-brand-900 hover:underline">Edit</button>
                    <button onClick={() => handleRemoveAddress(address.id)} className="text-xs font-bold uppercase tracking-widest text-red-600 hover:underline">Remove</button>
                  </div>
                </div>
              ))}
              {addresses.length === 0 && !isAddingAddress && (
                <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-brand-100 luxury-shadow text-brand-400">
                  No addresses saved yet.
                </div>
              )}
            </div>
          </section>
        );
      case 'Payment Methods':
        return (
          <section className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-serif">Payment Methods</h2>
              <button 
                onClick={() => setIsAddingPayment(true)}
                className="text-sm font-bold uppercase tracking-widest text-brand-900 hover:underline"
              >
                + Add New
              </button>
            </div>

            {isAddingPayment && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-brand-50 rounded-2xl border border-brand-100"
              >
                <form onSubmit={handleAddPayment} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold tracking-widest text-brand-400">Card Number (Last 4)</label>
                      <input 
                        type="text" 
                        required
                        maxLength={4}
                        value={newPayment.last4}
                        onChange={e => setNewPayment({...newPayment, last4: e.target.value})}
                        className="w-full px-4 py-3 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900"
                        placeholder="4242"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold tracking-widest text-brand-400">Expiry Date</label>
                      <input 
                        type="text" 
                        required
                        placeholder="MM/YY"
                        value={newPayment.expiry}
                        onChange={e => setNewPayment({...newPayment, expiry: e.target.value})}
                        className="w-full px-4 py-3 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button type="submit" className="bg-brand-900 text-white px-8 py-3 rounded-full font-medium hover:bg-black transition-colors">Save Payment</button>
                    <button type="button" onClick={() => setIsAddingPayment(false)} className="text-brand-500 px-8 py-3 rounded-full font-medium hover:bg-brand-100 transition-colors">Cancel</button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {payments.map((payment) => (
                <div key={payment.id} className="p-8 bg-white rounded-2xl border border-brand-100 luxury-shadow">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-brand-900 rounded flex items-center justify-center text-white font-bold italic text-xs uppercase">{payment.type}</div>
                      <div>
                        <p className="font-medium text-sm">{payment.type} ending in {payment.last4}</p>
                        <p className="text-xs text-brand-400">Expires {payment.expiry}</p>
                      </div>
                    </div>
                    {payment.isDefault && <div className="px-2 py-1 bg-brand-50 text-brand-400 text-[10px] font-bold uppercase tracking-widest rounded">Default</div>}
                  </div>
                  <div className="flex gap-4">
                    <button className="text-xs font-bold uppercase tracking-widest text-brand-900 hover:underline">Edit</button>
                    <button onClick={() => handleRemovePayment(payment.id)} className="text-xs font-bold uppercase tracking-widest text-red-600 hover:underline">Remove</button>
                  </div>
                </div>
              ))}
              {payments.length === 0 && !isAddingPayment && (
                <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-brand-100 luxury-shadow text-brand-400">
                  No payment methods saved yet.
                </div>
              )}
            </div>
          </section>
        );
      case 'Account Settings':
        return (
          <section className="space-y-8">
            <h2 className="text-3xl font-serif">Account Settings</h2>
            <div className="bg-white rounded-2xl luxury-shadow border border-brand-100 p-8 space-y-8">
              {settingsMessage && (
                <div className={`p-4 rounded-xl text-sm ${settingsMessage.includes('successfully') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  {settingsMessage}
                </div>
              )}
              <form onSubmit={handleUpdateSettings} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-brand-400">Full Name</label>
                    <input 
                      type="text" 
                      value={accountSettings.name}
                      onChange={e => setAccountSettings({...accountSettings, name: e.target.value})}
                      className="w-full px-4 py-3 bg-brand-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-brand-400">Email Address</label>
                    <input 
                      type="email" 
                      value={accountSettings.email}
                      onChange={e => setAccountSettings({...accountSettings, email: e.target.value})}
                      className="w-full px-4 py-3 bg-brand-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900" 
                    />
                  </div>
                </div>
                
                <div className="pt-8 border-t border-brand-100">
                  <h3 className="font-serif text-xl mb-6">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold tracking-widest text-brand-400">Current Password</label>
                      <input 
                        type="password" 
                        value={accountSettings.currentPassword}
                        onChange={e => setAccountSettings({...accountSettings, currentPassword: e.target.value})}
                        className="w-full px-4 py-3 bg-brand-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold tracking-widest text-brand-400">New Password</label>
                      <input 
                        type="password" 
                        value={accountSettings.newPassword}
                        onChange={e => setAccountSettings({...accountSettings, newPassword: e.target.value})}
                        className="w-full px-4 py-3 bg-brand-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold tracking-widest text-brand-400">Confirm New Password</label>
                      <input 
                        type="password" 
                        value={accountSettings.confirmPassword}
                        onChange={e => setAccountSettings({...accountSettings, confirmPassword: e.target.value})}
                        className="w-full px-4 py-3 bg-brand-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900" 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" className="bg-brand-900 text-white px-8 py-3 rounded-full font-medium hover:bg-black transition-colors">
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 p-6 bg-white rounded-2xl luxury-shadow border border-brand-100">
            <div className="w-14 h-14 bg-brand-900 text-white rounded-full flex items-center justify-center font-serif text-2xl">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-serif text-lg">{user.name}</h3>
              <p className="text-xs text-brand-400">{user.email}</p>
            </div>
          </div>

          <nav className="space-y-2">
            {tabs.map((item) => (
              <button 
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.name 
                    ? 'bg-brand-900 text-white shadow-lg shadow-brand-900/20' 
                    : 'text-brand-500 hover:bg-white hover:luxury-shadow'
                }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={18} />
                  {item.name}
                </div>
                <ChevronRight size={14} className={activeTab === item.name ? 'opacity-100' : 'opacity-0'} />
              </button>
            ))}
            <div className="pt-4 mt-4 border-t border-brand-100">
              <button 
                onClick={logout}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
