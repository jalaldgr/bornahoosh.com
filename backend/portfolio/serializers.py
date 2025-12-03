# ========================================
# portfolio/serializers.py
# ========================================
from rest_framework import serializers
from .models import Portfolio

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ['id', 'title', 'slug', 'description', 'short_description', 'thumbnail', 'images', 'services', 'client', 'link', 'completion_date', 'featured', 'order']

