from django.urls import path
from models import views
from django.conf.urls import url

urlpatterns = [
    url(r'^$', views.room, name="index"),
    path('thanks/', views.thanks),
]


