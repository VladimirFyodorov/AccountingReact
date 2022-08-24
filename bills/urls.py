from django.urls import path
from . import views

app_name = 'bills'
urlpatterns = [
    path('', views.index, name='index'),
    path('<int:id>', views.index, name='index_with_id'),
    path('api/get_bills', views.get_bills, name='api_get_bills'),
    path('api/get_all_users', views.get_all_users, name='api_get_all_users'),
    path('api/bill', views.api_bill, name='api_bill'),
    path('api/item', views.api_item, name='api_item'),
    path('api/payment', views.api_payment, name='api_payment')
]