// ========================================
// src/lib/api.ts - کال API
// ========================================
import { API_URL } from './constants';
import type { Service, Portfolio, Order, Page, OrderItem } from './types';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error(`API Request Error: ${endpoint}`, error);
      throw error;
    }
  }

  // Services
  async getServices(): Promise<Service[]> {
    return this.request<Service[]>('/services/');
  }

  async getServiceBySlug(slug: string): Promise<Service> {
    return this.request<Service>(`/services/${slug}/`);
  }

  // Portfolio
  async getPortfolio(): Promise<Portfolio[]> {
    return this.request<Portfolio[]>('/portfolio/');
  }

  async getPortfolioBySlug(slug: string): Promise<Portfolio> {
    return this.request<Portfolio>(`/portfolio/${slug}/`);
  }

  // Pages
  async getPageBySlug(slug: string): Promise<Page> {
    return this.request<Page>(`/pages/${slug}/`);
  }

  // Orders
  async createOrder(data: {
    client_name: string;
    client_email: string;
    client_phone: string;
    items: OrderItem[];
    total_price: number;
    deposit_price?: number;
    payment_method: 'full' | 'deposit' | 'installment';
    installments: number;
    notes?: string;
  }): Promise<Order> {
    return this.request<Order>('/orders/create/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async calculateOrderTotal(data: {
    items: OrderItem[];
    payment_method: 'full' | 'deposit' | 'installment';
  }): Promise<{
    success: boolean;
    total_price: number;
    deposit_price: number;
    final_price: number;
  }> {
    return this.request<any>('/orders/calculate/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Payment
  async requestZarinpalPayment(order_id: string): Promise<{
    success: boolean;
    payment_url: string;
    authority: string;
  }> {
    return this.request<any>('/payments/zarinpal/request/', {
      method: 'POST',
      body: JSON.stringify({ order_id }),
    });
  }

  async verifyZarinpalPayment(data: {
    authority: string;
    order_id: string;
  }): Promise<{
    success: boolean;
    message: string;
    order_number: string;
  }> {
    return this.request<any>('/payments/zarinpal/verify/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
