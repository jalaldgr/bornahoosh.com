// ========================================
// src/app/services/page.tsx
// ========================================
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api.ts';
import { formatPrice } from '@/lib/utils.ts';
import type { Service } from '@/lib/types.ts';
import { ArrowRight } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.getServices();
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">خدمات ما</h1>
          <p className="text-xl opacity-90">
            خدمات کاملی برای تمام نیازهای دیجیتالی شما
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Link key={service.id} href={`/services/${service.slug}`}>
                  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition border-t-4 border-blue-600 cursor-pointer group h-full">
                    <h3 className="text-2xl font-bold mb-3 text-slate-900">{service.title}</h3>
                    <p className="text-slate-600 mb-6">{service.description}</p>

                    {service.features && service.features.length > 0 && (
                      <ul className="mb-6 space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex gap-2 text-sm text-slate-600">
                            <span className="text-green-600 font-bold">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}

                    {service.plans && Object.keys(service.plans).length > 0 && (
                      <div className="mb-6 pb-6 border-b border-slate-200">
                        <p className="text-sm font-bold text-slate-700 mb-3">پلن‌های دسترس‌پذیر:</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(service.plans).map(([plan, price]) => (
                            <span key={plan} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs">
                              {plan}: {formatPrice(Number(price))} ت
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center text-blue-600 font-bold group-hover:gap-2 transition">
                      مشاهده جزئیات
                      <ArrowRight size={18} className="mr-2" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">خدمت مورد نظر را پیدا کردید؟</h2>
          <p className="text-xl mb-8 opacity-90">اکنون سفارش خود را ثبت کنید</p>
          <Link href="/order">
            <button className="bg-white text-blue-600 px-10 py-4 rounded-lg font-bold hover:bg-slate-100 transition">
              سفارش الآن
            </button>
          </Link>
        </div>
      </section>
    </>
  );
}
