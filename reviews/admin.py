from django.contrib import admin
from .models import Review, ReviewVote

admin.site.register(Review)
admin.site.register(ReviewVote)