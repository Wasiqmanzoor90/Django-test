from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken
import json

@csrf_exempt
def signup(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)  # get JSON body
            username = data.get("username")
            email = data.get("email")
            password = data.get("password")

            # Check required fields
            if not username or not email or not password:
                return JsonResponse({"error": "All fields are required"}, status=400)

            # Check if user exists
            if User.objects.filter(username=username).exists():
                return JsonResponse({"error": "Username already exists"}, status=400)
            if User.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email already exists"}, status=400)

            # Create user
            user = User.objects.create_user(username=username, email=email, password=password)
            user.save()

            return JsonResponse({"message": "User created successfully"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)


@csrf_exempt
def login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")

            if not username or not password:
                return JsonResponse({"error": "Username and password are required"}, status=400)

            user = authenticate(request, username=username, password=password)

            if user is not None:
                
                
                refresh = RefreshToken.for_user(user)
                return JsonResponse({
                    "message": "Login successful",
                      "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh),
                    "user_id": user.id,
                    "username": user.username
                },status=200)
                
                
                
           
            else:
                return JsonResponse({"error": "Invalid username or password"}, status=400)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)
