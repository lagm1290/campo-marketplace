from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price', 'total_price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = Order
        fields = ['id', 'buyer', 'created_at', 'status', 'is_paid', 'shipping_method', 'commission', 'items', 'total_price']
        read_only_fields = ['buyer', 'created_at', 'is_paid', 'commission']

class OrderItemSchema(serializers.Serializer):
    id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)

class CreateOrderSerializer(serializers.Serializer):
    items = serializers.ListField(
        child=OrderItemSchema()
    )
    shipping_method = serializers.ChoiceField(choices=Order.SHIPPING_METHOD_CHOICES, default='PICKUP')

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("Order must have at least one item.")
        return value
