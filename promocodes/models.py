from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

PROMO_STATUS_CHOICES = (
    ('A', 'Active'),
    ('I', 'Inactive')
)

class PromoCode(models.Model):
    code = models.TextField(max_length=20)
    discount = models.DecimalField(max_digits=3, decimal_places=2, validators=[MinValueValidator(0.00), MaxValueValidator(1.00)])
    status = models.CharField(max_length=1, choices=PROMO_STATUS_CHOICES, default='E')
    featured = models.BooleanField(default=False)

    def __str__(self):
        return f'PromoCode #: {self.pk}'