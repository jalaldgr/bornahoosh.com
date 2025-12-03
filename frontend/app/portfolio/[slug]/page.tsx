// ========================================
// src/app/portfolio/[slug]/page.tsx - جزئیات پروژه
// ========================================
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api.ts';
import type { Portfolio } from '@/lib/types.ts';

export default function PortfolioDetailPage({ params }: { params: { slug: string } }) {
  const [project, setProject] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await api.getPortfolioBySlug(params.slug);
        setProject(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.slug]);

  if (loading) return <div className="py-20 text-center">در حال بارگذاری...</div>;
  if (!project) return <div className="py-20 text-center">پروژه یافت نشد</div>;

  return (
    <div>
      {/* Header */}
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/portfolio" className="opacity-80 hover:opacity-100">← بازگشت</Link>
          <h1 className="text-4xl font-bold mt-4">{project.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main */}
          <div className="md:col-span-2">
            {/* Image */}
            <div className="bg-slate-200 rounded-lg mb-8 h-96 flex items-center justify-center">
              <p className="text-slate-400">تصویر پروژه</p>
            </div>

            {/* Description */}
            <h2 className="text-3xl font-bold mb-4">درباره این پروژه</h2>
            <p className="text-lg text-slate-600 mb-8">{project.description}</p>

            {/* Services */}
            <h3 className="text-2xl font-bold mb-4">خدمات استفاده شده</h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {project.services.map((service, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                  {service}
                </span>
              ))}
            </div>

            {/* Link */}
            {project.link && (
              <div>
                <h3 className="text-2xl font-bold mb-4">لینک پروژه</h3>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-bold hover:underline flex items-center gap-2"
                >
                  {project.link} ↗
                </a>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-slate-50 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-6">اطلاعات پروژه</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">مشتری</p>
                  <p className="font-bold">{project.client}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">تاریخ تکمیل</p>
                  <p className="font-bold">
                    {new Date(project.completion_date).toLocaleDateString('fa-IR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">تعداد خدمات</p>
                  <p className="font-bold">{project.services.length} خدمت</p>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/order"
                className="block mt-8 bg-blue-600 text-white py-3 rounded-lg font-bold text-center hover:bg-blue-700 transition"
              >
                سفارش خدمت مشابه
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}