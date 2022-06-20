from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .views import MyTokenObtainPairView, sign_up_user, get_user_reviews, update_user, change_password, get_user_info

app_name = 'users'

urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='login-user'),
    path('signup/', sign_up_user, name="sign_up_user"),
    path('reviews/', get_user_reviews, name="get_user_reviews"),
    path('update/', update_user, name="update_user"),
    path('changepassword/', change_password, name="change_password"),
    path('getuserinfo/', get_user_info, name="get_user_info"),
]