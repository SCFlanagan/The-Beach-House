from django.apps import AppConfig


class ReviewsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'reviews'

    def ready(self):
        import reviews.signals


class ReviewVotesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'reviewvotes'

    def ready(self):
        import reviews.signals