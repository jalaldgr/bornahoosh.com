# ========================================
# portfolio/models.py
# ========================================
from django.db import models
import uuid


class Portfolio(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200, verbose_name='عنوان پروژه')
    slug = models.SlugField(unique=True, verbose_name='نام URL')
    description = models.TextField(verbose_name='توضیحات')
    short_description = models.CharField(max_length=500, verbose_name='توضیح کوتاه')

    thumbnail = models.ImageField(upload_to='portfolio/', verbose_name='تصویر کوچک')
    images = models.JSONField(
        default=list,
        help_text='["image1.jpg", "image2.jpg"]'
    )

    services = models.JSONField(
        default=list,
        help_text='["Web Design", "Development"]'
    )

    client = models.CharField(max_length=200, blank=True, verbose_name='مشتری')
    link = models.URLField(blank=True, verbose_name='لینک پروژه')
    completion_date = models.DateField(verbose_name='تاریخ تکمیل')

    featured = models.BooleanField(default=False, verbose_name='برجسته')
    order = models.PositiveIntegerField(default=0, verbose_name='ترتیب نمایش')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'نمونه کار'
        verbose_name_plural = 'نمونه کارها'
        ordering = ['-featured', 'order', '-completion_date']

    def __str__(self):
        return self.title