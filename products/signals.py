from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import ProductColor


@receiver(post_save, sender=ProductColor)
def updateProductStockOnUpdate(sender, instance, **kwargs):
    product_color = instance
    product_color.product.update_stock()
    
@receiver(post_delete, sender=ProductColor)
def updateProductStockOnDelete(sender, instance, **kwargs):
    product_color = instance
    product_color.product.update_stock()