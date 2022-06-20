from rest_framework import serializers
from products.serializers import ProductSerializer
from .models import FavoriteListItem
from products.models import Product
from products.serializers import ProductSerializer

class FavoriteListItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    class Meta:
        model = FavoriteListItem
        fields = ['id', 'user', 'product', 'date_created']

