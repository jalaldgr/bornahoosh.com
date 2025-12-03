// ========================================
// src/app/contact/page.tsx
// ========================================
'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // می‌تونی به Backend فرستی
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">تماس با ما</h1>
          <p className="text-xl opacity-90">
            سوالات خود را برای ما ارسال کنید
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-slate-900">اطلاعات تماس</h2>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="text-blue-600 flex-shrink-0 mt-1">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">ایمیل</h3>
                    <a href="mailto:info@bornahoosh.com" className="text-slate-600 hover:text-blue-600">
                      info@bornahoosh.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-blue-600 flex-shrink-0 mt-1">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">تلفن</h3>
                    <a href="tel:09939189894" className="text-slate-600 hover:text-blue-600">
                      09939189894
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-blue-600 flex-shrink-0 mt-1">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">آدرس</h3>
                    <p className="text-slate-600">همدان، آرامگاه بوعلی، بلوار خواجه رشید، کوچه هواپیمایی، ساختمان سپهر، بطقه دوم</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-blue-600 flex-shrink-0 mt-1">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">ساعات کاری</h3>
                    <p className="text-slate-600">شنبه تا چهارشنبه</p>
                    <p className="text-slate-600">8:00 صبح تا 6:00 عصر</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-slate-900">فرم تماس</h2>

              {submitted && (
                <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6">
                  ✓ پیام شما با موفقیت ارسال شد!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    نام شما
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="نام شما"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ایمیل
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ایمیل شما"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    شماره تماس
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="شماره تماس"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    موضوع
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="موضوع پیام"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    پیام
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="پیام شما"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-bold text-white transition ${
                    loading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? 'در حال ارسال...' : 'ارسال پیام'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}