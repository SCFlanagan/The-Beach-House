from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from carts.models import Cart
from profiles.models import Profile

@receiver(pre_save, sender=User)
def updateUser(sender, instance, **kwargs):
    user = instance
    if user.email != '':
        user.username = user.email


@receiver(post_save, sender=User)
def createCart(sender, instance, **kwargs):
    user = instance
    if kwargs['created'] == True:
        Cart.objects.create(user=user)
        Profile.objects.create(user=user)
