from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order, OrderItem
from .serializers import OrderSerializer, CreateOrderSerializer
from products.models import Product
from django.db import transaction

class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(buyer=self.request.user).order_by('-created_at')

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateOrderSerializer
        return OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        items = serializer.validated_data['items']
        shipping_method = serializer.validated_data.get('shipping_method', 'PICKUP')

        try:
            with transaction.atomic():
                order = Order.objects.create(
                    buyer=request.user,
                    shipping_method=shipping_method
                )
                
                total = 0
                for item_data in items:
                    product = Product.objects.select_for_update().get(id=item_data['id'])
                    
                    if product.stock < item_data['quantity']:
                        raise Exception(f"Insufficient stock for {product.name}")
                    
                    product.stock -= item_data['quantity']
                    product.save()
                    
                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        quantity=item_data['quantity'],
                        price=product.price
                    )
                    total += product.price * item_data['quantity']
                
                # Calculate 10% commission
                from decimal import Decimal
                order.commission = total * Decimal('0.10')
                order.save()
                
                # Re-serialize full order to return
                full_serializer = OrderSerializer(order)
                return Response(full_serializer.data, status=status.HTTP_201_CREATED)
        
        except Product.DoesNotExist:
             return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.decorators import action

class SellerOrderViewSet(viewsets.ReadOnlyModelViewSet):
    """Orders where the seller's products are included"""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get orders that contain products from this seller
        return Order.objects.filter(items__product__seller=self.request.user).distinct().order_by('-created_at')

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        order.status = new_status
        if new_status == 'PAID':
            order.is_paid = True
        order.save()
        
        return Response(OrderSerializer(order).data)
