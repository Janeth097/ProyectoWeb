from django.conf.urls import url
from .views import TweetListAPIView, TweetCreateAPIView

urlpatterns = [
    url(r'^$', TweetListAPIView.as_view(), name='tweet-api-list'),
    url(r'^create/', TweetCreateAPIView.as_view(), name='tweet-api-create'),
]
