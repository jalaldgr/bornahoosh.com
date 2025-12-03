# ========================================
# portfolio/views.py
# ========================================
from rest_framework import viewsets, permissions
from .models import Portfolio
from .serializers import PortfolioSerializer

class PortfolioViewSet(viewsets.ModelViewSet):
    queryset = Portfolio.objects.all().order_by('-featured', 'order')
    serializer_class = PortfolioSerializer
    lookup_field = 'slug'
    permission_classes = [permissions.AllowAny]
