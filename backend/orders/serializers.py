# ========================================
# orders/serializers.py
# ========================================
from rest_framework import serializers
from .models import Order


class OrderItemSerializer(serializers.Serializer):
    service = serializers.CharField()
    plan = serializers.CharField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    quantity = serializers.IntegerField(min_value=1, default=1)


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'order_number', 'client_name', 'client_email', 'client_phone', 'items', 'total_price',
                  'deposit_price', 'payment_method', 'installments', 'status', 'notes', 'created_at']
        read_only_fields = ['id', 'order_number', 'created_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        order = Order.objects.create(**validated_data)
        order.items = items_data
        order.save()
        return order