from django.urls import path
from .views import create_order, get_order_items, get_user_orders, get_order_details, cancel_order

app_name = 'orders'

urlpatterns = [
    path('', get_user_orders, name="get_user_orders"),
    path('create/', create_order, name="create_order"),
    path('<int:order_id>/', get_order_details, name="get_order_details"),
    path('<int:order_id>/items/', get_order_items, name="get_order_items"),
    path('<int:order_id>/cancel/', cancel_order, name="cancel_order")
]