from django.urls import path
from .views import UserListAPIView

app_name = 'userappV2'
urlpatterns = [
    path('', UserListAPIView.as_view()),
]
