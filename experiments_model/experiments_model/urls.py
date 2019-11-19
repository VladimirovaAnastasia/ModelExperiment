from django.contrib import admin
from django.shortcuts import render
from django.urls import path
from models import views
from django.conf.urls import url

urlpatterns = [

    #path('', views.index, name='home'),
    #path('admin/', admin.site.urls),
    url(r'^$', views.index, name="index"),
    path('thanks/', views.thanks),
    #path('data/', views.data_of_experiment)

]


