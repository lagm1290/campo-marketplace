from rest_framework import viewsets, permissions
from .models import Product, Category, Review
from .serializers import ProductSerializer, CategorySerializer, ReviewSerializer
from .permissions import IsSellerOrReadOnly, IsAdminOrReadOnly
from django_filters import rest_framework as filters

class ProductFilter(filters.FilterSet):
    price_min = filters.NumberFilter(field_name='price', lookup_expr='gte')
    price_max = filters.NumberFilter(field_name='price', lookup_expr='lte')
    location = filters.CharFilter(field_name='location', lookup_expr='icontains')

    class Meta:
        model = Product
        fields = ['category', 'seller', 'price_min', 'price_max', 'location', 'condition']

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsSellerOrReadOnly]
    filterset_class = ProductFilter
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at']

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Review.objects.filter(product_id=self.kwargs['product_pk'])

    def perform_create(self, serializer):
        product = Product.objects.get(pk=self.kwargs['product_pk'])
        serializer.save(buyer=self.request.user, product=product)
