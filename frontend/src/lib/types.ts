// ========================================
// src/lib/types.ts - TypeScript Types
// ========================================
export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  icon: string;
  image: string;
  plans: Record<string, number>;
  features: string[];
  order: number;
  created_at: string;
}

export interface Portfolio {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  thumbnail: string;
  images: string[];
  services: string[];
  client: string;
  link: string;
  completion_date: string;
  featured: boolean;
  order: number;
  created_at: string;
}

export interface OrderItem {
  service: string;
  plan: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  order_number: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  items: OrderItem[];
  total_price: number;
  deposit_price: number | null;
  payment_method: 'full' | 'deposit' | 'installment';
  installments: number;
  status: 'pending' | 'paid' | 'in_progress' | 'completed';
  notes: string;
  created_at: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_description: string;
  meta_keywords: string;
  published: boolean;
  created_at: string;
}
