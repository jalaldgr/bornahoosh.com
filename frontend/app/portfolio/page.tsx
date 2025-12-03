// ========================================
// src/app/portfolio/page.tsx
// ========================================
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api.ts';
import type { Portfolio } from '@/lib/types.ts';
import { Code } from 'lucide-react';

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await api.getPortfolio();
        setPortfolio(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">نمونه کارها</h1>
          <p className="text-xl opacity-90">
            پروژه‌های موفقی که برای کلاینت‌های ما انجام داده‌ایم
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : portfolio.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolio.map((project) => (
                <Link key={project.id} href={`/portfolio/${project.slug}`}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer group h-full flex flex-col">
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 h-48 flex items-center justify-center overflow-hidden relative">
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition"></div>
                      <Code size={80} className="text-white/30 group-hover:scale-110 transition" />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      {project.featured && (
                        <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold mb-3 w-fit">
                          ⭐ برجسته
                        </span>
                      )}
                      <h3 className="text-xl font-bold mb-2 text-slate-900">{project.title}</h3>
                      <p className="text-slate-600 text-sm mb-4 flex-1">{project.short_description}</p>
                      <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                        <span className="font-medium">مشتری: {project.client}</span>
                        <span className="text-blue-600 font-bold">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">نمونه کاری برای نمایش وجود ندارد</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}