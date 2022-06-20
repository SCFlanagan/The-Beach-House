from django.urls import path
from .views import get_review, create_review, update_review, delete_review, create_review_vote, get_review_vote

app_name = 'reviews'

urlpatterns = [
    path('<int:review_id>/', get_review, name='get_review'),
    path('<int:product_id>/create/', create_review, name='create_review'),  
    path('<int:review_id>/update/', update_review, name='update_review'),  
    path('<int:review_id>/delete/', delete_review, name='delete_review'),
    path('<int:review_id>/vote/', get_review_vote, name='get_review_vote'),
    path('<int:review_id>/vote/create/', create_review_vote, name="create_review_vote")
]