# ========================================
# payments/admin.py
# ========================================
from django.contrib import admin
from django.utils.html import format_html
from .models import PaymentTransaction


@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display = ['transaction_id', 'order_number', 'amount_display', 'gateway_display', 'status_badge', 'created_at']
    list_filter = ['gateway', 'status', 'created_at']
    search_fields = ['transaction_id', 'order_number', 'reference_id']
    readonly_fields = ['transaction_id', 'created_at', 'updated_at']

    fieldsets = (
        ('اطلاعات تراکنش', {
            'fields': ('transaction_id', 'order_number', 'reference_id', 'gateway', 'created_at', 'updated_at')
        }),
        ('مبلغ و وضعیت', {
            'fields': ('amount', 'status')
        }),
        ('خطا (در صورت وجود)', {
            'fields': ('error_message',),
            'classes': ('collapse',)
        }),
    )

    date_hierarchy = 'created_at'

    def amount_display(self, obj):
        return format_html('<b>{:,} ت</b>', int(obj.amount))

    amount_display.short_description = 'مبلغ'

    def gateway_display(self, obj):
        gateways = {'zarinpal': '🟢 زرین‌پال', 'stripe': '🔵 Stripe'}
        return gateways.get(obj.gateway, obj.gateway)

    gateway_display.short_description = 'درگاه'

    def status_badge(self, obj):
        colors = {
            'pending': '#FFA500',
            'completed': '#00cc66',
            'failed': '#cc0000',
            'refunded': '#0066cc'
        }
        labels = {
            'pending': 'در انتظار',
            'completed': 'تکمیل شده',
            'failed': 'ناموفق',
            'refunded': 'بازگردانده شده'
        }
        color = colors.get(obj.status, '#cccccc')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 5px 10px; border-radius: 3px;">{}</span>',
            color, labels.get(obj.status, '')
        )

    status_badge.short_description = 'وضعیت'