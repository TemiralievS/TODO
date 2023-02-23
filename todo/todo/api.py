import requests
import time

DOMAIN = 'http://127.0.0.1:8001'


def timeout():
    time.sleep(2)


def get_url(url):
    return f'{DOMAIN}{url}'


timeout()

response = requests.get(get_url('/api/projects/'))
assert response.status_code == 401

timeout()
response = requests.get(get_url('/api/projects/'), auth=('nikolay', '1'))
assert response.status_code == 200

timeout()
TOKEN = '070dcb59ba32fe44af7b51dc1ebe33400f5bedc2'
headers = {'Authorization': f'Token {TOKEN}'}
response = requests.get(get_url('/api/projects/'), headers=headers)
assert response.status_code == 200

timeout()

response = requests.post(get_url('/api/token/'), data={'username': 'nikolay', 'password': '1'})
result = response.json()

access = result['access']
print('Первый токен',access,end=f'\n{150*"*"}\n')

refresh = result['refresh']
print('refresh',refresh,end=f'\n{150*"*"}\n')
timeout()
headers = {'Authorization': f'Bearer {access}'}
response = requests.get(get_url('/api/projects/'), headers=headers)
assert response.status_code == 200

timeout()
response = requests.post(get_url('/api/token/refresh/'), data={'refresh': refresh})
result = response.json()
access = result['access']
print('Обновленный токен',access,end=f'\n{150*"*"}\n')
print('refresh',refresh,end=f'\n{150*"*"}\n')
timeout()

headers = {'Authorization': f'Bearer {access}'}
response = requests.get(get_url('/api/projects/'), headers=headers)
assert response.status_code == 200