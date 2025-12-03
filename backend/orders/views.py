# ========================================
# orders/views.py
# ========================================
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def create_order(request):
    """ایجاد سفارش جدید"""
    data = request.data

    try:
        order = Order.objects.create(
            client_name=data.get('client_name'),
            client_email=data.get('client_email'),
            client_phone=data.get('client_phone'),
            items=data.get('items', []),
            total_price=data.get('total_price'),
            deposit_price=data.get('deposit_price'),
            payment_method=data.get('payment_method', 'full'),
            installments=data.get('installments', 1),
            notes=data.get('notes', '')
        )

        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def calculate_order_total(request):
    """محاسبه مبلغ کل سفارش"""
    items = request.data.get('items', [])
    payment_method = request.data.get('payment_method', 'full')

    total_price = 0
    for item in items:
        total_price += float(item.get('price', 0)) * int(item.get('quantity', 1))

    deposit_price = total_price * 0.5 if payment_method == 'deposit' else 0

    return Response({
        'success': True,
        'total_price': total_price,
        'deposit_price': deposit_price,
        'final_price': deposit_price if payment_method == 'deposit' else total_price,
    })
