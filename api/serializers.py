from rest_framework import serializers
from bills.models import Bill, Item, Item_Payment

class BillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bill
        fields = '__all__'
