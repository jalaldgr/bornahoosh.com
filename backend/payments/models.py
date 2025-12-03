# ========================================
# payments/models.py
# ========================================
from django.db import models
import uuid


class PaymentTransaction(models.Model):
    GATEWAY_CHOICES = (
        ('zarinpal', 'زرین‌پال'),
        ('stripe', 'Stripe'),
    )

    STATUS_CHOICES = (
        ('pending', 'در انتظار'),
        ('completed', 'تکمیل شده'),
        ('failed', 'ناموفق'),
        ('refunded', 'بازگردانده شده'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # لینک به سفارش
    order_number = models.CharField(max_length=50, verbose_name='شماره سفارش')

    # تراکنش
    gateway = models.CharField(max_length=20, choices=GATEWAY_CHOICES, verbose_name='درگاه')
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='مبلغ')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='وضعیت')

    # IDs
    transaction_id = models.CharField(max_length=255, unique=True, verbose_name='شناسه تراکنش')
    reference_id = models.CharField(max_length=255, blank=True, verbose_name='شناسه مرجع')

    # خطا
    error_message = models.TextField(blank=True, verbose_name='پیام خطا')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'تراکنش'
        verbose_name_plural = 'تراکنش‌ها'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.transaction_id} - {self.get_status_display()}"