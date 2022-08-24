from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout, get_user_model
from bills.models import Bill, Item, Item_Payment

##### API
from rest_framework.response import Response
from rest_framework.decorators import api_view
from bills.serializers import BillSerializer, ItemSerializer, Item_PaymentSerializer, UserSerializer
from rest_framework import status
from django.http.response import JsonResponse

## custom libs
import python_libs.send_email as se

# Create your views here.
# clean terminal print("\033[H\033[J", end="")
def index(request):

    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse('users:login'))

    acc_user = request.user
    other_users = get_user_model().objects.exclude(id = acc_user.id)

    return render(request, 'users/account.html', {
            'user': acc_user,
            'acc_user': acc_user,
            'other_users': other_users,
            'first_name_first_letter': acc_user.first_name[0],
            'last_name_first_letter': acc_user.last_name[0],
        })




def login_view(request):
    if request.method == 'POST' and len(request.POST['password']) == 0:
            emails = get_user_model().objects.values_list('email', flat=True).all()
            email = request.POST['email']
            if email in emails:
                user = get_user_model().objects.get(email = email)
                first_name = user.first_name
                last_name = user.last_name
                return render(request, 'users/login.html', {
                    'first_name': first_name,
                    'first_name_first_letter': first_name[0],
                    'last_name': last_name,
                    'last_name_first_letter': last_name[0],
                    'email': email,
                    'form_numer': 2,
                })
            else:
                return render(request, 'users/login.html', {
                    'form_numer': 1,
                    'message': 'incorrect email'
                })
    elif request.method == 'POST' and len(request.POST['password']) > 0:
        email = request.POST['email']
        password = request.POST['password']
        username = get_user_model().objects.get(email = email).username
        first_name =  get_user_model().objects.get(email = email).first_name
        last_name =  get_user_model().objects.get(email = email).last_name
        user = authenticate(request, username = username, password = password)

        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse('users:index'))

        else:
            return render(request, 'users/login.html', {
            'first_name': first_name,
            'first_name_first_letter': first_name[0],
            'last_name': last_name,
            'last_name_first_letter': last_name[0],
            'email': email,
            'form_numer': 2,
            'message': f'Email or Password is incorrect'
            })


    return render(request, 'users/login.html', {
        'form_numer': 1
    })



def logout_view(request):
    logout(request)
    return render(request, 'users/login.html')



########################### APIs ###########################
############################################################

@api_view(['PUT'])
def check_email(request):
    email = request.data["email"]

    for user in get_user_model().objects.all():
        if user.email == email:
            return Response(UserSerializer(user).data)
    
    return JsonResponse({'message': 'Incorrect email'})


@api_view(['PUT'])
def api_login(request):
    username = request.data["username"]
    password = request.data["password"]
    user = authenticate(request, username = username, password = password)

    if user is not None:
        login(request, user)
        return JsonResponse({'message': 'Logged in'})
    
    return JsonResponse({'message': 'Not logged'})


@api_view(['GET'])
def get_account_data(request):

    this_user = request.user


    def getLayout():
        # making empty user dictionary
        # {"user_id": {"amount":, bills: [{bill_id, bill_name, bill_date, items_preview}]}}
        layout = {}
        for user in get_user_model().objects.exclude(id = this_user.id).all():
            layout[user.id] = {"total": 0, "bills":[]}
        return layout
    

    def getUsersDic():
        # making empty user dictionary
        # {"user_id": {"amount":}}
        layout = {}
        for user in get_user_model().objects.exclude(id = this_user.id).all():
            layout[user.id] = {"total": 0}
        return layout
    

    def getItemTotalByUserDic():
        layout = {}
        for user in get_user_model().objects.exclude(id = this_user.id).all():
            layout[user.id] = {"name": '', "cost_per_item": 0, "items": 0, "share": 0, "paying_amount": 0,}
        return layout


    def transform(dic):
        # transforming 
        # from {"user_id": {"amount"}}
        # to [{"user_id":, "first_name":, "amount"}:, {}]
        dic_T = []

        for user in get_user_model().objects.exclude(id = this_user.id).all():
            obj = {"id": user.id}
            obj["name"] = user.first_name
            obj["total"] = round(dic[user.id]["total"])
            obj["bills"] = dic[user.id]["bills"]
            #obj["items"] = dic[user.id]["items"] #[user.id]
            dic_T.append(obj)
        
        return dic_T
    
    # making list [{"contAgent", "Amount"}, {}]
    json = getLayout()

    for bill in Bill.objects.filter(lender = this_user).all():
        serializedBill = BillSerializer(bill).data
        items_preview = ''
        items = []
        bill_total_by_user = getUsersDic()
        for item in Item.objects.filter(bill = bill).all():
            items_preview += item.name + ', '
            item_total_by_user = getItemTotalByUserDic()
            for payment in Item_Payment.objects.filter(item = item).exclude(payer = this_user).filter(is_payed = False).filter(paying_part__gt = 0).all():
                json[payment.payer.id]["total"] += payment.paying_amount
                bill_total_by_user[payment.payer.id]["total"] += payment.paying_amount

                item_total_by_user[payment.payer.id]["name"] = item.name
                item_total_by_user[payment.payer.id]["cost_per_item"] = item.cost_per_exemplar
                item_total_by_user[payment.payer.id]["items"] = item.amount
                item_total_by_user[payment.payer.id]["share"] += payment.paying_part
                item_total_by_user[payment.payer.id]["paying_amount"] += payment.paying_amount
            
            items.append(item_total_by_user)

        # remove last coma and space
        items_preview = items_preview[:len(items_preview) - 2]
        # saving only 30 characters
        items_preview = items_preview[:27] + '...' if len(items_preview) > 30 else items_preview
        serializedBill["items_preview"] = items_preview
        
        for user in get_user_model().objects.exclude(id = this_user.id).all():
            serializedBillCopy = serializedBill.copy()
            serializedBillCopy["total"] = round(bill_total_by_user[user.id]["total"])
            serializedBillCopy["items"] = [d[user.id] for d in items if d[user.id]["paying_amount"] != 0]
            json[user.id]["bills"].append(serializedBillCopy)


    for bill in Bill.objects.exclude(lender = this_user).all():
        serializedBill = BillSerializer(bill).data
        items_preview = ''
        items = []
        bill_total_by_user = getUsersDic()
        for item in Item.objects.filter(bill = bill).all():
            items_preview += item.name + ', '
            item_total_by_user = getItemTotalByUserDic()
            for payment in Item_Payment.objects.filter(item = item).filter(payer = this_user).filter(is_payed = False).filter(paying_part__gt = 0).all():
                json[bill.lender.id]["total"] -= payment.paying_amount
                bill_total_by_user[bill.lender.id]["total"]-= payment.paying_amount

                item_total_by_user[bill.lender.id]["name"] = item.name
                item_total_by_user[bill.lender.id]["cost_per_item"] = item.cost_per_exemplar
                item_total_by_user[bill.lender.id]["items"] = item.amount
                item_total_by_user[bill.lender.id]["share"] += payment.paying_part
                item_total_by_user[bill.lender.id]["paying_amount"] -= payment.paying_amount
            
            items.append(item_total_by_user)

        # remove last coma and space
        items_preview = items_preview[:len(items_preview) - 2]
        # saving only 30 characters
        items_preview = items_preview[:27] + '...' if len(items_preview) > 30 else items_preview
        serializedBill["items_preview"] = items_preview
        
        for user in get_user_model().objects.exclude(id = this_user.id).all():
            serializedBillCopy = serializedBill.copy()
            serializedBillCopy["total"] = round(bill_total_by_user[user.id]["total"])
            serializedBillCopy["items"] = [d[user.id] for d in items if d[user.id]["paying_amount"] != 0]
            json[user.id]["bills"].append(serializedBillCopy)


    # sort bills
    for user in get_user_model().objects.exclude(id = this_user.id).all():
        # filter null values
        json[user.id]["bills"] = [d for d in json[user.id]["bills"] if d["total"] != 0]
        # sort values
        json[user.id]["bills"] = sorted(json[user.id]["bills"], key=lambda d: -abs(d["total"]))

    return Response(transform(json))



@api_view(['PUT'])
def close_settlements(request):
    user = request.user
    counteragent_id = request.data["counteragentId"]


    try:
        counteragent = get_user_model().objects.get(id = counteragent_id)
    except get_user_model().DoesNotExist:
        return JsonResponse({'message': 'The user does not exist'}, status=status.HTTP_404_NOT_FOUND)
    
    total = 0
    # total_lst = []

    for bill in Bill.objects.filter(lender = user).all():
        for item in Item.objects.filter(bill = bill).all():
            for payment in Item_Payment.objects.filter(item = item).filter(payer = counteragent).filter(is_payed = False).filter(paying_part__gt = 0).all():
                total += payment.paying_amount
                # total_lst.append([payment.id, payment.paying_amount])
                Item_Payment.objects.filter(id = payment.id).update(is_payed = True)

    for bill in Bill.objects.filter(lender = counteragent).all():
        for item in Item.objects.filter(bill = bill).all():
            for payment in Item_Payment.objects.filter(item = item).filter(payer = user).filter(is_payed = False).filter(paying_part__gt = 0).all():
                total -= payment.paying_amount
                # total_lst.append([payment.id, -payment.paying_amount])
                Item_Payment.objects.filter(id = payment.id).update(is_payed = True)
    
    # sending email
    # test mode se.send_emails(user, counteragent, total, total_lst, True)
    se.send_emails(user, counteragent, total)

    return JsonResponse({'message': 'Mutual settlements are successfully closed'}, status=status.HTTP_200_OK) 


