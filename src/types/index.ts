export interface User {
  id: number;
  email: string;
  username: string;
  role: 'admin' | 'customer';
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: string;
  image_url?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
