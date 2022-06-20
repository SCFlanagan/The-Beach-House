from django.contrib.auth.models import User
from django.db import models
from products.models import Product

User._meta.get_field('email')._unique = True

