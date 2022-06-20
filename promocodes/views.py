from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import PromoCodeSerializer
from .models import PromoCode

# /api/promocodes/featured
@api_view(['GET'])
def get_featured(request):
    code = PromoCode.objects.get(featured=True)
    serializer = PromoCodeSerializer(code)
    return Response(serializer.data)


# /api/promocodes/:code/confirm
@api_view(['GET'])
def confirm_code(request, code):
    data = request.data
    codes = PromoCode.objects.filter(status='A')
    found_code = False
    for x in codes:
        if x.code == code.upper():
            found_code = x
    if found_code:
        serializer = PromoCodeSerializer(found_code, many=False)
        return Response(serializer.data)
    else:
        return Response(False)
