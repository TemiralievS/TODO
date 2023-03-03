from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class DABUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email')


class UserSerializerWithSeparation(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'is_superuser', 'is_staff')
