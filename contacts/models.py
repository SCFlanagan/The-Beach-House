from django.db import models

STATUS_CHOICES = (
    ('O', 'Open'),
    ('C', 'Closed')
)

class Contact(models.Model):
    email = models.EmailField(max_length=50)
    subject = models.CharField(max_length=60, null=True, blank=True)
    content = models.CharField(max_length=1000)
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='O')
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Contact #: {self.pk}'

