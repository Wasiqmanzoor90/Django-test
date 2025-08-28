import React, { useState } from 'react';

function CreateTodo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setDueDate("");
    };

    const validateForm = () => {
        if (!title.trim()) {
            setMessage({ type: 'error', text: 'Title is required' });
            return false;
        }
        if (!dueDate) {
            setMessage({ type: 'error', text: 'Due date is required' });
            return false;
        }
        return true;
    };

    const createTodo = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Simulate API call - replace with your actual axios implementation
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            /* Replace this simulation with your actual API call:
            const res = await axios.post("http://127.0.0.1:8000/todo/create/", {
                title,
                description,
                due_date: dueDate,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`
                }
            });
            */
            
            setMessage({ type: 'success', text: 'Todo created successfully!' });
            resetForm();
            
            // Clear success message after 3 seconds
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error("Error creating todo:", error);
            
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               'Failed to create todo. Please try again.';
            
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Bootstrap CSS */}
            <link 
                href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
                rel="stylesheet" 
            />
            
            {/* Custom styles for enhanced white theme */}
            <style>{`
                .white-theme-bg {
                    background-color: #f8f9fa;
                    min-height: 100vh;
                }
                
                .todo-card {
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    border: 1px solid #e9ecef;
                    transition: all 0.3s ease;
                }
                
                .todo-card:hover {
                    box-shadow: 0 15px 40px rgba(0,0,0,0.15);
                    transform: translateY(-5px);
                }
                
                .form-control, .form-select {
                    border-radius: 10px;
                    border: 2px solid #e9ecef;
                    padding: 12px 16px;
                    transition: all 0.3s ease;
                    font-size: 14px;
                }
                
                .form-control:focus, .form-select:focus {
                    border-color: #0d6efd;
                    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
                }
                
                .btn-primary {
                    border-radius: 10px;
                    padding: 12px 30px;
                    font-weight: 600;
                    font-size: 16px;
                    transition: all 0.3s ease;
                    border: none;
                }
                
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(13, 110, 253, 0.3);
                }
                
                .btn-primary:active {
                    transform: translateY(0);
                }
                
                .alert {
                    border-radius: 10px;
                    border: none;
                    font-weight: 500;
                }
                
                .header-icon {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(45deg, #0d6efd, #6610f2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 24px;
                    margin: 0 auto 20px;
                    box-shadow: 0 5px 15px rgba(13, 110, 253, 0.3);
                }
                
                .form-label {
                    font-weight: 600;
                    color: #495057;
                    margin-bottom: 8px;
                }
                
                .fade-in {
                    animation: fadeIn 0.5s ease-in;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .spinner-border-sm {
                    width: 1rem;
                    height: 1rem;
                }
            `}</style>

            <div className="white-theme-bg">
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-md-6 col-lg-5">
                            
                            {/* Header */}
                            <div className="text-center mb-4">
                                <div className="header-icon">
                                    <i className="fas fa-plus" style={{fontSize: '24px'}}>+</i>
                                </div>
                                <h2 className="h3 fw-bold text-dark mb-2">Create New Todo</h2>
                                <p className="text-muted">Stay organized and boost your productivity</p>
                            </div>

                            {/* Main Card */}
                            <div className="todo-card p-4 fade-in">
                                
                                {/* Message Alert */}
                                {message.text && (
                                    <div className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'} d-flex align-items-center mb-4`}>
                                        <i className={`fas ${message.type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'} me-2`}></i>
                                        <span>{message.text}</span>
                                    </div>
                                )}

                                {/* Form */}
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">
                                        Title <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-control"
                                        placeholder="What needs to be done?"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        disabled={isLoading}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        rows="4"
                                        className="form-control"
                                        placeholder="Add more details about your todo (optional)"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        disabled={isLoading}
                                    ></textarea>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="dueDate" className="form-label">
                                        Due Date <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        id="dueDate"
                                        type="date"
                                        className="form-control"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        disabled={isLoading}
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                {/* Submit Button */}
                                <button 
                                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                                    onClick={createTodo}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Creating Todo...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-plus me-2">+</i>
                                            Create Todo
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Footer */}
                            <div className="text-center mt-4">
                                <p className="text-muted small mb-0">
                                    Start building better habits, one todo at a time ✨
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateTodo;