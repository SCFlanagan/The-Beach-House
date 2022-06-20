from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html')),
    re_path('(^(?!(api|admin|static|images)).*$)',
        TemplateView.as_view(template_name="index.html")),
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/products/', include('products.urls')),
    path('api/reviews/', include('reviews.urls')),
    path('api/cart/', include('carts.urls')),
    path('api/promocodes/', include('promocodes.urls')),
    path('api/favoritelists/', include('favoritelists.urls')),
    path('api/profile/', include('profiles.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/contacts/', include('contacts.urls'))
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.MEDIA_ROOT)
