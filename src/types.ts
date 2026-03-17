export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  variants: Variant[];
  rating: number;
  reviews: number;
}

export interface Variant {
  size?: string;
  color?: string;
  stock: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  customer: {
    name: string;
    email: string;
    address: string;
  };
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariant: Variant;
}

export interface AdminStats {
  totalRevenue: number;
  orderCount: number;
  productCount: number;
  recentOrders: Order[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}
