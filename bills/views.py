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
            return JsonResponse(bill_serializer.data, status=status.HTTP_200_OK) 
        return JsonResponse(bill_serializer.errors, status=status.HTTP_400_BAD_REQUEST) 




@api_view(['POST', 'PUT', 'DELETE'])
def api_payment(request):
    items_data = request.data
    response = []

    if request.method == 'POST':
        for item_data in items_data:
            try: #serializer.is_valid() not always can catch errors
                item_serializer = ItemSerializer(data=item_data)

                if item_serializer.is_valid():
                    item_serializer.save()
                    response.append({'item':item_serializer.data, 'status':200})
                else:
                    response.append({'item':item_data, 'status':400})
            except:
                response.append({'item':item_data, 'status':400})
        
        return JsonResponse({'response': response}, status=status.HTTP_200_OK) 


    if request.method == 'PUT':
        for item_data in items_data:
            item_id = item_data["id"]
            try: 
                item = Item.objects.get(id = item_id)
                item_serializer = ItemSerializer(item, data=item_data) 

                if item_serializer.is_valid():
                    item_serializer.save()
                    response.append({'item':item_serializer.data, 'status':200})
                else:
                    response.append({'item':item_data, 'status':400})
            except Item.DoesNotExist:
                response.append({'item':item_data, 'status':400})

        return JsonResponse({'response': response}, status=status.HTTP_200_OK) 


    if request.method == 'DELETE':
        for item_data in items_data:
            item_id = item_data["id"]
            try: 
                item = Item.objects.get(id = item_id)
                item_serializer = ItemSerializer(item)
                item.delete()
                response.append({'item':item_serializer.data, 'status':200})
            except Item.DoesNotExist:
                response.append({'item':item_data, 'status':400})
                
        return JsonResponse({'response': response}, status=status.HTTP_200_OK) 



@api_view(['POST', 'PUT', 'DELETE'])
def api_share(request):

    def alreadyHasPayment(item, payer):
        payments = Item_Payment.objects.filter(item = item).filter(payer = payer).all()
        return True if payments else False
    

    def hasMoreThanOnePayments(item, payer):
        payments = Item_Payment.objects.filter(item = item).filter(payer = payer).count()
        return True if payments > 1 else False

    
    def deleteAllPayments(item, payer):
        Item_Payment.objects.filter(item = item).filter(payer = payer).delete()

    paymens_data = request.data
    response = []

    if request.method == 'POST':
        for payment_data in paymens_data:
            
            try:
                payment_serializer = Item_PaymentSerializer(data=payment_data)

                if payment_serializer.is_valid():
                    if not alreadyHasPayment(payment_data["item"], payment_data["payer"]):
                        payment_serializer.save()
                        response.append({'payment':payment_serializer.data, 'status':200})

                    else:
                        deleteAllPayments(payment_data["item"], payment_data["payer"])
                        payment_serializer.save()
                        response.append({'payment':payment_serializer.data, 'status':200})
                else:
                    response.append({'exitPoint':1, 'payment':payment_data, 'status':400})
            except:
                response.append({'exitPoint':2, 'payment':payment_data, 'status':400})

        return JsonResponse({'response': response}, status=status.HTTP_200_OK) 


    if request.method == 'PUT':
        for payment_data in paymens_data:
            try:
                # dealing with multiple payments per user
                payment_serializer = Item_PaymentSerializer(data=payment_data)
                if payment_serializer.is_valid():
                    if not hasMoreThanOnePayments(payment_data["item"], payment_data["payer"]):

                        payment_id = payment_data["id"]
                        payment = Item_Payment.objects.get(id = payment_id)
                        payment_serializer = Item_PaymentSerializer(payment, data=payment_data)

                        if payment_serializer.is_valid():
                            payment_serializer.save()
                            response.append({'payment':payment_serializer.data, 'status':200})
                        else:
                            response.append({'payment':payment_data, 'status':400})

                    else: # more than one payment per user => replace duplicates
                        deleteAllPayments(payment_data["item"], payment_data["payer"])
                        payment_serializer.save()
                        response.append({'payment':payment_serializer.data, 'status':200})
                else:
                    response.append({'payment':payment_data, 'status':400})
            except:
                response.append({'payment':payment_data, 'status':400})
        return JsonResponse({'response': response}, status=status.HTTP_200_OK) 


    # shares are deleted only by deleting Payment therefore we don't need special API for this 
    # if request.method == 'DELETE': 
    #     payment.delete()
    #     return JsonResponse(Item_PaymentSerializer(payment).data, status=status.HTTP_204_NO_CONTENT)