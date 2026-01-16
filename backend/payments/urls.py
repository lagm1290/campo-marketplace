from django.urls import path
from .views import MockPaymentView

urlpatterns = [
    path('pay/', MockPaymentView.as_view(), name='pay'),
]
