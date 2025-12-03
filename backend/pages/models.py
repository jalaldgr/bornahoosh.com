# ========================================
# pages/models.py
# ========================================
from django.db import models
import uuid


class Page(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200, verbose_name='عنوان')
    slug = models.SlugField(unique=True, verbose_name='نام URL')
    content = models.TextField(verbose_name='محتوا')

    meta_description = models.CharField(max_length=160, blank=True, verbose_name='توضیح Meta')
    meta_keywords = models.CharField(max_length=200, blank=True, verbose_name='کلمات کلیدی')

    published = models.BooleanField(default=True, verbose_name='منتشر شده')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'صفحه'
        verbose_name_plural = 'صفحات'
        ordering = ['-created_at']

    def __str__(self):
        return self.title
