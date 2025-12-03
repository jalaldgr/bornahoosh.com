'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Zap, Code, MessageCircle, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import type { Service, Portfolio } from '@/lib/types';

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, portfolioData] = await Promise.all([
          api.getServices(),
          api.getPortfolio(),
        ]);
        setServices(Array.isArray(servicesData) ? servicesData : []);
        setPortfolio(Array.isArray(portfolioData) ? portfolioData.slice(0, 3) : []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-6xl md:text-7xl font-black leading-tight">
                  برنا <span className="text-blue-300">هوش</span>
                </h1>
                <p className="text-2xl text-blue-100">راهکارهای دیجیتال برای کسب و کار شما</p>
              </div>

              <p className="text-xl text-blue-50 leading-relaxed">
                ما تیمی متخصص در طراحی سایت، توسعه نرم‌افزار و ایجاد ربات‌های هوشمند هستیم.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/order">
                  <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center">
                    شروع کنید
                    <ArrowRight size={20} />
                  </button>
                </Link>
                <Link href="/portfolio">
                  <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition w-full sm:w-auto">
                    نمونه کارها
                  </button>
                </Link>
              </div>

              <div className="flex gap-8 pt-8 text-sm text-blue-100">
                <div>
                  <div className="text-3xl font-bold">50+</div>
                  <div>پروژه تکمیل شده</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">30+</div>
                  <div>مشتری راضی</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">5+</div>
                  <div>سال تجربه</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-2xl p-8 h-96 flex items-center justify-center border-2 border-blue-400/30 backdrop-blur-sm">
                <div className="text-center">
                  <Code size={80} className="mx-auto mb-4 opacity-50" />
                  <p className="text-blue-100 text-xl">توسعه نرم‌افزار حرفه‌ای</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-slate-900">خدمات ما</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              ما تخصص داریم در ارائه راهکارهای جامع برای نیازهای دیجیتالی شما
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-slate-600">در حال بارگذاری...</p>
            </div>
          ) : services.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, idx) => (
                <Link key={service.id} href={`/services/${service.slug}`}>
                  <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition duration-300 h-full border-t-4 border-blue-600 cursor-pointer group">
                    <div className="mb-4 text-blue-600 group-hover:scale-110 transition">
                      {idx === 0 && <Zap size={40} />}
                      {idx === 1 && <Code size={40} />}
                      {idx === 2 && <MessageCircle size={40} />}
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-slate-900">{service.title}</h3>
                    <p className="text-slate-600 mb-6 line-clamp-3">{service.short_description || service.description}</p>

                    {service.plans && Object.keys(service.plans).length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-bold text-slate-700">پلن‌های دسترس‌پذیر:</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(service.plans).map(([plan, price]) => (
                            <span key={plan} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                              {plan}: {formatPrice(Number(price))} ت
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-6 pt-6 border-t border-slate-200 flex items-center text-blue-600 font-bold group-hover:gap-2 transition">
                      بیشتر بدانید
                      <ArrowRight size={18} className="mr-2" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600">خدماتی برای نمایش وجود ندارد</p>
            </div>
          )}
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-slate-900">نمونه کارها</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              پروژه‌های موفقی که برای کلاینت‌های ما انجام داده‌ایم
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : portfolio.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {portfolio.map((project) => (
                <Link key={project.id} href={`/portfolio/${project.slug}`}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 cursor-pointer group">
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 h-48 flex items-center justify-center overflow-hidden relative">
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition"></div>
                      <Code size={80} className="text-white/30 group-hover:scale-110 transition" />
                    </div>
                    <div className="p-6">
                      {project.featured && (
                        <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold mb-3">
                          ⭐ برجسته
                        </span>
                      )}
                      <h3 className="text-xl font-bold mb-2 text-slate-900 line-clamp-2">{project.title}</h3>
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2">{project.short_description}</p>
                      <div className="flex justify-between items-center text-sm text-slate-600">
                        <span className="font-medium">{project.client}</span>
                        <span className="text-blue-600 font-bold">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600">نمونه کاری برای نمایش وجود ندارد</p>
            </div>
          )}

          <div className="text-center">
            <Link href="/portfolio">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition inline-flex items-center gap-2">
                مشاهده تمام پروژه‌ها
                <ArrowRight size={20} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">آماده شروع هستید؟</h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            امروز تیم ما را برای مشاوره رایگان تماس بگیرید و ببینید چطور می‌توانیم کسب‌وکار شما را تبدیل کنیم.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/order">
              <button className="bg-white text-blue-600 px-10 py-4 rounded-lg font-bold hover:bg-slate-100 transition inline-flex items-center gap-2">
                سفارش دهید
                <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="/contact">
              <button className="border-2 border-white text-white px-10 py-4 rounded-lg font-bold hover:bg-white/10 transition">
                تماس با ما
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}