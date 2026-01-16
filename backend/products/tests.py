import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from products.models import Product, Category

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
def setup_product(create_user):
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
    return seller, category, product

@pytest.mark.django_db
def test_get_products(api_client, setup_product):
    url = '/api/products/'
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) > 0

@pytest.mark.django_db
def test_create_product_as_seller(api_client, create_user):
    seller = create_user(username='seller2', is_seller=True)
    api_client.force_authenticate(user=seller)
    category = Category.objects.create(name='New Cat', slug='new-cat')

    url = '/api/products/'
    data = {
        'name': 'New Product',
        'description': 'Desc',
        'price': 20.00,
        'stock': 10,
        'category': category.id
    }
    
    response = api_client.post(url, data)
    assert response.status_code == status.HTTP_201_CREATED
    assert Product.objects.filter(name='New Product').exists()

@pytest.mark.django_db
def test_create_product_as_buyer(api_client, create_user):
    buyer = create_user(username='buyer', is_seller=False)
    api_client.force_authenticate(user=buyer)
    category = Category.objects.create(name='New Cat 2', slug='new-cat-2')

    url = '/api/products/'
    data = {
        'name': 'Buyer Product',
        'description': 'Desc',
        'price': 20.00,
        'stock': 10,
        'category': category.id
    }
    
    response = api_client.post(url, data)
    assert response.status_code == status.HTTP_403_FORBIDDEN
