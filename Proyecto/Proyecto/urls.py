"""Proyecto URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from Accounts.views import UserRegisterView
from Tweets.views import (
    detail_view, TweetCreateView, TweetDeleteView, TweetUpdateView, home,
    TweetListView, logout_view
)

urlpatterns = [
    url(r'^$', home, name='homepage'),
    url(r'^tweet/create$', TweetCreateView.as_view(), name='tweet-create'),
    url(r'^tweet/detail/(?P<id>\d+)/$', detail_view,
        name='tweet-detail'
        ),
    url(r'^tweet/detail/(?P<pk>\d+)/delete$', TweetDeleteView.as_view(),
        name='tweet-delete'
        ),
    url(r'^tweet/detail/(?P<pk>\d+)/update$', TweetUpdateView.as_view(),
        name='tweet-detail'
        ),
    url(r'^accounts/profile/$', TweetListView.as_view(), name='tweet-list'),
    url(r'^accounts/register/$', UserRegisterView.as_view(), name='register'),
    url(r'^api/tweet/', include('Tweets.API.urls', namespace='tweet-api')),
    url(r'^', include('django.contrib.auth.urls')),
    url(r'^close/', logout_view, name='logout-user'),
    url(r'^admin/', admin.site.urls),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
