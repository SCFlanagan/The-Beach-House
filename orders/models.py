from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User
from products.models import Product, ProductColor
from promocodes.models import PromoCode
from datetime import date

STATE_CHOICES = ( 
    ('AL', 'Alabama'), 
    ('AK', 'Alaska'), 
    ('AZ', 'Arizona'), 
    ('AR', 'Arkansas'),
    ('CA', 'California'),
    ('CO', 'Colorado'),
    ('CT', 'Connecticut'),
    ('DE', 'Delaware'),
    ('DC', 'District of Columbia'),
    ('FL', 'Florida'),
    ('GA', 'Georgia'),
    ('HI', 'Hawaii'),
    ('ID', 'Idaho'),
    ('IL', 'Illinois'),
    ('IN', 'Indiana'),
    ('IA', 'Iowa'),
    ('KS', 'Kansas'),
    ('KY', 'Kentucky'),
    ('LA', 'Louisiana'),
    ('ME', 'Maine'),
    ('MD', 'Maryland'),
    ('MA', 'Massachusetts'),
    ('MI', 'Michigan'),
    ('MN', 'Minnesota'),
    ('MS', 'Mississippi'),
    ('MO', 'Missouri'),
    ('MT', 'Montana'),
    ('NE', 'Nebraska'),
    ('NV', 'Nevada'),
    ('NH', 'New Hampshire'),
    ('NJ', 'New Jersey'),
    ('NM', 'New Mexico'),
    ('NY', 'New York'),
    ('NC', 'North Carolina'),
    ('ND', 'North Dakota'),
    ('OH', 'Ohio'),
    ('OK', 'Oklahoma'),
    ('OR', 'Oregon'),
    ('PA', 'Pennsylvania'),
    ('RI', 'Rhode Island'),
    ('SC', 'South Carolina'),
    ('SD', 'South Dakota'),
    ('TN', 'Tennessee'),
    ('TX', 'Texas'),
    ('UT', 'Utah'),
    ('VT', 'Vermont'),
    ('VA', 'Virginia'),
    ('WA', 'Washington'),
    ('WV', 'West Virginia'),
    ('WI', 'Wisconsin'),
    ('WY', 'Wyoming')
)

STATUS_CHOICES = (
    ('CA', 'Cancelled'),
    ('OH', 'On Hold'),
    ('P', 'Processing'),
    ('CO', 'Completed')
)

SHIPPING_TYPE_CHOICES = (
    ('G', 'Ground'),
    ('E', 'Expedited'),
    ('O', 'Overnight')
)

CARD_MONTH_CHOICES = ( 
    ('01', 'January'),
    ('02', 'February'),
    ('03', 'March'),
    ('04', 'April'),
    ('05', 'May'),
    ('06', 'June'),
    ('07', 'July'),
    ('08', 'August'),
    ('09', 'September'),
    ('10', 'October'),
    ('11', 'November'),
    ('12', 'December')
)

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    sales_tax = models.DecimalField(max_digits=10, decimal_places=2)
    promo_code = models.ForeignKey(PromoCode, on_delete=models.SET_NULL, null=True, blank=True)
    promo_savings = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    contact_email = models.EmailField(max_length=50)
    contact_phone = models.CharField(max_length=10)
    shipping_name = models.CharField(max_length=60)
    shipping_address_1 = models.CharField(max_length=50)
    shipping_address_2 = models.CharField(max_length=50, null=True, blank=True)
    shipping_city = models.CharField(max_length=50)
    shipping_state = models.CharField(max_length=2, choices=STATE_CHOICES)
    shipping_zip = models.CharField(max_length=5)
    card_name = models.CharField(max_length=50)
    card_month = models.CharField(max_length=2, choices=CARD_MONTH_CHOICES)
    card_year = models.IntegerField(validators=[MinValueValidator(date.today().year), MaxValueValidator(date.today().year+20)])
    security_code = models.CharField(max_length=3)
    billing_name = models.CharField(max_length=60)
    billing_address_1 = models.CharField(max_length=50)
    billing_address_2 = models.CharField(max_length=50, null=True, blank=True)
    billing_city = models.CharField(max_length=50)
    billing_state = models.CharField(max_length=2, choices=STATE_CHOICES)
    billing_zip = models.CharField(max_length=5)
    shipping_type = models.CharField(max_length=1, choices=SHIPPING_TYPE_CHOICES)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default='P')
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Order #: {self.pk}'


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    product_color = models.ForeignKey(ProductColor, on_delete=models.CASCADE, null=True, blank=True)
    qty = models.IntegerField(validators=[MinValueValidator(1)], default=1)
    date_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('order', 'product')
        
    def __str__(self):
        return f'OrderItem #: {self.pk}'


