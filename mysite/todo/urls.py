
from django.urls import path
from . import views


urlpatterns = [
    path("create/", views.CreateTodo, name="create_todo"),
    path("list/", views.getTodo, name="get_todo"),
    path("delete/<int:todo_id>", views.deleteTodo, name="delete_todo")  
]
