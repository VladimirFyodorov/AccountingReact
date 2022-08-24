from datetime import date

from django.shortcuts import render
from django.urls import reverse
from django.http import HttpResponseRedirect
from django.contrib.auth import get_user_model

##### API
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import BillSerializer, ItemSerializer, Item_PaymentSerializer, UserSerializer
from rest_framework import status
from django.http.response import JsonResponse

from .models import Bill, Item, Item_Payment

# Create your views here.
def index(request, id = None):
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse('users:login'))
    
    bill_id = id
    acc_user = request.user
    other_users = get_user_model().objects.exclude(id = acc_user.id)

    return render(request, 'bills/index.html', {
            'acc_user': acc_user,
            'first_name_first_letter': acc_user.first_name[0],
            'last_name_first_letter': acc_user.last_name[0],
            'other_users': other_users,
            'bill_id': bill_id
        })



########################### APIs ###########################
############################################################

@api_view(['GET'])
def get_bills(request):

    not_payed_bills = []
    for bill in Bill.objects.order_by('-id'):
        if not bill.is_payed:
            serializedBill = BillSerializer(bill).data

            lender = get_user_model().objects.get(id = serializedBill["lender"])
            serializedBill["lender"] = UserSerializer(lender).data

            items = Item.objects.filter(bill = bill).all()
            serializedBill["items"] = ItemSerializer(items, many = True).data

            def getLayout(withID = False):
                if withID:
                    # making empty user dictionary
                    # {"first_name": {"id", "amount",  "share", "is_payed"}}
                    layout = {}
                    for user in get_user_model().objects.all():
                        layout[user.first_name] = {"id": 0
                                                , "amount": 0
                                                , "share": 0
                                                , "is_payed": "False"}
                    return layout  

                else:
                    # making empty user dictionary
                    # {"first_name": {"amount",  "share", "is_payed"}}
                    layout = {}
                    for user in get_user_model().objects.all():
                        layout[user.first_name] = {"amount": 0, "share": 0, "is_payed": "True"}
                    return layout


            def transform(dic, withID = False):
                if withID:
                    # transforming 
                    # from {"name": {"id", "amount",  "share", "is_payed"}}
                    # to [{"id", "name", "amount", "share", "is_payed"}, {}]
                    dic_T = []

                    for user in get_user_model().objects.all():
                        obj = {"name": user.first_name}
                        obj["id"] = dic[user.first_name]["id"]
                        obj["amount"] = round(dic[user.first_name]["amount"])
                        obj["share"] = round(dic[user.first_name]["share"], 2)
                        obj["is_payed"] = dic[user.first_name]["is_payed"]
                        dic_T.append(obj)
                    
                    return dic_T

                else:
                    # transforming 
                    # from {"name": {"amount",  "share", "is_payed"}}
                    # to [{"name", "amount", "share", "is_payed"}, {}]
                    dic_T = []

                    for user in get_user_model().objects.all():
                        obj = {"name": user.first_name}
                        obj["amount"] = round(dic[user.first_name]["amount"])
                        obj["share"] = round(dic[user.first_name]["share"], 2)
                        obj["is_payed"] = dic[user.first_name]["is_payed"]
                        dic_T.append(obj)
                    
                    return dic_T
            

                        
            payments_total = getLayout()

            for i in range(len(items)):
                item = items[i]

                # need that to not miss total sum and total share
                item_cost = item.cost_total
                item_share = 1

                payments = Item_Payment.objects.filter(item_id = item.id).all()

                payments_in_item = getLayout(withID = True)

                #calculating amounts
                for payment in payments:
                    payerFistName = get_user_model().objects.get(id = payment.payer.id).first_name
                    # calculation for total
                    payments_total[payerFistName]["amount"] += payment.paying_amount

                    if not payment.is_payed:
                        payments_total[payerFistName]["is_payed"] = "False"
                    
                    if payment.is_payed:
                        payments_in_item[payerFistName]["is_payed"] = "True"

                    # calculation for dic
                    if payments_in_item[payerFistName]["id"] == 0:
                        payments_in_item[payerFistName]["id"] = payment.id
                    else:
                        payments_in_item[payerFistName]["id"] = 'multiple ids'
                    payments_in_item[payerFistName]["amount"] += payment.paying_amount
                    payments_in_item[payerFistName]["share"] += payment.paying_part

                    # for both
                    item_cost -= payment.paying_amount
                    item_share -= payment.paying_part

                
                #adding difference to lender
                payments_total[lender.first_name]["amount"] += item_cost
                payments_in_item[lender.first_name]["amount"] += item_cost
                payments_in_item[lender.first_name]["share"] += item_share

                # adding dic to item object
                serializedBill["items"][i]["payments"] = transform(payments_in_item, withID = True)



            #adding final dictionary to bill object
            serializedBill["payments_total"] = transform(payments_total)

            # adding bill object to list of bills
            not_payed_bills.append(serializedBill)

    return Response(not_payed_bills)


@api_view(['GET'])
def get_all_users(request):
    return Response(UserSerializer(get_user_model().objects.all(), many=True).data)

# --------- BILL -------------

# https://www.bezkoder.com/django-rest-api/
@api_view(['POST', 'PUT', 'DELETE'])
def api_bill(request):
    if request.method == 'POST':
        bill_data = request.data
        bill_serializer = BillSerializer(data=bill_data)
        if bill_serializer.is_valid():
            bill_serializer.save()
            return JsonResponse(bill_serializer.data, status=status.HTTP_201_CREATED) 
        return JsonResponse(bill_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    bill_data = request.data
    bill_id = bill_data["id"]

    try: 
        bill = Bill.objects.get(id = bill_id) 
    except Bill.DoesNotExist:
        return JsonResponse({'message': 'The bill does not exist'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE': 
        bill.delete()
        return JsonResponse(BillSerializer(bill).data, status=status.HTTP_204_NO_CONTENT)
    
    if request.method == 'PUT': 
        bill_serializer = BillSerializer(bill, data=bill_data) 
        if bill_serializer.is_valid():
            bill_serializer.save()
            return JsonResponse(bill_serializer.data) 
        return JsonResponse(bill_serializer.errors, status=status.HTTP_400_BAD_REQUEST) 




@api_view(['POST', 'PUT', 'DELETE'])
def api_item(request):
    if request.method == 'POST':
        item_data = request.data
        item_serializer = ItemSerializer(data=item_data)

        if item_serializer.is_valid():
            item_serializer.save()
            return JsonResponse(item_serializer.data, status=status.HTTP_201_CREATED) 
        return JsonResponse(item_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    item_data = request.data
    item_id = item_data["id"]
    try: 
        item = Item.objects.get(id = item_id) 
    except Item.DoesNotExist:
        return JsonResponse({'message': 'The item does not exist'}, status=status.HTTP_404_NOT_FOUND) 

    if request.method == 'DELETE': 
        item.delete()
        return JsonResponse(ItemSerializer(item).data, status=status.HTTP_204_NO_CONTENT)
    
    if request.method == 'PUT':
        item_serializer = ItemSerializer(item, data=item_data) 
        if item_serializer.is_valid():
            item_serializer.save()
            return JsonResponse(item_serializer.data) 
        return JsonResponse(item_serializer.errors, status=status.HTTP_400_BAD_REQUEST) 




@api_view(['POST', 'PUT', 'DELETE'])
def api_payment(request):

    def hasDubblePayments(item, payer):
        payments = Item_Payment.objects.filter(item = item).filter(payer = payer).all()
        return True if payments else False
    
    
    def deleteDubblePayments(item, payer):
        Item_Payment.objects.filter(item = item).filter(payer = payer).delete()


    if request.method == 'POST':
        payment_data = request.data
        payment_serializer = Item_PaymentSerializer(data=payment_data)

        if payment_serializer.is_valid():
            if not hasDubblePayments(payment_data["item"], payment_data["payer"]):
                payment_serializer.save()
                return JsonResponse(payment_serializer.data, status=status.HTTP_201_CREATED)
            else:
                deleteDubblePayments(payment_data["item"], payment_data["payer"])
                payment_serializer.save()
                return JsonResponse(payment_serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(payment_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    payment_data = request.data
    payment_id = payment_data["id"]

    if payment_id != 'multiple ids':
        try: 
            payment = Item_Payment.objects.get(id = payment_id) 
        except Item_Payment.DoesNotExist:
            return JsonResponse({'message': 'The share does not exist'}, status=status.HTTP_404_NOT_FOUND) 

        if request.method == 'PUT':
            payment_serializer = Item_PaymentSerializer(payment, data=payment_data)
            if payment_serializer.is_valid():
                payment_serializer.save()
                return JsonResponse(payment_serializer.data) 
            return JsonResponse(payment_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    else:
        payment_serializer = Item_PaymentSerializer(data=payment_data)

        if payment_serializer.is_valid():
            if not hasDubblePayments(payment_data["item"], payment_data["payer"]):
                payment_serializer.save()
                return JsonResponse(payment_serializer.data, status=status.HTTP_201_CREATED)
            else:
                deleteDubblePayments(payment_data["item"], payment_data["payer"])
                payment_serializer.save()
                return JsonResponse(payment_serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(payment_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # shares are deleted only by deleting Item therefore we don't need special API for this 
    # if request.method == 'DELETE': 
    #     payment.delete()
    #     return JsonResponse(Item_PaymentSerializer(payment).data, status=status.HTTP_204_NO_CONTENT)