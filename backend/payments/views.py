from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from orders.models import Order
import time

class MockPaymentView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        if not order_id:
            return Response({'error': 'Order ID required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = Order.objects.get(id=order_id, buyer=request.user)
            if order.is_paid:
                return Response({'message': 'Order already paid'}, status=status.HTTP_200_OK)

            # Simulate processing delay
            time.sleep(1)

            # verify "card" (mock)
            # In a real app, we would verify with Stripe here
            
            order.is_paid = True
            order.save()
            
            return Response({'success': True, 'message': 'Payment successful'}, status=status.HTTP_200_OK)
        
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
