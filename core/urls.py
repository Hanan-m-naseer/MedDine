from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('register/', views.register, name='register'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.logout_view, name='logout'),

    path('today-meal/', views.today_meal, name='today_meal'),
    path('edit-diseases/', views.edit_diseases, name='edit_diseases'),
   path('healthymealplans/', views.healthy_meal_plans, name='healthymealplans'),


]
