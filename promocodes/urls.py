from django.urls import path
from .views import get_featured, confirm_code

app_name = 'promocodes'

urlpatterns = [
    path('featured/', get_featured, name="get_featured"),
    path('<str:code>/confirm/', confirm_code, name="confirm_code"),
]