from rest_framework import serializers
from products.serializers import ProductSerializer, ProductColorSerializer
from .models import Cart, CartItem
        
class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    product_color = ProductColorSerializer()
    class Meta:
        model = CartItem
        fields = ['id', 'cart', 'product', 'product_color', 'qty','date_created']
