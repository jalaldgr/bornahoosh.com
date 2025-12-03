# ========================================
# orders/models.py
# ========================================
from django.db import models
import uuid


class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'در انتظار'),
        ('paid', 'پرداخت شده'),
        ('in_progress', 'در حال انجام'),
        ('completed', 'تکمیل شده'),
    )

    PAYMENT_METHOD_CHOICES = (
        ('full', 'پرداخت کامل'),
        ('deposit', 'پیش‌پرداخت'),
        ('installment', 'اقساط'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_number = models.CharField(max_length=50, unique=True, verbose_name='شماره سفارش')

    # مشتری
    client_name = models.CharField(max_length=200, verbose_name='نام مشتری')
    client_email = models.EmailField(verbose_name='ایمیل')
    client_phone = models.CharField(max_length=15, verbose_name='شماره تماس')

    # سفارش
    items = models.JSONField(default=list, verbose_name='آیتم‌ها')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='مبلغ کل')
    deposit_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                        verbose_name='پیش‌پرداخت')

    # پرداخت
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='full',
                                      verbose_name='روش پرداخت')
    installments = models.PositiveIntegerField(default=1, verbose_name='تعداد اقساط')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='وضعیت')
    payment_transaction_id = models.CharField(max_length=255, blank=True, verbose_name='شناسه تراکنش')

    # توضیحات
    notes = models.TextField(blank=True, verbose_name='توضیحات')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'سفارش'
        verbose_name_plural = 'سفارشات'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.order_number} - {self.client_name}"

    def save(self, *args, **kwargs):
        if not self.order_number:
            from datetime import datetime
            count = Order.objects.count() + 1
            self.order_number = f"ORD-{datetime.now().strftime('%Y%m')}{str(count).zfill(5)}"
        super().save(*args, **kwargs)
