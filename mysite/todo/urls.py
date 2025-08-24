
from django.urls import path
from . import views


urlpatterns = [
    path("create/", views.CreateTodo, name="create_todo"),
    path("list/", views.getTodo, name="get_todo"),
    path("<int:todo_id>/delete", views.deleteTodo, name="delete_todo")  
]
