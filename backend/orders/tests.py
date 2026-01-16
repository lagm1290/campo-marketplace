import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from products.models import Product, Category
from orders.models import Order

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def create_user():
    def make_user(username='testuser', is_seller=False):
        return User.objects.create_user(username=username, password='password123', is_seller=is_seller)
    return make_user

@pytest.fixture
def create_product(create_user):
    seller = create_user(username='seller', is_seller=True)
    category = Category.objects.create(name='Test Category', slug='test-cat')
    product = Product.objects.create(
        seller=seller,
        category=category,
        name='Test Product',
        description='Desc',
        price=10.00,
        stock=5
    )
    return product

@pytest.mark.django_db
def test_create_order(api_client, create_user, create_product):
    buyer = create_user(username='buyer')
    api_client.force_authenticate(user=buyer)
    
    url = '/api/orders/'
    data = {
        'items': [
            {'id': create_product.id, 'quantity': 2}
        ]
    }
    
    response = api_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_201_CREATED
    assert Order.objects.count() == 1
    
    create_product.refresh_from_db()
    assert create_product.stock == 3 # 5 - 2

@pytest.mark.django_db
def test_insufficient_stock(api_client, create_user, create_product):
    buyer = create_user(username='buyer2')
    api_client.force_authenticate(user=buyer)
    
    url = '/api/orders/'
    data = {
        'items': [
            {'id': create_product.id, 'quantity': 100} # Exceeds stock of 5
        ]
    }
    
    response = api_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert Order.objects.count() == 0
