from django.urls import path
from . import views

app_name = 'users'
urlpatterns = [
    # path('', views.index, name='index'),
    # path('login', views.login_view, name='login'),
    # path('logout', views.logout_view, name='logout'),
    path('check_email', views.check_email, name='api_check_email'),
    path('login', views.api_login, name='api_login'),
    path('logout', views.api_logout, name='api_logout'),
    path('get_user', views.get_user, name='api_get_user'),
    path('get_account_data', views.get_account_data, name='api_get_account_data'),
    path('close_settlements', views.close_settlements, name='api_close_settlements')
]