from django.urls import path
from .views import create_contact

app_name = 'contacts'

urlpatterns = [
    path('create/', create_contact, name="create_contact"),
]