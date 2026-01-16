import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.mark.django_db
def test_user_registration(api_client):
    url = '/api/auth/register/'
    data = {
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'password123',
        'is_buyer': True
    }
    response = api_client.post(url, data)
    assert response.status_code == status.HTTP_201_CREATED
    assert User.objects.count() == 1
    assert User.objects.get().username == 'testuser'

@pytest.mark.django_db
def test_login_jwt(api_client):
    user = User.objects.create_user(username='loginuser', password='password123')
    url = '/api/auth/token/'
    data = {
        'username': 'loginuser',
        'password': 'password123'
    }
    response = api_client.post(url, data)
    assert response.status_code == status.HTTP_200_OK
    assert 'access' in response.data
    assert 'refresh' in response.data
    
    # Check custom claims
    import jwt
    decoded = jwt.decode(response.data['access'], options={"verify_signature": False})
    assert 'is_seller' in decoded
