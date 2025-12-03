# ========================================
# orders/admin.py
# ========================================
from django.contrib import admin
from django.utils.html import format_html
from .models import Order


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'order_number',
        'client_name',
        'amount_display',
        'status_badge',
        'payment_method_display',
        'created_at'
    ]

    list_filter = ['status', 'payment_method', 'created_at']
    search_fields = ['order_number', 'client_email', 'client_name', 'client_phone']
    readonly_fields = ['order_number', 'created_at', 'updated_at', 'client_info', 'items_display', 'payment_info']

    fieldsets = (
        ('اطلاعات سفارش', {
            'fields': ('order_number', 'created_at', 'updated_at')
        }),
        ('اطلاعات مشتری', {
            'fields': ('client_info',)
        }),
        ('جزئیات سفارش', {
            'fields': ('items_display',)
        }),
        ('پرداخت', {
            'fields': ('payment_info', 'status')
        }),
        ('توضیحات', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
    )

    actions = ['mark_as_paid', 'mark_as_in_progress', 'mark_as_completed']
    date_hierarchy = 'created_at'
    list_per_page = 25

    def status_badge(self, obj):
        colors = {
            'pending': '#FFA500',
            'paid': '#0066cc',
            'in_progress': '#9933cc',
            'completed': '#00cc66'
        }
        labels = {
            'pending': 'در انتظار',
            'paid': 'پرداخت شده',
            'in_progress': 'در حال انجام',
            'completed': 'تکمیل شده'
        }
        color = colors.get(obj.status, '#cccccc')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;">{}</span>',
            color, labels.get(obj.status, '')
        )

    status_badge.short_description = 'وضعیت'

    def amount_display(self, obj):
        return format_html(
            '<span style="color: blue; font-weight: bold;">{:,} ت</span>',
            int(obj.total_price)
        )

    amount_display.short_description = 'مبلغ'

    def payment_method_display(self, obj):
        methods = {
            'full': '💰 پرداخت کامل',
            'deposit': '🔔 پیش‌پرداخت',
            'installment': '📅 اقساط'
        }
        return methods.get(obj.payment_method, '')

    payment_method_display.short_description = 'روش پرداخت'

    def client_info(self, obj):
        return format_html(
            '<b>نام:</b> {}<br><b>ایمیل:</b> {}<br><b>تماس:</b> {}',
            obj.client_name, obj.client_email, obj.client_phone
        )

    client_info.short_description = 'اطلاعات مشتری'

    def items_display(self, obj):
        if not obj.items:
            return 'بدون آیتم'

        html = '<table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">'
        html += '<tr style="background-color: #f0f0f0;"><th>خدمت</th><th>پلن</th><th>قیمت</th><th>تعداد</th><th>جمع</th></tr>'

        for item in obj.items:
            total = int(item.get('price', 0)) * item.get('quantity', 1)
            html += f'<tr style="border-bottom: 1px solid #ddd;">'
            html += f'<td>{item.get("service", "")}</td>'
            html += f'<td>{item.get("plan", "")}</td>'
            html += f'<td>{int(item.get("price", 0)):,}</td>'
            html += f'<td>{item.get("quantity", 1)}</td>'
            html += f'<td><b>{total:,}</b></td>'
            html += '</tr>'

        html += '</table>'
        return format_html(html)

    items_display.short_description = 'آیتم‌های سفارش'

    def payment_info(self, obj):
        html = f'<b>مبلغ کل:</b> {int(obj.total_price):,} ت<br>'
        if obj.payment_method == 'deposit' and obj.deposit_price:
            html += f'<b>پیش‌پرداخت:</b> {int(obj.deposit_price):,} ت<br>'
        if obj.payment_method == 'installment':
            html += f'<b>اقساط:</b> {obj.installments} قسط<br>'
        html += f'<b>شناسه تراکنش:</b> {obj.payment_transaction_id or "ثبت نشده"}'
        return format_html(html)

    payment_info.short_description = 'جزئیات پرداخت'

    def mark_as_paid(self, request, queryset):
        count = queryset.update(status='paid')
        self.message_user(request, f'{count} سفارش به عنوان پرداخت شده علامت گذاری شد')

    mark_as_paid.short_description = '✓ علامت گذاری: پرداخت شده'

    def mark_as_in_progress(self, request, queryset):
        count = queryset.update(status='in_progress')
        self.message_user(request, f'{count} سفارش به عنوان در حال انجام علامت گذاری شد')

    mark_as_in_progress.short_description = '⏳ علامت گذاری: در حال انجام'

    def mark_as_completed(self, request, queryset):
        count = queryset.update(status='completed')
        self.message_user(request, f'{count} سفارش به عنوان تکمیل شده علامت گذاری شد')

    mark_as_completed.short_description = '✓✓ علامت گذاری: تکمیل شده'
