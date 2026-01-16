from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, SellerOrderViewSet

router = DefaultRouter()
router.register(r'', OrderViewSet, basename='order')
router.register(r'seller', SellerOrderViewSet, basename='seller-order')

urlpatterns = [
    path('', include(router.urls)),
]
