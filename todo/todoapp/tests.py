from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIRequestFactory, APIClient, APITestCase
from mixer.backend.django import mixer
from django.contrib.auth.models import User

from userapp.views import UserViewSet
from userapp.models import User
from todoapp.views import ProjectViewSet
from todoapp.models import Project
# Create your tests here.


class TestUserViewSet(TestCase):

    def test_get_list(self):
        factory = APIRequestFactory()
        request = factory.get('/api/users/')
        view = UserViewSet.as_view({'get': 'list'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_guest(self):
        factory = APIRequestFactory()
        request = factory.post('/api/projects/', {'name': 'Guzlo', 'users': ['Ivanov', 'Petrov'],
                                                  'repository': 'https://github.com/'}, format='json')
        view = ProjectViewSet.as_view({'post': 'create'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_detail(self):
        client = APIClient()
        user = User.objects.create(username='Olol', first_name='Oleg', last_name='Golub', email='sobaka@gmail.com')
        response = client.get(f'/api/users/{user.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_edit_guest(self):
        client = APIClient()
        user = User.objects.create(username='Olol', first_name='Oleg', last_name='Golub', email='sobaka@gmail.com')
        response = client.get(f'/api/users/{user.id}/',
                              {'username': 'Kone'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def tearDown(self) -> None:
        pass


class TestUserViewSetNew(APITestCase):
    def test_get_list(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_edit_admin(self):
        user = User.objects.create(username='Olol', first_name='Oleg', last_name='Golub', email='sobaka@gmail.com')
        project = Project.objects.create(name='New', repository='/git.com/', users=[user, 'ivanov'])
        admin = User.objects.create_superuser('admin', 'admin@admin.com', 'admin123456')
        self.client.login(username='admin', password='admin123456')
        response = self.client.put(f'/api/projects/{project.id}/',
                                   {'name': 'New_2', 'repository': '/newgit.com/', 'users': project.users.id})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        project = Project.objects.get(project.name, 'New_2')

    def test_get_detail_mixer(self):
        client = APIClient()
        user = mixer.blend(User)
        response = client.get(f'/api/users/{user.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def tearDown(self) -> None:
        pass

