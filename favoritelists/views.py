from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import FavoriteListItemSerializer
from .models import FavoriteListItem
from products.models import Product

# api/favoritelist/
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_favorite_list(request):
    favorite_list = FavoriteListItem.objects.select_related('product').filter(user=request.user)
    serializer = FavoriteListItemSerializer(favorite_list, many=True)
    return Response(serializer.data)

# api/favoritelist/add/
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_favorite_list(request):
    data = request.data

    product_id = data['product_id']
    product = Product.objects.get(id=product_id)

    FavoriteListItem.objects.create(
        user = request.user,
        product = product
    )
    favorite_list = FavoriteListItem.objects.filter(user=request.user)
    serializer = FavoriteListItemSerializer(favorite_list, many=True)
    return Response(serializer.data)


# api/favoritelist/:product_id/remove/
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_favorite_list(request, product_id):
    favorite = FavoriteListItem.objects.get(user=request.user, product=product_id)
    favorite.delete()
    favorite_list = FavoriteListItem.objects.filter(user=request.user)
    serializer = FavoriteListItemSerializer(favorite_list, many=True)
    return Response(serializer.data)