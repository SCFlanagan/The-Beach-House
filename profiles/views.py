from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import ProfileSerializer
from .models import Profile

# api/profile/
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    profile = Profile.objects.get(user=request.user)
    serializer = ProfileSerializer(profile, many=False)
    return Response(serializer.data)

# api/profile/update
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    data = request.data
    profile = Profile.objects.get(user=request.user)
    if data['dob_month'] != '$$##$$':
        profile.dob_month = data['dob_month']
    if data['dob_day'] != '$$##$$':
        profile.dob_day = data['dob_day']
    if data['phone'] != '$$##$$':
        profile.phone = data['phone']
    if data['address_1'] != '$$##$$':
        profile.address_1 = data['address_1']
    if data['address_2'] != '$$##$$':
        profile.address_2 = data['address_2']
    if data['address_city'] != '$$##$$':
        profile.address_city = data['address_city']
    if data['address_state'] != '$$##$$':
        profile.address_state = data['address_state']
    if data['address_zip'] != '$$##$$':
        profile.address_zip = data['address_zip']
    
    profile.save()
    serializer = ProfileSerializer(profile, many=False)
    return Response(serializer.data)