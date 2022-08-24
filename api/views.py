from rest_framework.response import Response
from rest_framework.decorators import api_view
from bills.models import  Bill, Item, Item_Payment
from .serializers import BillSerializer

@api_view(['GET'])
def getData(request):
    bills = Bill.objects.all()
    serializer = BillSerializer(bills, many=True)
    return Response(serializer.data)
