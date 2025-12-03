# ========================================
# services/serializers.py
# ========================================
from rest_framework import serializers
from .models import Service

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'title', 'slug', 'description', 'short_description', 'icon', 'image', 'plans', 'features', 'order']

