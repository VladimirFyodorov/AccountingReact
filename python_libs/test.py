bills = [{"amount": 0}, {"amount": 110}, {"amount": 50}, {"amount": 20}, {"amount": 0}]
newlist = sorted(bills, key=lambda d: -d["amount"])
print(newlist)