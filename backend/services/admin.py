# ========================================
# services/admin.py
# ========================================
from django.contrib import admin
from .models import Service


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'plan_count', 'order', 'created_at']
    list_editable = ['order']
    list_filter = ['created_at']
    search_fields = ['title', 'slug']
    prepopulated_fields = {'slug': ('title',)}

    fieldsets = (
        ('اطلاعات خدمت', {
            'fields': ('title', 'slug', 'description', 'short_description')
        }),
        ('تنظیمات نمایشی', {
            'fields': ('icon', 'image', 'order')
        }),
        ('پلن‌ها و ویژگی‌ها', {
            'fields': ('plans', 'features'),
            'description': 'مثال plans: {"Basic": 500, "Standard": 1000, "Premium": 1500}'
        }),
    )

    def plan_count(self, obj):
        return len(obj.plans) if obj.plans else 0

    plan_count.short_description = 'تعداد پلن‌ها'
