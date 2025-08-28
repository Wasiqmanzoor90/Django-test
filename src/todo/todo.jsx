import axios from 'axios';
import React, { useEffect, useState } from 'react';


function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for authentication token
  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      window.location.href = "/";
      return;
    }
  }, []);

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return 'Invalid date';
    }
  };




//deleteFunction 
const deleteFunction = async(id)=>
    {

        try {
            const res = await axios.delete(`http://127.0.0.1:8000/todo/delete/${id}`,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`
                }
            })
            if(res.status==200)
            {
                // Handle successful deletion
                setTodos(todos.filter(todo => todo.id !== id));
            }

        } catch (error) {

            console.error("Error deleting todo:", error);
            setError(error.message || 'Failed to delete todo');
        }
    }




  // Fetch todos function
  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch("http://127.0.0.1:8000/todo/list/", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          window.location.href = "/";
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      // Handle different response formats
      let todosArray = [];
      if (Array.isArray(data)) {
        todosArray = data;
      } else if (data.todos && Array.isArray(data.todos)) {
        todosArray = data.todos;
      } else if (typeof data === 'object' && data !== null) {
        todosArray = Object.values(data);
      }
      
      setTodos(todosArray);
    } catch (err) {
      console.error("Error fetching todos:", err);
      setError(err.message || 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
          <button className="btn btn-outline-danger" onClick={fetchTodos}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Todo List</h1>
      
      {todos.length === 0 ? (
        <div className="text-center">
          <p className="text-muted">No todos found. Start by adding some tasks!</p>
        </div>
      ) : (
        <div className="row">
          {todos.map((todo, index) => (
            
            <div key={todo.id || index} className="col-md-6 col-lg-4 mb-3">
            
              <div className={`card h-100 ${todo.completed ? 'border-success' : 'border-warning'}`}>
                <div className="card-body">
                      <button className='btn btn-danger' onClick={() => deleteFunction(todo.id)}>Delete</button>
                  <h5 className={`card-title ${todo.completed ? 'text-decoration-line-through text-success' : ''}`}>
                    {todo.title || 'Untitled'}
                  </h5>
                  <p className="card-text">
                    {todo.description || 'No description provided'}
                  </p>
                  <div className="mb-2">
                    <small className="text-muted">
                      <strong>Due:</strong> {formatDate(todo.due_date)}
                    </small>
                  </div>
                  <div className="mb-2">
                    <span className={`badge ${todo.completed ? 'bg-success' : 'bg-warning'}`}>
                      {todo.completed ? 'Completed ✅' : 'Pending ⏳'}
                    </span>
                  </div>
                  {todo.created_at && (
                    <small className="text-muted">
                      Created: {formatDate(todo.created_at)}
                    </small>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="d-flex justify-content-center mt-4">
        <button 
          className="btn btn-primary px-4" 
          onClick={fetchTodos}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Refreshing...
            </>
          ) : (
            'Refresh'
          )}
        </button>
      </div>
    <button
  className='btn btn-primary'
  onClick={() => window.location.href = '/Todo/Create'}
>
  Create Todo
</button>

    </div>
  );
}

export default TodoList;