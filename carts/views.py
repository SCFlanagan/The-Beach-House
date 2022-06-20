from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Cart, CartItem
from products.models import Product, ProductColor
from .serializers import CartSerializer, CartItemSerializer
from rest_framework import status

# api/cart/
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart = Cart.objects.get(user=request.user)
    cart_items = CartItem.objects.filter(cart=cart)
    cart_serialized = CartSerializer(cart, many=False)
    cart_items_serialized = CartItemSerializer(cart_items, many=True)

    return Response({
        'cart': cart_serialized.data,
        'cartItems': cart_items_serialized.data,
    })



# api/cart/add
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    data = request.data
    product = Product.objects.get(id=data['product_id'])
    cart = Cart.objects.get(user=request.user)

    # Check if there is a color option selected.
    if data['product_color_id']:

        # Check if there is enough in stock
        product_color = ProductColor.objects.get(id=data['product_color_id'])
        if product_color.num_stock >= int(data['qty']):
            found_items = CartItem.objects.filter(cart=cart, product=product, product_color=product_color )
            
            # Check if the item in the selected color is already in the cart and change the quantity if it is, add it, if not.
            if len(found_items):
                try:
                    foundItem = found_items[0]
                    foundItem.qty = foundItem.qty + int(data['qty'])
                    foundItem.save()
                except Exception as e:
                    detail = repr(e)
                    return Response(detail, status=status.HTTP_400_BAD_REQUEST)
            else:
                try:
                    CartItem.objects.create(
                        cart = cart,
                        product = product,
                        product_color = product_color,
                        qty = data['qty']
                    )
                except Exception as e:
                    detail = repr(e)
                    return Response(detail, status=status.HTTP_400_BAD_REQUEST)

            cart_serialized = CartSerializer(cart, many=False)
            cart_items = CartItem.objects.filter(cart=request.user.id)
            cart_items_serialized = CartItemSerializer(cart_items, many=True)

            return Response({
                "cartItems": cart_items_serialized.data,
                "cart": cart_serialized.data
            })
    else:
        if product.num_stock >= int(data['qty']):
            found_items = CartItem.objects.filter(cart=cart, product=product)

            # Check if the item is already in the cart and change the quantity if it is, add it, if not.
            if len(found_items):
                try:
                    foundItem = found_items[0]
                    foundItem.qty = foundItem.qty + int(data['qty'])
                    foundItem.save()
                except Exception as e:
                    detail = repr(e)
                    return Response(detail, status=status.HTTP_400_BAD_REQUEST)
            else:
                try:
                    CartItem.objects.create(
                        cart = cart,
                        product = product,
                        qty = data['qty']
                    )
                except Exception as e:
                    detail = repr(e)
                    return Response(detail, status=status.HTTP_400_BAD_REQUEST)

            cart_serialized = CartSerializer(cart, many=False)
            cart_items = CartItem.objects.filter(cart=request.user.id)
            cart_items_serialized = CartItemSerializer(cart_items, many=True)

            return Response({
                "cartItems": cart_items_serialized.data,
                "cart": cart_serialized.data
            })


# api/cart/:cartitem_id/update/
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_quantity(request, cartitem_id):
    data = request.data

    cartItem = CartItem.objects.get(id=cartitem_id)
    cartItem.qty = data['qty']
    cartItem.save()
    cartItems = CartItem.objects.filter(cart=request.user.id)
    cart_items_serialized = CartItemSerializer(cartItems, many=True)

    cart = Cart.objects.get(user=request.user)
    cart_serialized = CartSerializer(cart, many=False)

    return Response({
        "cart": cart_serialized.data,
        "cartItems": cart_items_serialized.data
    })       


# api/cart/:cartitem_id/remove
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, cartitem_id):
    cart_item = CartItem.objects.get(id=cartitem_id)
    cart_item.delete()
    cart = Cart.objects.get(user=request.user)
    cartItems = CartItem.objects.filter(cart=cart)
    cart_items_serialized = CartItemSerializer(cartItems, many=True)
    cart_serialized = CartSerializer(cart, many=False)
    
    return Response({
        "cart": cart_serialized.data,
        "cartItems": cart_items_serialized.data
    })


# api/cart/checkcart
@api_view(['PUT'])
def check_cart(request):
    data = request.data
    updated_items = []
    updated_cart_items = []

    # Go through items in cart and check that the quantity they selected is still available. If it is not, adjust the cart item.
    for x in data['cart_items']:
        product = Product.objects.get(id=x['product']['id'])
        
        if request.user.is_authenticated:
            cart_item = CartItem.objects.get(id=x['id'])
            if x['product_color']:
                product_color = ProductColor.objects.get(id=x['product_color']['id']) 
                if product_color.num_stock < cart_item.qty:
                    cart_item.qty = product_color.num_stock
                    cart_item.save()
                    updated_items.append(cart_item)
                    if cart_item.qty == 0:
                        cart_item.delete()
                    else:
                        updated_cart_items.append(cart_item)
                else:
                    updated_cart_items.append(cart_item)
            else:
                if product.num_stock < cart_item.qty:
                    cart_item.qty = product_color.num_stock
                    cart_item.save()
                    updated_items.append(cart_item)
                    if cart_item.qty == 0:
                        cart_item.delete()
                    else:
                        updated_cart_items.append(cart_item)
                else:
                    updated_cart_items.append(cart_item)   

        else:
            if x['product_color']:
                product_color = ProductColor.objects.get(id=x['product_color']['id']) 
                xyz = int(x['qty'])
                if product_color.num_stock < int(x['qty']):
                    x['qty'] = product_color.num_stock 
                    updated_items.append(x)
                    if int(x['qty']) > 0:
                        updated_cart_items.append(x)
                else:
                    updated_cart_items.append(x)
            else:
                if product.num_stock < int(x['qty']):
                    x['qty'] = product_color.num_stock
                    updated_items.append(x)
                    if int(x['qty']) > 0:
                        updated_cart_items.append(x)
                else:
                    updated_cart_items.append(x)

    if request.user.is_authenticated:
        updated_serializer = CartItemSerializer(updated_items, many=True)
        cart_items_serializer = CartItemSerializer(updated_cart_items, many=True)

        return Response({
            "updated_items": updated_serializer.data,
            "cart_items": cart_items_serializer.data
        })
    else: 
        return Response({
            "updated_items": updated_items,
            "cart_items": updated_cart_items
        }) 
