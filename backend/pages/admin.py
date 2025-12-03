# ========================================
# pages/admin.py
# ========================================
from django.contrib import admin
from .models import Page


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'published', 'created_at']
    list_editable = ['published']
    list_filter = ['published', 'created_at']
    search_fields = ['title', 'slug', 'content']
    prepopulated_fields = {'slug': ('title',)}

    fieldsets = (
        ('اطلاعات صفحه', {
            'fields': ('title', 'slug', 'content')
        }),
        ('SEO', {
            'fields': ('meta_description', 'meta_keywords')
        }),
        ('نمایش', {
            'fields': ('published',)
        }),
    )

    date_hierarchy = 'created_at'