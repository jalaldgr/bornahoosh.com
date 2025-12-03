# ========================================
# users/admin.py
# ========================================
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'phone', 'role', 'is_staff']
    list_filter = ['role', 'is_staff', 'created_at']
    search_fields = ['username', 'email', 'phone']

    fieldsets = (
        ('اطلاعات اساسی', {'fields': ('username', 'password', 'email')}),
        ('اطلاعات شخصی', {'fields': ('first_name', 'last_name', 'phone')}),
        ('دسترسی‌ها', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('تاریخ‌ها', {'fields': ('last_login', 'created_at'), 'classes': ('collapse',)}),
    )

    add_fieldsets = (
        (None, {'fields': ('username', 'email', 'password1', 'password2')}),
        ('اطلاعات شخصی', {'fields': ('first_name', 'last_name', 'phone', 'role')}),
    )

