// ========================================
// src/app/order/page.tsx - فرم سفارش
// ========================================
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api.ts';
import { formatPrice } from '@/lib/utils.ts';
import type { Service, OrderItem } from '@/lib/types.ts';

export default function OrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [services, setServices] = useState<Service[]>([]);
  const [items, setItems] = useState<OrderItem[]>([
    { service: '', plan: '', price: 0, quantity: 1 }
  ]);
  const [paymentMethod, setPaymentMethod] = useState<'full' | 'deposit' | 'installment'>('full');
  const [installments, setInstallments] = useState(1);
  const [clientInfo, setClientInfo] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    notes: '',
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [depositPrice, setDepositPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);

  // دریافت خدمات
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.getServices();
        setServices(data);

        // اگر service و plan از URL آمده بود
        const serviceSlug = searchParams.get('service');
        const planName = searchParams.get('plan');
        if (serviceSlug && planName) {
          const service = data.find(s => s.slug === serviceSlug);
          if (service && service.plans[planName]) {
            setItems([{
              service: service.title,
              plan: planName,
              price: service.plans[planName],
              quantity: 1
            }]);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchServices();
  }, []);

  // محاسبه مبلغ
  useEffect(() => {
    const calculate = async () => {
      if (items.length === 0 || !items[0].service) return;

      try {
        const result = await api.calculateOrderTotal({
          items,
          payment_method: paymentMethod,
        });
        setTotalPrice(result.total_price);
        setDepositPrice(result.deposit_price);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    calculate();
  }, [items, paymentMethod]);

  const handleAddItem = () => {
    setItems([...items, { service: '', plan: '', price: 0, quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    const item = newItems[index];

    if (field === 'service') {
      const service = services.find(s => s.title === value);
      if (service) {
        item.service = value;
        item.plan = Object.keys(service.plans)[0];
        item.price = service.plans[item.plan];
      }
    } else if (field === 'plan') {
      const service = services.find(s => s.title === item.service);
      if (service) {
        item.plan = value;
        item.price = service.plans[value];
      }
    } else if (field === 'quantity') {
      item.quantity = Math.max(1, value);
    }

    setItems(newItems);
  };

  const handleSubmitOrder = async () => {
    if (!clientInfo.client_name || !clientInfo.client_email || !clientInfo.client_phone) {
      alert('لطفا تمام اطلاعات را وارد کنید');
      return;
    }

    if (items.length === 0 || !items[0].service) {
      alert('لطفا حداقل یک سرویس انتخاب کنید');
      return;
    }

    setLoading(true);
    try {
      const order = await api.createOrder({
        ...clientInfo,
        items,
        total_price: totalPrice,
        deposit_price: depositPrice,
        payment_method: paymentMethod,
        installments: paymentMethod === 'installment' ? installments : 1,
      });

      setOrderCreated(true);
      setTimeout(() => {
        router.push(`/order/checkout?orderId=${order.id}`);
      }, 1000);
    } catch (error) {
      alert('خطا در ایجاد سفارش');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const paymentAmount = paymentMethod === 'deposit' ? depositPrice : totalPrice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-slate-900">سفارش خدمات</h1>
        <p className="text-center text-slate-600 mb-12">
          خدمات مورد نیاز خود را انتخاب کنید و پرداخت کنید
        </p>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* آیتم‌های سفارش */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">خدمات</h2>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-slate-50 rounded-lg">
                  <select
                    value={item.service}
                    onChange={(e) => handleItemChange(index, 'service', e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="">انتخاب خدمت</option>
                    {services.map(s => (
                      <option key={s.id} value={s.title}>{s.title}</option>
                    ))}
                  </select>

                  {item.service && (
                    <select
                      value={item.plan}
                      onChange={(e) => handleItemChange(index, 'plan', e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg"
                    >
                      {services.find(s => s.title === item.service)?.plans &&
                        Object.entries(services.find(s => s.title === item.service)!.plans).map(([plan, price]) => (
                          <option key={plan} value={plan}>
                            {plan} - {formatPrice(price)} ت
                          </option>
                        ))
                      }
                    </select>
                  )}

                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                    className="w-20 px-3 py-2 border border-slate-300 rounded-lg"
                  />

                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddItem}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              + اضافه کردن سرویس
            </button>
          </div>

          {/* روش پرداخت */}
          <div className="mb-8 pb-8 border-b border-slate-200">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">روش پرداخت</h2>
            <div className="space-y-3">
              <label className="flex items-center p-3 border-2 border-slate-300 rounded-lg cursor-pointer hover:border-blue-500">
                <input
                  type="radio"
                  name="payment"
                  value="full"
                  checked={paymentMethod === 'full'}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="ml-3"
                />
                <span className="font-medium">پرداخت کامل - {formatPrice(totalPrice)} ت</span>
              </label>

              <label className="flex items-center p-3 border-2 border-slate-300 rounded-lg cursor-pointer hover:border-blue-500">
                <input
                  type="radio"
                  name="payment"
                  value="deposit"
                  checked={paymentMethod === 'deposit'}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="ml-3"
                />
                <span className="font-medium">پیش‌پرداخت 50% - {formatPrice(depositPrice)} ت</span>
              </label>

              <div>
                <label className="flex items-center p-3 border-2 border-slate-300 rounded-lg cursor-pointer hover:border-blue-500">
                  <input
                    type="radio"
                    name="payment"
                    value="installment"
                    checked={paymentMethod === 'installment'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="ml-3"
                  />
                  <span className="font-medium">اقساط</span>
                </label>
                {paymentMethod === 'installment' && (
                  <select
                    value={installments}
                    onChange={(e) => setInstallments(parseInt(e.target.value))}
                    className="w-full mt-3 px-3 py-2 border border-slate-300 rounded-lg ml-8"
                  >
                    <option value="2">2 قسط - هر قسط: {formatPrice(totalPrice / 2)} ت</option>
                    <option value="3">3 قسط - هر قسط: {formatPrice(totalPrice / 3)} ت</option>
                    <option value="6">6 قسط - هر قسط: {formatPrice(totalPrice / 6)} ت</option>
                    <option value="12">12 قسط - هر قسط: {formatPrice(totalPrice / 12)} ت</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* اطلاعات مشتری */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">اطلاعات تماس</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="نام و نام‌خانوادگی"
                value={clientInfo.client_name}
                onChange={(e) => setClientInfo({...clientInfo, client_name: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
              <input
                type="email"
                placeholder="ایمیل"
                value={clientInfo.client_email}
                onChange={(e) => setClientInfo({...clientInfo, client_email: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
              <input
                type="tel"
                placeholder="شماره تماس"
                value={clientInfo.client_phone}
                onChange={(e) => setClientInfo({...clientInfo, client_phone: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
              <textarea
                placeholder="توضیحات اضافی"
                value={clientInfo.notes}
                onChange={(e) => setClientInfo({...clientInfo, notes: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          {/* خلاصه */}
          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <div className="flex justify-between mb-3">
              <span className="text-slate-600">مبلغ کل:</span>
              <span className="font-bold">{formatPrice(totalPrice)} ت</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>پرداخت الآن:</span>
              <span className="text-blue-600">{formatPrice(paymentAmount)} ت</span>
            </div>
          </div>

          {/* دکمه ثبت */}
          <button
            onClick={handleSubmitOrder}
            disabled={loading || orderCreated}
            className={`w-full py-3 rounded-lg font-bold text-white text-lg transition ${
              orderCreated ? 'bg-green-500' : loading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'در حال پردازش...' : orderCreated ? '✓ سفارش ثبت شد' : 'ادامه به پرداخت'}
          </button>
        </div>
      </div>
    </div>
  );
}

