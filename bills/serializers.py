from rest_framework import serializers
from bills.models import Bill, Item, Item_Payment
from django.contrib.auth import get_user_model



class BillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bill
        fields = '__all__'



class ItemSerializer(serializers.ModelSerializer):
    amount = serializers.IntegerField(min_value = 0)
    cost_per_exemplar = serializers.IntegerField(min_value = 0)
    class Meta:
        model = Item
        fields = '__all__'



class Item_PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item_Payment
        fields = '__all__'



class UserSerializer(serializers.ModelSerializer):
    # for methods
    # expired = serializers.Field(source='has_expired')

    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'first_name', 'last_name', 'email')
