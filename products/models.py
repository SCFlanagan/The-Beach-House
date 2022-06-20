from unicodedata import name
from django.db import models
from django.core.validators import MinValueValidator
from django.contrib.auth.models import User

PRODUCT_CATEGORY_CHOICES = (
    ('Sunglasses', 'Sunglasses'),
    ('Towels', 'Towels'),
    ('Blankets', 'Blankets'), 
    ('Umbrellas', 'Umbrellas'),
    ('Surfboards', 'Surfboards'),
    ('Floats', 'Floats'),
    ('Games', 'Games')
)

class Product(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(max_length=300, null=True, blank=True)
    price = models.DecimalField(max_digits=7, decimal_places=2)
    num_stock = models.IntegerField(validators=[MinValueValidator(0)], default=0)
    image = models.ImageField(null=True, blank=True)
    category = models.CharField(max_length=20, choices=PRODUCT_CATEGORY_CHOICES)
    avg_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0, blank=True)
    num_reviews = models.IntegerField(validators=[MinValueValidator(0)], default=0, blank=True)
    on_sale = models.BooleanField(default=False)
    sale_price = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True, default=0)
    featured = models.BooleanField(default=False, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def update_review_summary(self):
        reviews = self.review_set.all()
        num_reviews = len(reviews)
        self.num_reviews = num_reviews
        total = 0
        for i in reviews:
            total += i.rating
        if (num_reviews):
            self.avg_rating = total / num_reviews
        else:
            self.avg_rating = 0
        self.save()

    def update_stock(self):
        product_colors = self.productcolor_set.all()
        sum = 0
        for x in product_colors:
            sum = sum + x.num_stock
        self.num_stock = sum
        self.save()


class ProductColor(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    name = models.CharField(max_length=30)
    color = models.CharField(max_length=15)
    num_stock = models.IntegerField(validators=[MinValueValidator(0)], default=0)
    date_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('name', 'product')

    def __str__(self):
        return f'Product Color: {self.pk}'