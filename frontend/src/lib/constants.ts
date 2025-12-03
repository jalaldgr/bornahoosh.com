// ========================================
// src/lib/constants.ts - ثابت‌ها
// ========================================
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'برنا هوش';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const PAYMENT_METHODS = {
  full: 'پرداخت کامل',
  deposit: 'پیش‌پرداخت (50%)',
  installment: 'اقساط'
};

export const INSTALLMENT_OPTIONS = [2, 3, 6, 12];

export const ORDER_STATUS = {
  pending: { label: 'در انتظار', color: '#FFA500' },
  paid: { label: 'پرداخت شده', color: '#0066cc' },
  in_progress: { label: 'در حال انجام', color: '#9933cc' },
  completed: { label: 'تکمیل شده', color: '#00cc66' }
};