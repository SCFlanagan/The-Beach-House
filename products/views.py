from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import ProductColorSerializer, ProductSerializer
from .models import Product, ProductColor
from reviews.models import Review
from reviews.serializers import ReviewSerializer

# api/products/category/:category_name
@api_view(['GET'])
def get_products_by_category(request, category_name):
    category_name = category_name.lower().title()
    products = Product.objects.filter(category=category_name)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)
    
# api/products/sale
@api_view(['GET'])
def get_sale_products(request):
    sale_items = Product.objects.filter(on_sale=True)
    serializer = ProductSerializer(sale_items, many=True)
    return Response(serializer.data)

# api/products/:product_id
@api_view(['GET'])
def get_product_details(request, product_id):
    product = Product.objects.get(id=product_id)
    reviews = product.review_set.all().order_by('-date_created')
    colors = product.productcolor_set.all()
    product_serialized = ProductSerializer(product, many=False)
    reviews_serialized = ReviewSerializer(reviews, many=True)
    colors_serialized = ProductColorSerializer(colors, many=True)

    return Response({
        'product': product_serialized.data,
        'reviews': reviews_serialized.data,
        'colors':  colors_serialized.data
    })

# api/products/:product_id/reviews
@api_view(['GET'])
def get_product_reviews(request, product_id):
    reviews = Review.objects.filter(product=product_id).order_by('-date_created')
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)

# api/products/product_colors/:product_color_id/
@api_view(['GET'])
def get_product_color(request, product_color_id):
    product_color = ProductColor.objects.get(id=product_color_id)
    serializer = ProductColorSerializer(product_color, many=False)
    return Response(serializer.data)
