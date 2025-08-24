from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_datetime 
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
import json
from .models import Todo
@csrf_exempt

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def CreateTodo (request):
    try:
        data = json.loads(request.body)
        
        title = data.get('title')
        
        if not title:
            return JsonResponse({"error":'title is required'}, status=400)
        
        todo = Todo.objects.create(
            user = request.user,
            title = title,
            description = data.get('description',''),
            due_date=parse_datetime(data.get('due_date')) if data.get('due_date') else None # pyright: ignore[reportUndefinedVariable]
        )
        
        return JsonResponse({
           'message': 'Todo created successfully',

            'todo': {
                'id': todo.id,
                'title': todo.title,
                'description': todo.description,
                'completed': todo.completed,
                'due_date': todo.due_date.isoformat() if todo.due_date else None,
                'created_at': todo.created_at.isoformat(),
            }
        }, status=201)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
    
    
    
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
    
def getTodo(request):
    todos = Todo.objects.filter(user=request.user)
     
    todo_list = [{
        'id': t.id,
        'title': t.title,
        'description': t.description,
        'completed': t.completed,
        
        'due_date': t.due_date.isoformat() if t.due_date else None,
        'created_at': t.created_at.isoformat(),
      
    } for t in todos]
    return JsonResponse({'todos': todo_list}, status=200)


@api_view(['DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])

def deleteTodo(request, todo_id):
    try:
        todo = Todo.objects.get(id=todo_id, user=request.user)
        todo.delete()
        return JsonResponse({'message':'Todo Deleted sucessfully'},status=200)
    
    except Todo.DoesNotExist:
        return JsonResponse({'error':'Todo not found'},status=404)
    except Exception as e:
        return JsonResponse({'error':str(e)},status=500)
    
     
        
        
    
    
    
    
    