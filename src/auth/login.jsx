import axios from 'axios';
import React, { useState } from 'react'

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (credentials) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/auth/login/", {
        username,
        password
      });
      if (res.status == 200) {
         localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
        window.location.href = "/Todo";
      }
    } catch (error) {
      console.error("Login failed");
    }
  }
  return (

    <div className="d-flex justify-content-center align-items-center vh-100 ">
      <div style={{ width: "500px", border: "1px solid lightgray", borderRadius: "10px" }} className="form p-5">
        <h1 className='text-center m-4'>Login page</h1>

        <input className='form-control'
          placeholder='Enter username'
          type="email" value={username}
          onChange={(e) => setUsername(e.target.value)} />
        <p className='m-3' style={{ opacity: 0.5 }}> we never share your email with anyone.</p>

        <input className='form-control' placeholder='Enter Password'
          type="password" value={password}
          onChange={(e) => setPassword(e.target.value)} />

        <button className='btn btn-primary mx-auto w-100 m-5' onClick={handleLogin}>Login</button>

        <p>Don't have an account? <a href="/register">Register</a></p>
      </div>
    </div>
  )
}

export default LoginPage
