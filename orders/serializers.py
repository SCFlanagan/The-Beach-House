from rest_framework import serializers
from products.serializers import ProductSerializer, ProductColorSerializer
from .models import Order, OrderItem
        
class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    product_color = ProductColorSerializer()
    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'product', 'product_color', 'qty', 'date_created']
