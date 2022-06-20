from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

from products.serializers import ProductSerializer

class UserSerializer(serializers.ModelSerializer):
    is_admin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_admin']
    
    def get_is_admin(self, obj):
        return obj.is_staff

class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name','is_admin', 'token']
    
    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


#class FavoriteListItemSerializer(serializers.ModelSerializer):
#    product = serializers.SlugRelatedField(
#        many=True,
#        read_only=True,
#        slug_field='name'
#    )

#    class Meta:
#        model = FavoriteListItem
#        fields=['product']
        