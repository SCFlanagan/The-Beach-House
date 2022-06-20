from django.urls import path
from .views import get_profile, update_profile

app_name = 'profiles'

urlpatterns = [
    path('', get_profile, name="get_profile"),
    path('update/', update_profile, name='update_profile')
]