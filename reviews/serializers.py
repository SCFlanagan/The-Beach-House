from rest_framework import serializers
from products.serializers import ProductSerializer
from .models import Review, ReviewVote

class ReviewSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    class Meta:
        model = Review
        fields = ['id', 'rating', 'title', 'comment', 'user_name', 'user', 'up_votes', 'down_votes', 'product', 'date_created']


class ReviewVoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewVote
        fields = '__all__'