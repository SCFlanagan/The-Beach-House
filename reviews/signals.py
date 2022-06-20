from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Review, ReviewVote
from products.models import Product


@receiver(post_save, sender=Review)
def updateProductOnSave(sender, instance, **kwargs):
    review = instance
    review.product.update_review_summary()
    
@receiver(post_delete, sender=Review)
def updateProductOnDelete(sender, instance, **kwargs):
    review = instance
    review.product.update_review_summary()



@receiver(post_save, sender=ReviewVote)
def updateVotesOnSave(sender, instance, **kwargs):
    review_vote = instance
    review_vote.review.update_votes()

@receiver(post_delete, sender=ReviewVote)
def updateVotesOnDelete(sender, instance, **kwargs):
    review_vote = instance
    review_vote.review.update_votes()
