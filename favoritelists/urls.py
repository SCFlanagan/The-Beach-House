from django.urls import path
from .views import add_favorite_list, get_favorite_list, remove_favorite_list

app_name = 'favoritelists'

urlpatterns = [
    path('', get_favorite_list, name='get_favorite_list'),
    path('add/', add_favorite_list, name='add_favorite_list'),
    path('<int:product_id>/remove/', remove_favorite_list, name='remove_favorite_list'),
]