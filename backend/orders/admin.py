from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    raw_id_fields = ['product']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'buyer', 'total_price', 'created_at', 'is_paid')
    list_filter = ('is_paid', 'created_at')
    inlines = [OrderItemInline]
