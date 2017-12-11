from rest_framework import generics, permissions
from django.db.models import Q
from Tweets.models import Tweet
from .serializers import TweetModelSerializer
from .pagination import StandardResultPagination


class TweetCreateAPIView(generics.CreateAPIView):
    serializer_class = TweetModelSerializer
    permission_classes = [permissions.IsAuthenticated]

    def preform_create(self, serializer):
        serializer.save()


class TweetListAPIView(generics.ListAPIView):
    serializer_class = TweetModelSerializer
    pagination_class = StandardResultPagination

    def get_queryset(self, *args, **kwargs):
        qs = Tweet.objects.all().order_by("-created")
        query = self.request.GET.get("q", None)
        if query is not None:
            qs = qs.filter(
                Q(content__icontains=query) |
                Q(user__username__icontains=query)
            )
        return qs
