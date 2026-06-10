import React from 'react'
import { useState } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';

const Login = () => {
    const {axios, navigate, setToken} = useAppContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const {data} = await axios.post("/api/admin/login", {email, password});
            if(data.success){
                setToken(data.token);
                localStorage.setItem("token", data.token);
                axios.defaults.headers.common["Authorization"] = data.token;
               
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    
  return (
    <div className='flex items-center justify-center h-screen'>
        <div className='w-full max-w-sm p-6 max-md:m-6 border primary/30
        shadow-xl shadow-primary/15 rounded-lg'>
            <div className='flex flex-col items-center justify-center'>
              <div className='w-full flex flex-col items-center gap-4 mb-6'>
                   <h1 className='text-3xl font-bold'><span
                      className='text-primary'>Admin</span> Login
                   </h1>
                    <p className='font-light text-center'>Enter your credentials to access the admin panel</p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className='mt-3 sm:max-w-md text-gray-600'>
                <div className='flex flex-col'>
                    <label>Email</label>
                    <input onChange={(e) => setEmail(e.target.value)} value={email}
                     type="email" placeholder="email" className='p-2 border border-gray-300 rounded' required />
                    
                </div>
                <div className='flex flex-col'>
                    <label>Password</label>
                    <input onChange={(e) => setPassword(e.target.value)} value={password}
                     type="password" placeholder="password" className='p-2 border border-gray-300 rounded' required />
                </div>
                <button type="submit" className='p-2 bg-primary text-white rounded mt-4 w-full overflow-auto'>Login</button>
            </form>

        </div>
      
    </div>
  )
}

export default Login

