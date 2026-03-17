import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  Package, ShoppingCart, DollarSign, Users, 
  TrendingUp, AlertCircle, Plus, Search, Filter, LogOut, Settings, ChevronRight, Edit, Trash2, X,
  FileText, Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminStats } from './types';
import { useApp } from './AppContext';
import { FileUpload } from './components/FileUpload';

const data = [
  { name: 'Mon', sales: 4000, orders: 24 },
  { name: 'Tue', sales: 3000, orders: 18 },
  { name: 'Wed', sales: 2000, orders: 12 },
  { name: 'Thu', sales: 2780, orders: 20 },
  { name: 'Fri', sales: 1890, orders: 15 },
  { name: 'Sat', sales: 2390, orders: 22 },
  { name: 'Sun', sales: 3490, orders: 30 },
];

export const AdminDashboard = () => {
  const { logout, user, setUser, refreshProducts } = useApp();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [settingsMessage, setSettingsMessage] = useState('');
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Dresses',
    description: '',
    image: '',
    variants: [{ size: 'S', stock: 10 }]
  });

  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    image: '',
    video: '',
    tags: ''
  });

  const [siteSettings, setSiteSettings] = useState({
    logo: ''
  });

  const [adminSettings, setAdminSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
    newPassword: '',
    confirmPassword: ''
  });

  const fetchStats = () => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(setStats);
  };

  const fetchProducts = () => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts);
  };

  const fetchCustomers = () => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(setCustomers);
  };

  const fetchBlogs = () => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(setBlogs);
  };

  const fetchSiteSettings = () => {
    fetch('/api/settings/site_logo')
      .then(res => res.json())
      .then(data => {
        if (data) setSiteSettings({ logo: data.value });
      });
  };

  useEffect(() => {
    fetchStats();
    fetchProducts();
    fetchCustomers();
    fetchBlogs();
    fetchSiteSettings();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setEditingProduct(null);
        setNewProduct({
          name: '',
          price: '',
          category: 'Dresses',
          description: '',
          image: '',
          variants: [{ size: 'S', stock: 10 }]
        });
        fetchStats();
        fetchProducts();
        refreshProducts();
      }
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchStats();
          fetchProducts();
          refreshProducts();
        }
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      image: product.image,
      variants: product.variants
    });
    setIsModalOpen(true);
  };

  const handleUpdateAdminSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (adminSettings.newPassword && adminSettings.newPassword !== adminSettings.confirmPassword) {
      setSettingsMessage('Passwords do not match');
      return;
    }
    try {
      const res = await fetch(`/api/user/settings/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: adminSettings.name,
          email: adminSettings.email,
          password: adminSettings.newPassword || undefined
        })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setSettingsMessage('Admin settings updated successfully');
        setTimeout(() => setSettingsMessage(''), 3000);
      }
    } catch (error) {
      console.error('Failed to update admin settings:', error);
      setSettingsMessage('Failed to update settings');
    }
  };

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingBlog ? `/api/blogs/${editingBlog._id}` : '/api/blogs';
      const method = editingBlog ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...newBlog,
          tags: newBlog.tags.split(',').map(t => t.trim())
        })
      });
      if (res.ok) {
        setIsBlogModalOpen(false);
        setEditingBlog(null);
        setNewBlog({ title: '', content: '', image: '', video: '', tags: '' });
        fetchBlogs();
      }
    } catch (error) {
      console.error('Failed to save blog:', error);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        const res = await fetch(`/api/blogs/${id}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) fetchBlogs();
      } catch (error) {
        console.error('Failed to delete blog:', error);
      }
    }
  };

  const handleUpdateLogo = async (url: string) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ key: 'site_logo', value: url })
      });
      if (res.ok) {
        setSiteSettings({ logo: url });
        setSettingsMessage('Logo updated successfully');
        setTimeout(() => setSettingsMessage(''), 3000);
      }
    } catch (error) {
      console.error('Failed to update logo:', error);
    }
  };

  if (!stats) return <div className="p-20 text-center">Loading Dashboard...</div>;

  const tabs = [
    { name: 'Dashboard', icon: TrendingUp },
    { name: 'Products', icon: Package },
    { name: 'Orders', icon: ShoppingCart },
    { name: 'Blogs', icon: FileText },
    { name: 'Customers', icon: Users },
    { name: 'Settings', icon: Settings },
    { name: 'Site Config', icon: ImageIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="space-y-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600' },
                { label: 'Total Orders', value: stats.orderCount, icon: ShoppingCart, color: 'text-blue-600' },
                { label: 'Active Products', value: stats.productCount, icon: Package, color: 'text-amber-600' },
                { label: 'Total Customers', value: customers.length, icon: Users, color: 'text-indigo-600' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl luxury-shadow border border-brand-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl bg-brand-50 ${stat.color}`}>
                      <stat.icon size={24} />
                    </div>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
                  </div>
                  <p className="text-sm text-brand-500 mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-serif">{stat.value}</h3>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-2xl luxury-shadow border border-brand-100">
                <h3 className="text-lg font-serif mb-6">Sales Trends</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#171717" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#171717" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#737373'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#737373'}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                      />
                      <Area type="monotone" dataKey="sales" stroke="#171717" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl luxury-shadow border border-brand-100">
                <h3 className="text-lg font-serif mb-6">Order Volume</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#737373'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#737373'}} />
                      <Tooltip 
                        cursor={{fill: '#f8f8f8'}}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="orders" fill="#171717" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Products':
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-serif">Products</h2>
              <button 
                onClick={() => {
                  setEditingProduct(null);
                  setNewProduct({
                    name: '',
                    price: '',
                    category: 'Dresses',
                    description: '',
                    image: '',
                    variants: [{ size: 'S', stock: 10 }]
                  });
                  setIsModalOpen(true);
                }}
                className="bg-brand-900 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-black transition-colors"
              >
                <Plus size={18} /> Add Product
              </button>
            </div>
            <div className="bg-white rounded-2xl luxury-shadow border border-brand-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-brand-50 text-brand-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-8 py-4 font-medium">Product</th>
                      <th className="px-8 py-4 font-medium">Category</th>
                      <th className="px-8 py-4 font-medium">Price</th>
                      <th className="px-8 py-4 font-medium">Stock</th>
                      <th className="px-8 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-100">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-brand-50 transition-colors">
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-4">
                            <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4 text-brand-500">{product.category}</td>
                        <td className="px-8 py-4 font-serif">${product.price}</td>
                        <td className="px-8 py-4">
                          {product.variants.reduce((sum: number, v: any) => sum + v.stock, 0)}
                        </td>
                        <td className="px-8 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => openEditModal(product)}
                              className="p-2 text-brand-400 hover:text-brand-900 transition-colors"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 text-brand-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'Orders':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-serif">Orders</h2>
            <div className="bg-white rounded-2xl luxury-shadow border border-brand-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-brand-50 text-brand-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-8 py-4 font-medium">Order ID</th>
                      <th className="px-8 py-4 font-medium">Customer</th>
                      <th className="px-8 py-4 font-medium">Status</th>
                      <th className="px-8 py-4 font-medium">Total</th>
                      <th className="px-8 py-4 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-100">
                    {stats.recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-8 py-12 text-center text-brand-400">No orders found</td>
                      </tr>
                    ) : (
                      stats.recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-brand-50 transition-colors cursor-pointer">
                          <td className="px-8 py-4 font-medium">{order.id}</td>
                          <td className="px-8 py-4">{order.customer.name}</td>
                          <td className="px-8 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                              order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                              'bg-emerald-100 text-emerald-700'
                            }`}>
                               {order.status}
                            </span>
                          </td>
                          <td className="px-8 py-4 font-serif">${order.total}</td>
                          <td className="px-8 py-4 text-brand-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'Blogs':
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-serif">Blogs</h2>
              <button 
                onClick={() => {
                  setEditingBlog(null);
                  setNewBlog({ title: '', content: '', image: '', video: '', tags: '' });
                  setIsBlogModalOpen(true);
                }}
                className="bg-brand-900 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-black transition-colors"
              >
                <Plus size={18} /> New Post
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.map(blog => (
                <div key={blog._id} className="bg-white p-6 rounded-2xl luxury-shadow border border-brand-100 flex gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-brand-50 flex-shrink-0">
                    {blog.video ? (
                      <video src={blog.video} className="w-full h-full object-cover" />
                    ) : (
                      <img src={blog.image || 'https://picsum.photos/seed/blog/200'} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-lg truncate">{blog.title}</h4>
                    <p className="text-xs text-brand-400 mb-4">{new Date(blog.createdAt).toLocaleDateString()}</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setEditingBlog(blog);
                          setNewBlog({
                            title: blog.title,
                            content: blog.content,
                            image: blog.image || '',
                            video: blog.video || '',
                            tags: blog.tags.join(', ')
                          });
                          setIsBlogModalOpen(true);
                        }}
                        className="p-2 text-brand-400 hover:text-brand-900 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteBlog(blog._id)}
                        className="p-2 text-brand-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Customers':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-serif">Customers</h2>
            <div className="bg-white rounded-2xl luxury-shadow border border-brand-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-brand-50 text-brand-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-8 py-4 font-medium">Name</th>
                      <th className="px-8 py-4 font-medium">Email</th>
                      <th className="px-8 py-4 font-medium">Role</th>
                      <th className="px-8 py-4 font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-100">
                    {customers.map((cust) => (
                      <tr key={cust.id} className="hover:bg-brand-50 transition-colors">
                        <td className="px-8 py-4 font-medium">{cust.name}</td>
                        <td className="px-8 py-4 text-brand-500">{cust.email}</td>
                        <td className="px-8 py-4">
                          <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                            cust.role === 'admin' ? 'bg-brand-900 text-white' : 'bg-brand-100 text-brand-900'
                          }`}>
                            {cust.role}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-brand-400 text-sm">Mar 2026</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'Settings':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-serif">Admin Settings</h2>
            <div className="bg-white rounded-2xl luxury-shadow border border-brand-100 p-8 space-y-8">
              {settingsMessage && (
                <div className={`p-4 rounded-xl text-sm ${settingsMessage.includes('successfully') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  {settingsMessage}
                </div>
              )}
              <form onSubmit={handleUpdateAdminSettings} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-brand-400">Admin Name</label>
                    <input 
                      type="text" 
                      value={adminSettings.name}
                      onChange={e => setAdminSettings({...adminSettings, name: e.target.value})}
                      className="w-full px-4 py-3 bg-brand-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-brand-400">Admin Email</label>
                    <input 
                      type="email" 
                      value={adminSettings.email}
                      onChange={e => setAdminSettings({...adminSettings, email: e.target.value})}
                      className="w-full px-4 py-3 bg-brand-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900" 
                    />
                  </div>
                </div>
                
                <div className="pt-8 border-t border-brand-100">
                  <h3 className="font-serif text-xl mb-6">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold tracking-widest text-brand-400">New Password</label>
                      <input 
                        type="password" 
                        value={adminSettings.newPassword}
                        onChange={e => setAdminSettings({...adminSettings, newPassword: e.target.value})}
                        className="w-full px-4 py-3 bg-brand-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold tracking-widest text-brand-400">Confirm New Password</label>
                      <input 
                        type="password" 
                        value={adminSettings.confirmPassword}
                        onChange={e => setAdminSettings({...adminSettings, confirmPassword: e.target.value})}
                        className="w-full px-4 py-3 bg-brand-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900" 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" className="bg-brand-900 text-white px-8 py-3 rounded-full font-medium hover:bg-black transition-colors">
                    Save Admin Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      case 'Site Config':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-serif">Site Configuration</h2>
            <div className="bg-white rounded-2xl luxury-shadow border border-brand-100 p-8 space-y-8">
              {settingsMessage && (
                <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm">
                  {settingsMessage}
                </div>
              )}
              <div className="max-w-md">
                <FileUpload 
                  label="Site Logo"
                  currentValue={siteSettings.logo}
                  onUploadSuccess={handleUpdateLogo}
                />
                {siteSettings.logo && (
                  <div className="mt-4 pt-4 border-t border-brand-100">
                    <button 
                      onClick={() => handleUpdateLogo('')}
                      className="text-xs text-red-600 font-bold uppercase tracking-widest hover:underline"
                    >
                      Remove Logo
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto bg-brand-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 p-6 bg-white rounded-2xl luxury-shadow border border-brand-100">
            <div className="w-14 h-14 bg-brand-900 text-white rounded-full flex items-center justify-center font-serif text-2xl">
              {user?.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-serif text-lg">Admin Panel</h3>
              <p className="text-xs text-brand-400">{user?.email}</p>
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

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl luxury-shadow overflow-hidden">
            <div className="p-8 border-b border-brand-100 flex justify-between items-center">
              <h3 className="text-2xl font-serif">{editingProduct ? 'Edit Product' : 'New Product'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-brand-400 hover:text-brand-900">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-brand-400">Product Name</label>
                  <input 
                    type="text" 
                    required
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-4 py-3 bg-brand-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-brand-400">Price ($)</label>
                  <input 
                    type="number" 
                    required
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-4 py-3 bg-brand-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-widest text-brand-400">Category</label>
                <select 
                  value={newProduct.category}
                  onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full px-4 py-3 bg-brand-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900"
                >
                  {['Dresses', 'Knitwear', 'Accessories', 'Denim', 'Outerwear'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <FileUpload 
                label="Product Image"
                currentValue={newProduct.image}
                onUploadSuccess={(url) => setNewProduct({...newProduct, image: url})}
              />

              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-widest text-brand-400">Description</label>
                <textarea 
                  required
                  value={newProduct.description}
                  onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full px-4 py-3 bg-brand-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900 h-32"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-brand-900 text-white py-4 rounded-full font-medium hover:bg-black transition-colors"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Blog Modal */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl luxury-shadow overflow-hidden">
            <div className="p-8 border-b border-brand-100 flex justify-between items-center">
              <h3 className="text-2xl font-serif">{editingBlog ? 'Edit Post' : 'New Post'}</h3>
              <button onClick={() => setIsBlogModalOpen(false)} className="text-brand-400 hover:text-brand-900">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddBlog} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-widest text-brand-400">Title</label>
                <input 
                  type="text" 
                  required
                  value={newBlog.title}
                  onChange={e => setNewBlog({...newBlog, title: e.target.value})}
                  className="w-full px-4 py-3 bg-brand-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FileUpload 
                  label="Featured Image"
                  currentValue={newBlog.image}
                  onUploadSuccess={(url) => setNewBlog({...newBlog, image: url})}
                />
                <FileUpload 
                  label="Featured Video"
                  accept="video/*"
                  currentValue={newBlog.video}
                  onUploadSuccess={(url) => setNewBlog({...newBlog, video: url})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-widest text-brand-400">Tags (comma separated)</label>
                <input 
                  type="text" 
                  placeholder="Style, Sustainability, News"
                  value={newBlog.tags}
                  onChange={e => setNewBlog({...newBlog, tags: e.target.value})}
                  className="w-full px-4 py-3 bg-brand-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-widest text-brand-400">Content</label>
                <textarea 
                  required
                  value={newBlog.content}
                  onChange={e => setNewBlog({...newBlog, content: e.target.value})}
                  className="w-full px-4 py-3 bg-brand-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-900 h-64"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-brand-900 text-white py-4 rounded-full font-medium hover:bg-black transition-colors"
                >
                  {editingBlog ? 'Update Post' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
