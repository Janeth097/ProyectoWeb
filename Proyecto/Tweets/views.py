# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render
from django.db.models import Q
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import (
    DetailView, ListView, CreateView, UpdateView, DeleteView
)
from django.contrib.auth import logout
from .forms import TweetModelForm
from .models import Tweet
from .mixin import FormUserNeededMixin
# Create your views here.


def logout_view(request):
    return render(logout(request), 'home.html')


def home(request):
    tweets_lista = Tweet.objects.all()
    return render(request, 'home.html', context={"tweets": tweets_lista})


def detail_view(request, id=10):
    result_set = Tweet.objects.get(id=id)
    context = {
        "result": result_set
    }
    return render(request, 'Tweets/detail_view.html', context)


class TweetCreateView(LoginRequiredMixin, FormUserNeededMixin, CreateView):
    form_class = TweetModelForm
    template_name = 'Tweets/create_view.html'
    success_url = '/accounts/profile'
    login_url = '/login'


class TweetUpdateView(LoginRequiredMixin, FormUserNeededMixin, UpdateView):
    queryset = Tweet.objects.all()
    form_class = TweetModelForm
    template_name = 'Tweets/update_view.html'
    success_url = '/accounts/profile'
    login_url = '/login'


class TweetDeleteView(LoginRequiredMixin, FormUserNeededMixin, DeleteView):
    model = Tweet
    template_name = 'Tweets/delete_confirm.html'
    success_url = reverse_lazy('tweet-list')


class TweetDetailView(DetailView):
    template_name = 'Tweets/detail_view.html'
    queryset = Tweet.objects.all()

    def get_object(self):
        id = self.kwargs.get("id")
        print id
        return Tweet.objects.get(id=id)

    def get_context_data(self, *args, **kwargs):
        context = super(
            TweetDetailView, self).get_context_data(*args, **kwargs)
        return context


class TweetListView(ListView):
    template_name = 'Tweets/list_ajax.html'

    def get_queryset(self, *args, **kwargs):
        qs = Tweet.objects.all()
        query = self.request.GET.get("q", None)
        if query is not None:
            qs = qs.filter(
                Q(content__icontains=query) |
                Q(user__username__icontains=query)
            )
        return qs

    def get_context_data(self, *args, **kwargs):
        context = super(TweetListView, self).get_context_data(*args, **kwargs)
        context['create_form'] = TweetModelForm()
        context['create_url'] = reverse_lazy('tweet-create')
        return context
