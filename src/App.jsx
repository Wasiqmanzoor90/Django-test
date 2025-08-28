import React from 'react'
import { BrowserRouter, Route,  Routes } from 'react-router-dom'
import LoginPage from './auth/login'
import RegisterPage from './auth/register'
import TodoList from './todo/todo'
import CreateTodo from './todo/create'
function App() {
  return (
  
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path='/Todo' element={<TodoList/>}/>
      <Route path='/Todo/Create' element={<CreateTodo/>}/>
    </Routes>
    </BrowserRouter>
    
  )
}

export default App
