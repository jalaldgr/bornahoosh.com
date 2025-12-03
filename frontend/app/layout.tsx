'use client';

import type { Metadata } from 'next';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'صفحه اصلی', href: '/' },
    { name: 'خدمات', href: '/services' },
    { name: 'نمونه کارها', href: '/portfolio' },
    { name: 'سفارش', href: '/order' },
    { name: 'تماس', href: '/contact' },
  ];

  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{APP_NAME}</title>
      </head>
      <body>
        <div className="flex flex-col min-h-screen">
          {/* Navigation */}
          <nav className="sticky top-0 z-50 bg-white shadow-md border-b-4 border-blue-600">
            <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                  {APP_NAME}
                </div>
              </Link>

              {/* Desktop Menu */}
              <div className="hidden md:flex gap-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="font-medium text-slate-700 hover:text-blue-600 transition relative group"
                  >
                    {item.name}
                    <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all"></span>
                  </Link>
                ))}
              </div>

              {/* CTA Button */}
              <Link href="/order" className="hidden md:block">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
                  سفارش الآن
                </button>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-slate-700"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden bg-white border-t border-slate-200">
                <div className="px-4 py-4 space-y-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 text-slate-700 hover:bg-blue-50 rounded-lg transition"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link
                    href="/order"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block"
                  >
                    <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
                      سفارش الآن
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-slate-900 text-white">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 py-16">
              <div className="grid md:grid-cols-4 gap-12 mb-8">
                {/* Company Info */}
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-blue-400">{APP_NAME}</h3>
                  <p className="text-slate-400 mb-4">
                    ما خدمات کامل توسعه نرم‌افزار و طراحی سایت ارائه می‌دهیم
                  </p>
                  <div className="flex gap-4">
                    <a href="#" className="text-blue-400 hover:text-blue-300">
                      👨‍💻
                    </a>
                    <a href="#" className="text-blue-400 hover:text-blue-300">
                      📱
                    </a>
                    <a href="#" className="text-blue-400 hover:text-blue-300">
                      📧
                    </a>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h4 className="text-lg font-bold mb-4 text-white">خدمات ما</h4>
                  <ul className="space-y-2 text-slate-400">
                    <li>
                      <Link href="/services" className="hover:text-blue-400 transition">
                        طراحی سایت
                      </Link>
                    </li>
                    <li>
                      <Link href="/services" className="hover:text-blue-400 transition">
                        توسعه نرم‌افزار
                      </Link>
                    </li>
                    <li>
                      <Link href="/services" className="hover:text-blue-400 transition">
                        روبات تلگرام
                      </Link>
                    </li>
                    <li>
                      <Link href="/services" className="hover:text-blue-400 transition">
                        مشاوره فنی
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Quick Links */}
                <div>
                  <h4 className="text-lg font-bold mb-4 text-white">لینک‌های سریع</h4>
                  <ul className="space-y-2 text-slate-400">
                    <li>
                      <Link href="/portfolio" className="hover:text-blue-400 transition">
                        نمونه کارها
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="hover:text-blue-400 transition">
                        تماس با ما
                      </Link>
                    </li>
                    <li>
                      <Link href="/" className="hover:text-blue-400 transition">
                        درباره ما
                      </Link>
                    </li>
                    <li>
                      <Link href="/" className="hover:text-blue-400 transition">
                        شرایط و ضوابط
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Contact Info */}
                <div>
                  <h4 className="text-lg font-bold mb-4 text-white">تماس با ما</h4>
                  <ul className="space-y-3 text-slate-400">
                    <li className="flex gap-2">
                      <span>📧</span>
                      <a href="mailto:info@bornahoosh.com" className="hover:text-blue-400">
                        info@bornahoosh.com
                      </a>
                    </li>
                    <li className="flex gap-2">
                      <span>📱</span>
                      <a href="tel:09939189894" className="hover:text-blue-400">
                        09939189894
                      </a>
                    </li>
                    <li className="flex gap-2">
                      <span>📍</span>
                      <span>همدان، آرامگاه بوعلی، بلوار خواجه رشید، کوچه هواپیمایی، ساختمان سپهر، بطقه دوم</span>
                    </li>
                    <li className="flex gap-2">
                      <span>⏰</span>
                      <span>شنبه - چهارشنبه 8:00 - 18:00</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-700 my-8"></div>

              {/* Bottom Footer */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-slate-400 text-center md:text-right">
                  &copy; 2025 {APP_NAME}. تمامی حقوق نزد شرکت برنا هوش همدان محفوظ می باشد.
                </p>
                <div className="flex gap-6 text-slate-400 text-sm">
                  <a href="#" className="hover:text-blue-400 transition">
                    سیاست حریم خصوصی
                  </a>
                  <a href="#" className="hover:text-blue-400 transition">
                    شرایط استفاده
                  </a>
                  <a href="#" className="hover:text-blue-400 transition">
                    نقشه سایت
                  </a>
                </div>
              </div>
            </div>

            {/* Top Scroll Button */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-8 left-8 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition shadow-lg hidden md:flex items-center justify-center"
            >
              ↑
            </button>
          </footer>
        </div>
      </body>
    </html>
  );
}