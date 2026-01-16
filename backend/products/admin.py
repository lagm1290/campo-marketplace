from django.contrib import admin
from .models import Product, Category, Review

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'stock', 'category', 'seller', 'location', 'condition', 'created_at')
    list_filter = ('category', 'condition', 'created_at')
    search_fields = ('name', 'description', 'location')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'buyer', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
