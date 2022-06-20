from django.db import models
from django.contrib.auth.models import User
from products.models import Product

class FavoriteListItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f'Favorite List Item#: {self.pk}'

