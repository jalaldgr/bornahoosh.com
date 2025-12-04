// ========================================
// src/app/order/checkout/CheckoutClient.tsx
// ========================================
"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api.ts';

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePayment = async () => {
    if (!orderId) {
      setMessage('شماره سفارش یافت نشد');
      return;
    }

    setLoading(true);
    try {
      const result = await api.requestZarinpalPayment(orderId);

      if (result.success) {
        window.location.href = result.payment_url;
      } else {
        setMessage('خطا در درخواست پرداخت');
      }
    } catch (error) {
      setMessage('خطا در برقراری ارتباط');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-4xl font-bold mb-4">تکمیل پرداخت</h1>
          <p className="text-slate-600 mb-8">
            برای تکمیل سفارش خود، روی دکمه پرداخت کلیک کنید
          </p>

          {message && (
            <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-8">
              {message}
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={loading}
            className={`w-full py-4 rounded-lg font-bold text-lg text-white transition ${
              loading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'در حال هدایت...' : '💳 پرداخت با زرین‌پال'}
          </button>

          <div className="mt-8 p-6 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600 mb-4">
              درگاه پرداخت ایمن و معتبر
            </p>
            <div className="flex justify-center gap-4">
              <span className="text-sm">🔒 رمزگذاری SSL</span>
              <span className="text-sm">✓ تایید شده</span>
              <span className="text-sm">🛡️ ایمن</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
