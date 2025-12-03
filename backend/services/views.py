# ========================================
# services/views.py
# ========================================
from rest_framework import viewsets, permissions
from .models import Service
from .serializers import ServiceSerializer

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all().order_by('order')
    serializer_class = ServiceSerializer
    lookup_field = 'slug'
    permission_classes = [permissions.AllowAny]
