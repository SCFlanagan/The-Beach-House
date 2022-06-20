from django.db import models
from django.core.validators import MinValueValidator
from django.contrib.auth.models import User
from products.models import Product

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    user_name = models.CharField(max_length=30, blank='True', null='True')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(0)])
    title=models.CharField(max_length=50, null=True, blank=True)
    comment = models.TextField(max_length=1000, null=True, blank=True)
    up_votes = models.IntegerField(validators=[MinValueValidator(0)], default=0)
    down_votes = models.IntegerField(validators=[MinValueValidator(0)], default=0)
    date_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f'Review #: {self.pk}'

    def update_votes(self):
        up_votes = self.reviewvote_set.filter(review_vote='U')
        down_votes = self.reviewvote_set.filter(review_vote='D')
        self.up_votes = len(up_votes)
        self.down_votes = len(down_votes)
        self.save()

REVIEW_VOTE_CHOICES = (
    ('U', 'Up-vote'),
    ('D', 'Down-vote')
)

class ReviewVote(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    review = models.ForeignKey(Review, on_delete=models.CASCADE)
    review_vote = models.CharField(max_length=1, choices=REVIEW_VOTE_CHOICES)

    class Meta:
        unique_together = ('user', 'review')

    def __str__(self):
        return f'Review Vote #: {self.pk}'