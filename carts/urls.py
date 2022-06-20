from django.urls import path
from .views import get_cart, add_to_cart, update_quantity, remove_from_cart, check_cart

app_name = 'cartitems'

urlpatterns = [
    path('', get_cart, name="get_cart"),
    path('add/', add_to_cart, name="add_to_cart"),
    path('<int:cartitem_id>/update/', update_quantity, name="update_quantity"),
    path('<int:cartitem_id>/remove/', remove_from_cart, name="remove_from_cart"),
    path('checkcart/', check_cart, name="check_cart")
]