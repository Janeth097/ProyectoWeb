from django import forms
from .models import Tweet


class TweetModelForm(forms.ModelForm):
    content = forms.CharField(
        label='Tweet: ',
        widget=forms.Textarea(
            attrs={
                'placeholder': 'Que paso hoy?',
                'class': ''
            }
        )
    )

    class Meta:
        model = Tweet
        fields = [
            'content'
        ]
