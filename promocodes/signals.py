from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import PromoCode


@receiver(pre_save, sender=PromoCode)
def updateCartSummaryOnUpdate(sender, instance, **kwargs):
    promo_code = instance
    if promo_code.featured:
        promo_codes = PromoCode.objects.filter(featured=True)
        for x in promo_codes:
            x.featured = False
            x.save()