from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Contact

# api/contacts/create
@api_view(['POST'])
def create_contact(request):
    data = request.data
    contact = Contact.objects.create(
        email = data['email'],
        content = data['content']
    )
    if data['subject']:
        contact.subject = data['subject']
        contact.save()
    
    return Response(True)
