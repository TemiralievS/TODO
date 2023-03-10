import graphene
from graphene_django import DjangoObjectType


from todoapp.models import Project, ToDo
from userapp.models import User


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = '__all__'


class ToDoType(DjangoObjectType):
    class Meta:
        model = ToDo
        fields = '__all__'


class ProjectType(DjangoObjectType):
    class Meta:
        model = Project
        fields = '__all__'


class Query(graphene.ObjectType):
    all_todo = graphene.List(ToDoType)
    all_users = graphene.List(UserType)
    all_projects = graphene.List(ProjectType)
    todo_by_project_id = graphene.Field(ProjectType, id=graphene.Int(required=True))
    todo_by_user_id = graphene.Field(UserType, id=graphene.Int(required=True))
    project_by_user_id = graphene.Field(UserType, id=graphene.Int(required=True))


    def resolve_all_todo(self, info):
        return ToDo.objects.all()

    def resolve_all_users(self, info):
        return User.objects.all()

    def resolve_all_projects(self, info):
        return Project.objects.all()

    def resolve_todo_by_project_id(self, info, id):
        try:
            return Project.objects.get(id=id)
        except Project.DoesNotExist:
            return None

    def resolve_todo_by_user_id(self, info, id):
        try:
            return User.objects.get(id=id)
        except Project.DoesNotExist:
            return None

    def resolve_project_by_user_id(self, info, id):
        try:
            return User.objects.get(id=id)
        except Project.DoesNotExist:
            return None

schema = graphene.Schema(query=Query)
