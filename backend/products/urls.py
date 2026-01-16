from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers as nested_routers
from .views import ProductViewSet, CategoryViewSet, ReviewViewSet

router = DefaultRouter()
router.register(r'', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet)

# Nested router for reviews under products
products_router = nested_routers.NestedDefaultRouter(router, r'', lookup='product')
products_router.register(r'reviews', ReviewViewSet, basename='product-reviews')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(products_router.urls)),
]
