import React, { useEffect, useState } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

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

  // Delete function with loading state
  const deleteFunction = async(id) => {
    setDeletingId(id);
    
    try {
      const res = await fetch(`http://127.0.0.1:8000/todo/delete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      
      if(res.status === 200) {
        setTodos(todos.filter(todo => todo.id !== id));
      }
      
    } catch (error) {
      console.error("Error deleting todo:", error);
      setError(error.message || 'Failed to delete todo');
    } finally {
      setDeletingId(null);
    }
  };

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
      <>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />
        <style>{`
          .white-theme-bg {
            background-color: #f8f9fa;
            min-height: 100vh;
          }
        `}</style>
        
        <div className="white-theme-bg d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading your todos...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />
        <div className="white-theme-bg min-vh-100 d-flex align-items-center">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card border-0 shadow-lg">
                  <div className="card-body p-5 text-center">
                    <div className="text-danger mb-4">
                      <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h4 className="text-danger mb-3">Something went wrong!</h4>
                    <p className="text-muted mb-4">{error}</p>
                    <button className="btn btn-primary px-4" onClick={fetchTodos}>
                      <i className="fas fa-redo me-2"></i>
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />
      
      <style>{`
        .white-theme-bg {
          background-color: #f8f9fa;
          min-height: 100vh;
        }
        
        .todo-card {
          background: white;
          border-radius: 15px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
          border: 1px solid #e9ecef;
          transition: all 0.3s ease;
          height: 100%;
        }
        
        .todo-card:hover {
          box-shadow: 0 12px 35px rgba(0,0,0,0.15);
          transform: translateY(-3px);
        }
        
        .header-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 3rem 0;
          margin-bottom: 2rem;
          border-radius: 0 0 30px 30px;
        }
        
        .btn-primary {
          border-radius: 10px;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
          padding: 10px 20px;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(13, 110, 253, 0.3);
        }
        
        .btn-danger {
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.85rem;
          padding: 6px 12px;
          transition: all 0.3s ease;
          border: none;
        }
        
        .btn-danger:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        }
        
        .status-badge {
          border-radius: 20px;
          padding: 8px 16px;
          font-weight: 600;
          font-size: 0.85rem;
        }
        
        .completed-title {
          text-decoration: line-through;
          opacity: 0.7;
        }
        
        .todo-description {
          color: #6c757d;
          font-size: 0.9rem;
          line-height: 1.4;
        }
        
        .todo-meta {
          font-size: 0.8rem;
          color: #6c757d;
        }
        
        .floating-btn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          font-size: 24px;
          box-shadow: 0 8px 25px rgba(13, 110, 253, 0.3);
          border: none;
          z-index: 1000;
          transition: all 0.3s ease;
        }
        
        .floating-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 30px rgba(13, 110, 253, 0.4);
        }
        
        .refresh-section {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.05);
          margin-top: 2rem;
        }
        
        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="white-theme-bg">
        {/* Header */}
        <div className="header-section">
          <div className="container">
            <div className="text-center text-white">
              <h1 className="display-4 fw-bold mb-2">My Todos</h1>
              <p className="lead mb-0">Manage your tasks efficiently</p>
            </div>
          </div>
        </div>

        <div className="container pb-5">
          {todos.length === 0 ? (
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="text-center py-5">
                  <div className="mb-4">
                    <i className="fas fa-clipboard-list text-muted" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h3 className="text-muted mb-3">No todos found</h3>
                  <p className="text-muted mb-4">Start by adding some tasks to stay organized!</p>
                  <button 
                    className="btn btn-primary btn-lg px-4"
                    onClick={() => window.location.href = '/Todo/Create'}
                  >
                    <i className="fas fa-plus me-2">+</i>
                    Create Your First Todo
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {todos.map((todo, index) => (
                <div key={todo.id || index} className="col-md-6 col-lg-4">
                  <div className="todo-card fade-in">
                    <div className="card-body p-4">
                      {/* Delete button */}
                      <div className="d-flex justify-content-end mb-3">
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteFunction(todo.id)}
                          disabled={deletingId === todo.id}
                        >
                          {deletingId === todo.id ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-1"></span>
                              Deleting...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-trash me-1"></i>
                              Delete
                            </>
                          )}
                        </button>
                      </div>

                      {/* Todo content */}
                      <h5 className={`card-title mb-3 ${todo.completed ? 'completed-title text-success' : 'text-dark'}`}>
                        {todo.title || 'Untitled'}
                      </h5>
                      
                      <p className="todo-description mb-3">
                        {todo.description || 'No description provided'}
                      </p>
                      
                      {/* Status badge */}
                      <div className="mb-3">
                        <span className={`status-badge ${todo.completed ? 'bg-success text-white' : 'bg-warning text-dark'}`}>
                          {todo.completed ? (
                            <>
                              <i className="fas fa-check-circle me-1"></i>
                              Completed
                            </>
                          ) : (
                            <>
                              <i className="fas fa-clock me-1"></i>
                              Pending
                            </>
                          )}
                        </span>
                      </div>
                      
                      {/* Meta information */}
                      <div className="todo-meta">
                        <div className="mb-1">
                          <i className="fas fa-calendar me-2"></i>
                          <strong>Due:</strong> {formatDate(todo.due_date)}
                        </div>
                        {todo.created_at && (
                          <div>
                            <i className="fas fa-plus-circle me-2"></i>
                            <strong>Created:</strong> {formatDate(todo.created_at)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Refresh section */}
          <div className="refresh-section text-center">
            <button 
              className="btn btn-outline-primary px-4 me-3" 
              onClick={fetchTodos}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Refreshing...
                </>
              ) : (
                <>
                  <i className="fas fa-sync-alt me-2"></i>
                  Refresh
                </>
              )}
            </button>
          </div>
        </div>

        {/* Floating Create Button */}
        <button
          className='btn btn-primary floating-btn d-flex align-items-center justify-content-center'
          onClick={() => window.location.href = '/Todo/Create'}
          title="Create New Todo"
        >
          <i className="fas fa-plus">+</i>
        </button>
      </div>
    </>
  );
}

export default TodoList;