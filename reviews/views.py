from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import ReviewSerializer, ReviewVoteSerializer
from .models import Review, ReviewVote
from products.models import Product
from rest_framework import status

# api/reviews/:review_id
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_review(request, review_id):
    try:
        review = Review.objects.select_related('product').get(id=review_id)
        if review.user != request.user:
            detail = {'message': 'You can not view another user\'s review.'}
            return Response(detail, status=status.HTTP_401_UNAUTHORIZED)
        else:
            serializer = ReviewSerializer(review)
            return Response(serializer.data)
    except Exception as e:
        detail = repr(e)
        return Response(detail, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
      
# api/reviews/:product_id/create
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        data = request.data
        reviewExists = product.review_set.filter(user=request.user).exists()
        if reviewExists:
            detail = {'message': 'You have already reviewed this product.'}
            return Response(detail, status=status.HTTP_400_BAD_REQUEST)
        elif data['rating'] == 0:
            detail = 'You must select a rating 1 through 5.'
            return Response(detail, status=status.HTTP_400_BAD_REQUEST)
        else: 
            review = Review.objects.create(
                user = request.user,
                user_name = data['user_name'],
                product = product,
                rating = data['rating'],
                title = data['title'],
                comment = data['comment'],
            )
            serializer = ReviewSerializer(review)
            return Response(serializer.data)        
    except Exception as e:
        detail = repr(e)
        return Response(detail, status=status.HTTP_400_BAD_REQUEST)

# api/reviews/:product_id/update/
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_review(request, review_id):
    try:
        data = request.data
        if data['rating'] == 0:
            detail = 'You must select a rating 1 through 5.'
            return Response(detail, status=status.HTTP_400_BAD_REQUEST)
        else: 
            review = Review.objects.get(id=review_id)
            review.rating = data['rating']
            review.title = data['title']
            review.comment = data['comment']
            review.save()
            serializer = ReviewSerializer(review, many=False)
            return Response(serializer.data)        
    except Exception as e:
        detail = repr(e)
        return Response(detail, status=status.HTTP_400_BAD_REQUEST)

# api/reviews/:product_id/delete/
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_review(request, review_id):
    try:
        review = Review.objects.get(id=review_id)
        if review.user == request.user:
            review.delete()
            return Response('Review Deleted')
        else:
            detail = "You can not delete another user's review."
            return Response(detail, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        detail = repr(e)
        return Response(detail, status=status.HTTP_404_NOT_FOUND)


# Review Vote Routes

# api/reviews/:review_id/vote/create
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review_vote(request, review_id):
    try:
        review = Review.objects.get(id=review_id)
        data = request.data
        if review.user == request.user:
            detail = 'You can not rate your own review.'
            return Response(detail, status=status.HTTP_400_BAD_REQUEST)
        else:
            voteExists = review.reviewvote_set.filter(user=request.user, review=review.id).exists()
            vote = {}
            if voteExists:
                vote = ReviewVote.objects.get(user=request.user, review=review)
                vote.review_vote = data['review_vote']
                vote.save()
            else: 
                vote = ReviewVote.objects.create(
                    user = request.user,
                    review = review,
                    review_vote = data['review_vote'],
                )
            serializer = ReviewVoteSerializer(vote)
            return Response(serializer.data)        
    except Exception as e:
        detail = repr(e)
        return Response(detail, status=status.HTTP_400_BAD_REQUEST)

# api/reviews/:review_id/vote/
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_review_vote(request, review_id):
    try:
        reviewVotes = ReviewVote.objects.filter(review=review_id, user=request.user)
        if len(reviewVotes) > 0:
            serializer = ReviewVoteSerializer(reviewVotes[0])
            return Response(serializer.data)
        else:
            return Response({})
    except Exception as e:
        detail = repr(e)
        return Response(detail, status=status.HTTP_500_INTERNAL_SERVER_ERROR)