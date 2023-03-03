from rest_framework import generics
from django.contrib.auth import get_user_model
from .serializers import DABUserSerializer, UserSerializerWithSeparation

User = get_user_model()


class UserListAPIView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = DABUserSerializer

    def get_serializer_class(self):
        if self.request.version == '0.2':
            return UserSerializerWithSeparation
        return DABUserSerializer
