# ========================================
# core/urls.py
# ========================================
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Import ViewSets
from services.views import ServiceViewSet
from portfolio.views import PortfolioViewSet
from orders.views import OrderViewSet, calculate_order_total, create_order
from pages.views import PageViewSet
from payments.views import zarinpal_request, zarinpal_verify

# Router
router = DefaultRouter()
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'portfolio', PortfolioViewSet, basename='portfolio')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'pages', PageViewSet, basename='page')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),

    # Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Orders
    path('api/orders/create/', create_order, name='create_order'),
    path('api/orders/calculate/', calculate_order_total, name='calculate_order'),

    # Payment
    path('api/payments/zarinpal/request/', zarinpal_request, name='zarinpal_request'),
    path('api/payments/zarinpal/verify/', zarinpal_verify, name='zarinpal_verify'),
]

# Static & Media
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
