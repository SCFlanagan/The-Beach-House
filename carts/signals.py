from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Cart, CartItem
from django.contrib.auth.models import User


@receiver(post_save, sender=CartItem)
def updateCartSummaryOnUpdate(sender, instance, **kwargs):
    cart_item = instance
    cart = Cart.objects.get(user=cart_item.cart)
    cart.update_summary()
    
@receiver(post_delete, sender=CartItem)
def updateCartSummaryOnDelete(sender, instance, **kwargs):
    cart_item = instance
    cart = Cart.objects.get(user=cart_item.cart)
    cart.update_summary()