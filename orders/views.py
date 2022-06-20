from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Order, OrderItem
from promocodes.models import PromoCode
from products.models import Product, ProductColor
from carts.models import Cart
from .serializers import OrderSerializer, OrderItemSerializer
from rest_framework import status

# api/orders/
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_orders(request):
    orders = Order.objects.filter(user=request.user).order_by('-date_created')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


# api/orders/:order_id/items
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order_items(request, order_id):
    order = Order.objects.get(id=order_id)
    order_items = OrderItem.objects.filter(order=order)
    serializer = OrderItemSerializer(order_items, many=True)
    return Response(serializer.data)



# api/orders/create
@api_view(['POST'])
def create_order(request):
    data = request.data

    # Create new order
    try:
        order = Order.objects.create(
            subtotal = data['subtotal'],
            sales_tax = data['sales_tax'],
            total = data['total'],
            contact_email = data['contact_email'],
            contact_phone = data['contact_phone'],
            shipping_name = data['shipping_name'],
            shipping_address_1 = data['shipping_address_1'],
            shipping_city = data['shipping_city'],
            shipping_state = data['shipping_state'],
            shipping_zip = data['shipping_zip'],
            card_name = data['card_name'],
            card_month = data['card_month'],
            card_year = data['card_year'],
            security_code = data['security_code'],
            billing_name = data['billing_name'],
            billing_address_1 = data['billing_address_1'],
            billing_city = data['billing_city'],
            billing_state = data['billing_state'],
            billing_zip = data['billing_zip'],
            shipping_type = data['shipping_type'],
            shipping_cost = data['shipping_cost']
        )
        promo_code = data['promo_code']
        promo_savings = data['promo_savings']
        shipping_address_2 = data['shipping_address_2']
        billing_address_2 = data['billing_address_2']
        if request.user.id != None:
            order.user = request.user
        if promo_code:
            promo = PromoCode.objects.get(code=promo_code.upper())
            order.promo_code = promo
        if promo_savings:
            order.promo_savings = promo_savings
        if shipping_address_2:
            order.shipping_address_2 = shipping_address_2
        if billing_address_2:
            order.billing_address_2 = billing_address_2
        order.save()
    except Exception as e:
        detail = repr(e)
        return Response(detail, status=status.HTTP_400_BAD_REQUEST)

    # Create order items
    try:
        order_items = data['order_items']
        new_order_items  = []
        for x in order_items:
            product = Product.objects.get(id=x['product']['id'])
            qty = int(x['qty'])
            if x['product_color']:
                product_color = ProductColor.objects.get(id=x['product_color']['id'])
                if product_color.num_stock >= qty:
                    new_order_item = OrderItem.objects.create(
                        order = order,
                        product = product,
                        product_color = product_color,
                        qty = qty
                    )
                    new_order_items.append(new_order_item)
                    product_color.num_stock = product_color.num_stock - qty
                    product_color.save()
                    product.num_stock = product.num_stock - qty
                    product.save()
                else:
                    order.delete()
                    detail = 'There are not enough items in stock.'
                    return Response(detail, status=status.HTTP_400_BAD_REQUEST)
            else:
                if product.num_stock >= qty:
                    new_order_item = OrderItem.objects.create(
                        order = order,
                        product = product,
                        qty = qty
                    )
                    new_order_items.append(new_order_item)
                    product.num_stock = product.num_stock - qty
                    product.save()
                else:
                    order.delete()
                    detail = 'There are not enough items in stock.'
                    return Response(detail, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        detail = 'Could not create order items.'
        return Response(detail, status=status.HTTP_400_BAD_REQUEST)


    # Empty cart
    if request.user.id != None:
        try:
            cart = Cart.objects.get(user=request.user)
            cart.empty_cart()

        except Exception as e:
            detail = 'Could not empty cart.'
            return Response(detail, status=status.HTTP_404_NOT_FOUND)
    

    order_items_serialized = OrderItemSerializer(new_order_items, many=True)
    order_serialized = OrderSerializer(order, many=False)
    return Response({
        'order': order_serialized.data,
        'order_items': order_items_serialized.data
    })

# api/orders/:order_id/
@api_view(['GET'])
def get_order_details(request, order_id):
    order = Order.objects.get(id=order_id)
    order_items = order.orderitem_set.all()
    order_serialized = OrderSerializer(order, many=False)
    order_items_serialized = OrderItemSerializer(order_items, many=True)
    return Response({
        'order': order_serialized.data,
        'order_items': order_items_serialized.data
    })

# api/orders/:order_id/cancel
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def cancel_order(request, order_id):
    order = Order.objects.get(id=order_id)
    order.status = 'CA'
    order.save()

    order_items  = OrderItem.objects.filter(order=order)
    for x in order_items:
        if x.product_color:
            product_color = ProductColor.objects.get(id=x.product_color.id)
            product_color.num_stock = product_color.num_stock + x.qty
            product_color.save()

        product = Product.objects.get(id=x.product.id)
        product.num_stock = product.num_stock + x.qty
        product.save()
        
    return Response(True)
    