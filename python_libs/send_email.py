# https://docs.python.org/3/library/email.examples.html#email-examples
import smtplib, ssl
from email.message import EmailMessage
from math import floor

sender = 'acc.app.bot@gmail.com'
password = 'tfslvstxlyxvbssi'


def formatNumber(amount):
    amount_str = str(round(abs(amount)))
    n = floor(len(amount_str)/3)
    diff = len(amount_str) - n*3
    amount_formated = amount_str[0: diff]
    for i in range(n):
        amount_formated += ' '
        amount_formated += amount_str[diff + i*3: diff + (i + 1)*3]
    
    return(amount_formated)


def send_emails(user, counteragent, amount, comment = '', test = False):

    msg_to_user = EmailMessage()
    msg_to_counteragent = EmailMessage()

    msg_to_user['Subject'] = "TEST Payment" if test else "Payment"
    msg_to_counteragent['Subject'] = "TEST Payment" if test else "Payment"


    content_to_user = """
    Hi, {}!

    You have closed mutual settlements with {} and {} {} rub.

    {}

    This message was automatically generated please do not reply.
    """.format(user.first_name
            , counteragent.first_name
            , 'payed' if amount < 0 else 'received'
            , formatNumber(amount)
            , comment)
    

    content_to_counteragent = """
    Hi, {}!

    {} have closed mutual settlements with you and {} {} rub.

    {}

    This message was automatically generated please do not reply.
    """.format(counteragent.first_name
            , user.first_name
            , 'payed' if amount < 0 else 'received'
            , formatNumber(amount)
            , comment)

    msg_to_user.set_content(content_to_user)
    msg_to_counteragent.set_content(content_to_counteragent)

    with smtplib.SMTP_SSL('smtp.gmail.com', 465, context = ssl.create_default_context()) as server:
        server.login(sender, password)
        server.sendmail(sender, [user.email], msg_to_user.as_string())
        server.sendmail(sender, [counteragent.email], msg_to_counteragent.as_string())
