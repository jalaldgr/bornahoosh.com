# ========================================
# payments/views.py
# ========================================
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, permissions
from orders.models import Order
from .models import PaymentTransaction
import requests
from django.conf import settings


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def zarinpal_request(request):
    """درخواست پرداخت از زرین‌پال"""
    order_id = request.data.get('order_id')

    try:
        order = Order.objects.get(id=order_id)
        amount = int(order.deposit_price if order.payment_method == 'deposit' else order.total_price)

        data = {
            "merchant_id": settings.ZARINPAL_MERCHANT_ID,
            "amount": amount * 10,  # تومان به ریال
            "callback_url": f"{settings.FRONTEND_URL}/payment/callback",
            "description": f"سفارش {order.order_number}",
            "email": order.client_email,
            "mobile": order.client_phone,
        }

        response = requests.post(
            f"{settings.ZARINPAL_API_URL}/payment/request.json",
            json=data,
            timeout=30
        )

        result = response.json()

        if result.get('data', {}).get('code') == 100:
            authority = result['data']['authority']
            payment_url = f"https://www.zarinpal.com/pg/StartPay/{authority}"

            return Response({
                'success': True,
                'payment_url': payment_url,
                'authority': authority,
            })

        return Response({
            'success': False,
            'error': result.get('data', {}).get('message', 'خطا')
        }, status=status.HTTP_400_BAD_REQUEST)

    except Order.DoesNotExist:
        return Response({
            'success': False,
            'error': 'سفارش یافت نشد'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def zarinpal_verify(request):
    """تایید پرداخت از زرین‌پال"""
    authority = request.data.get('authority')
    order_id = request.data.get('order_id')

    try:
        order = Order.objects.get(id=order_id)
        amount = int(order.deposit_price if order.payment_method == 'deposit' else order.total_price)

        data = {
            "merchant_id": settings.ZARINPAL_MERCHANT_ID,
            "authority": authority,
            "amount": amount * 10,
        }

        response = requests.post(
            f"{settings.ZARINPAL_API_URL}/payment/verify.json",
            json=data,
            timeout=30
        )

        result = response.json()

        if result.get('data', {}).get('code') == 100:
            # ثبت تراکنش
            PaymentTransaction.objects.create(
                order_number=order.order_number,
                gateway='zarinpal',
                amount=amount,
                status='completed',
                transaction_id=authority,
                reference_id=result['data'].get('ref_id', '')
            )

            # تغییر وضعیت سفارش
            order.status = 'paid'
            order.payment_transaction_id = authority
            order.save()

            return Response({
                'success': True,
                'message': 'پرداخت موفق بود',
                'order_number': order.order_number
            })

        return Response({
            'success': False,
            'error': result.get('data', {}).get('message', 'خطا')
        }, status=status.HTTP_400_BAD_REQUEST)

    except Order.DoesNotExist:
        return Response({
            'success': False,
            'error': 'سفارش یافت نشد'
        }, status=status.HTTP_404_NOT_FOUND)