from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator, MinValueValidator


# Create your models here.
class Bill(models.Model):
    CURRENCIES = [
        ('RUB', 'Russian rubble'),
        ('USD', 'US dollar'),
        ('EUR', 'Euro'),
        ('KZT', 'Kazakhstani tenge'),
    ]
    name = models.CharField(max_length=50)
    date = models.DateField()
    comment = models.CharField(max_length=500, blank=True)
    lender = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='lender', editable = True, blank=True)
    currency = models.CharField(max_length=3, choices=CURRENCIES, default='RUB')
    
    def _is_payed(self):
        "Returns true if it has payments and all payments are payed"
        all_items = Item.objects.filter(bill = self).all()
        All_not_null_payments = Item_Payment.objects.filter(item__in = all_items).exclude(paying_part = 0.0).exclude(payer = self.lender).count()
        Unpayed_not_null_payments = Item_Payment.objects.filter(item__in = all_items).exclude(paying_part = 0.0).exclude(payer = self.lender).filter(is_payed = False).count()

        if All_not_null_payments > 0 and Unpayed_not_null_payments == 0:
            return True
        else:
            return False
    
    is_payed = property(_is_payed)
    
    def __str__(self):
        return f'{self.name} {self.date}' #: {self.cost_total}rub'



class Item(models.Model):
    name = models.CharField(max_length=500)
    amount = models.PositiveIntegerField()
    cost_per_exemplar = models.PositiveIntegerField()
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE, related_name='items')


    def _get_cost_total(self):
        return self.amount*self.cost_per_exemplar
    
    cost_total = property(_get_cost_total)


    def __str__(self):
        return f'{self.name}: {self.amount}x{self.cost_per_exemplar} rub'
    


class Item_Payment(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='payments')
    # the one who has to pay for this Items (borrower)
    payer = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='payers')
    # the part that this payer must pay for this item
    paying_part = models.FloatField(editable = True, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    is_payed = models.BooleanField(editable = True, default = False)

    # https://stackoverflow.com/questions/17682567/how-to-add-a-calculated-field-to-a-django-model
    def _get_paying_amount(self):
        "Returns the paing amount"
        return round(self.paying_part*self.item.cost_per_exemplar*self.item.amount, 2)
    
    paying_amount = property(_get_paying_amount)

    def _get_lender(self):
        "Returns the lender of the bill where the item is on"
        return self.item.bill.lender
    # the one who had payed (lender)
    lender = property(_get_lender)

    def __str__(self):
        return f'For {self.item.name} {self.payer} has to pay {self.paying_amount} rub'