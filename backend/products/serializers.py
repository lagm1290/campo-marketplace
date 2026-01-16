from rest_framework import serializers
from .models import Category, Product, Review

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    buyer_username = serializers.ReadOnlyField(source='buyer.username')
    class Meta:
        model = Review
        fields = ['id', 'buyer_username', 'rating', 'comment', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    seller_username = serializers.ReadOnlyField(source='seller.username')
    category_name = serializers.ReadOnlyField(source='category.name')
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'seller', 'seller_username', 'category', 'category_name', 'name', 'description', 'price', 'stock', 'image', 'location', 'condition', 'reviews', 'created_at', 'updated_at']
        read_only_fields = ('seller', 'created_at', 'updated_at')
