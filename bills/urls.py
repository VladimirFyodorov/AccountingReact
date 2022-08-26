from django.urls import path
from . import views

app_name = 'bills'
urlpatterns = [
    # path('', views.index, name='index'),
    # path('<int:id>', views.index, name='index_with_id'),
    path('get_bills', views.get_bills, name='api_get_bills'),
    path('get_all_users', views.get_all_users, name='api_get_all_users'),
    path('bill', views.api_bill, name='api_bill'),
    path('item', views.api_item, name='api_item'),
    path('payment', views.api_payment, name='api_payment')
]