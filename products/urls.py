from django.urls import path
from .views import get_products_by_category, get_product_details, get_sale_products, get_product_reviews, get_product_color

app_name = 'products'

urlpatterns = [
    path('sale/', get_sale_products, name="get_sale_products"),
    path('category/<str:category_name>/', get_products_by_category, name="get_products_by_category"),
    path('<int:product_id>/', get_product_details, name="get_product_details"),
    path('<int:product_id>/reviews/', get_product_reviews, name="get_product_reviews"),
    path('productcolors/<int:product_color_id>/', get_product_color, name="get_product_color")
]