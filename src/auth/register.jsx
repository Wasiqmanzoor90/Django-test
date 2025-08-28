

import axios from 'axios';
import { useState } from 'react'

function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleRegister =  async ()=>{
        try {
            const res = await axios.post("http://127.0.0.1:8000/auth/signup/", {
                username,
                email,
                password
            });
            if (res.status == 201) {
                window.location.href = "/";
            }
        } catch (error) {
            console.error("Registration failed");
        }
    }
  return (
    <div className='d-flex justify-content-center align-items-center vh-100'>
      <div style={{ width: "500px", border: "1px solid lightgray", borderRadius: "10px" }} className="form p-5">
        <h1 className='text-center m-4'>Register page</h1>

        <input className='form-control' placeholder='Enter username'
          type="text" value={username}
          onChange={(e) => setUsername(e.target.value)} />
        <p className='m-3' style={{ opacity: 0.5 }}> we never share your email with anyone.</p>

        <input className='form-control' placeholder='Enter email'
          type="email" value={email}
          onChange={(e) => setEmail(e.target.value)} />

        <input className='form-control' placeholder='Enter Password'
          type="password" value={password}
          onChange={(e) => setPassword(e.target.value)} />

        <button className='btn btn-primary mx-auto w-100 m-5' onClick={handleRegister}>Register</button>

        <p>Already have an account? <a href="/">Login</a></p>
      </div>
    </div>
  )
}

export default RegisterPage
