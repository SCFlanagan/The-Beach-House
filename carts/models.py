from functools import total_ordering
from django.db import models
from django.core.validators import MinValueValidator
from django.contrib.auth.models import User
from products.models import Product, ProductColor
from promocodes.models import PromoCode
import decimal

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    sales_tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f'Cart #: {self.pk}'
    
    def update_summary(self):
        cart_items = self.cartitem_set.filter(cart=self)
        # Update subtotal
        subtotal = 0
        for x in cart_items:
            product = Product.objects.get(id=x.product.id)
            if product.on_sale:
                subtotal = subtotal + (product.sale_price * x.qty)
            else:
                subtotal = subtotal + (product.price * x.qty)
        self.subtotal = subtotal
        
        # Update sales_tax
        sales_tax = (subtotal * decimal.Decimal(.0625))
        self.sales_tax = sales_tax

        # Update total
        total = subtotal + sales_tax
        self.total = total

        self.save()
    
    def empty_cart(self):
        self.subtotal = 0
        self.sales_tax = 0
        self.total = 0
        self.save()
        cart_items = CartItem.objects.filter(cart=self.pk)
        for x in cart_items:
            x.delete()


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    product_color = models.ForeignKey(ProductColor, on_delete=models.CASCADE, null=True, blank=True)
    qty = models.IntegerField(validators=[MinValueValidator(1)], default=1)
    date_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('cart', 'product', 'product_color')
        
    def __str__(self):
        return f'CartItem #: {self.pk}'


