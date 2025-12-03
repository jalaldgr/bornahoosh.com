# ========================================
# portfolio/admin.py
# ========================================
from django.contrib import admin
from .models import Portfolio


@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ['title', 'client', 'featured', 'completion_date', 'order']
    list_editable = ['featured', 'order']
    list_filter = ['featured', 'completion_date']
    search_fields = ['title', 'client', 'slug']
    prepopulated_fields = {'slug': ('title',)}

    fieldsets = (
        ('اطلاعات پروژه', {
            'fields': ('title', 'slug', 'description', 'short_description')
        }),
        ('تصاویر', {
            'fields': ('thumbnail', 'images'),
            'description': 'تصاویر: ["image1.jpg", "image2.jpg"]'
        }),
        ('جزئیات', {
            'fields': ('client', 'link', 'services', 'completion_date')
        }),
        ('نمایش', {
            'fields': ('featured', 'order')
        }),
    )
