
from django.contrib import admin
from django.urls import path ,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("auth/", include("accounts.urls")),  # include accounts routes
    path("todo/", include("todo.urls")),  # include todo routes
]
