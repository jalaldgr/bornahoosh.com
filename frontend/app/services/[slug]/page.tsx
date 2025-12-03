// ========================================
// src/app/services/[slug]/page.tsx - جزئیات خدمت
// ========================================
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api.ts';
import { formatPrice } from '@/lib/utils.ts';
import type { Service } from '@/lib/types.ts';

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await api.getServiceBySlug(params.slug);
        setService(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [params.slug]);

  if (loading) return <div className="py-20 text-center">در حال بارگذاری...</div>;
  if (!service) return <div className="py-20 text-center">خدمت یافت نشد</div>;

  return (
    <div>
      {/* Header */}
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/services" className="opacity-80 hover:opacity-100">← بازگشت</Link>
          <h1 className="text-4xl font-bold mt-4">{service.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="md:col-span-2">
            <p className="text-lg text-slate-600 mb-8">{service.description}</p>

            {/* Features */}
            <h2 className="text-3xl font-bold mb-6">ویژگی‌های این خدمت</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {service.features.map((feature, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className="text-green-600 text-2xl">✓</span>
                  <p className="text-slate-600">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - Plans */}
          <div>
            <div className="bg-blue-50 p-8 rounded-lg sticky top-20">
              <h2 className="text-2xl font-bold mb-6">انتخاب پلن</h2>
              <div className="space-y-4">
                {Object.entries(service.plans).map(([plan, price]) => (
                  <Link
                    key={plan}
                    href={`/order?service=${service.slug}&plan=${plan}`}
                    className="block p-4 bg-white rounded-lg border-2 border-slate-200 hover:border-blue-600 transition"
                  >
                    <h3 className="font-bold text-lg mb-2">{plan}</h3>
                    <p className="text-2xl font-bold text-blue-600 mb-4">
                      {formatPrice(price)} ت
                    </p>
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                      انتخاب و سفارش
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
