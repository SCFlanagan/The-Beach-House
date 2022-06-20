from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from rest_framework import status
from .serializers import UserSerializerWithToken
from django.contrib.auth.models import User
from reviews.models import Review
from reviews.serializers import ReviewSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v
        return data

# /api/users/login
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# /api/users/signup
@api_view(['POST'])
def sign_up_user(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name = data['first_name'].title(),
            last_name = data['last_name'].title(),
            email = data['email'],
            username = data['email'],
            password = make_password(data['password'])
        )
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except Exception as e:
        detail = repr(e)
        return Response(detail, status=status.HTTP_400_BAD_REQUEST)


# api/users/reviews/
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_reviews(request):
    reviews = Review.objects.select_related('product').filter(user=request.user).order_by('-date_created')
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)


# api/users/update/
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request):
    try:
        data = request.data
        user = request.user

        if data['first_name']:
            user.first_name = data['first_name']
        if data['last_name']:
            user.last_name = data['last_name']
        if data['email']:
            user.email = data['email']

        user.save()
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except Exception as e:
        detail = 'There is already an account with that email.'
        return Response(detail, status=status.HTTP_400_BAD_REQUEST)


# api/users/changepassword
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_password(request):
    data = request.data
    user = request.user

    user.password = make_password(data['password'])
    user.save()

    return Response('Password Updated')
    


# api/users/getuserinfo/
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    try:
        user = User.objects.get(id=request.user.id)
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except Exception as e:
        detail = repr(e)
        return Response(detail, status=status.HTTP_400_BAD_REQUEST)
