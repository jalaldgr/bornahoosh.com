# ========================================
# services/models.py
# ========================================
from django.db import models
import uuid


class Service(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200, verbose_name='عنوان')
    slug = models.SlugField(unique=True, verbose_name='نام URL')
    description = models.TextField(verbose_name='توضیحات')
    short_description = models.CharField(max_length=500, blank=True, verbose_name='توضیح کوتاه')
    icon = models.CharField(max_length=50, blank=True, help_text='نام آیکون (مثل: Zap)')
    image = models.ImageField(upload_to='services/', blank=True, verbose_name='تصویر')

    plans = models.JSONField(
        default=dict,
        help_text='{"Basic": 500, "Standard": 1000}'
    )
    features = models.JSONField(
        default=list,
        help_text='["Feature 1", "Feature 2"]'
    )

    order = models.PositiveIntegerField(default=0, verbose_name='ترتیب نمایش')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'خدمت'
        verbose_name_plural = 'خدمات'
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title