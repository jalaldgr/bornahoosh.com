
# ========================================
# pages/views.py
# ========================================
from rest_framework import viewsets, permissions
from .models import Page
from .serializers import PageSerializer

class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.filter(published=True)
    serializer_class = PageSerializer
    lookup_field = 'slug'
    permission_classes = [permissions.AllowAny]
