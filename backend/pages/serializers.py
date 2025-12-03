# ========================================
# pages/serializers.py
# ========================================
from rest_framework import serializers
from .models import Page

class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ['id', 'title', 'slug', 'content', 'meta_description', 'meta_keywords', 'published']

