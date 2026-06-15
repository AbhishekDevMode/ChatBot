import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate()
    const {setAuthUser} = useAuth();
    const [loading , setLoading] = useState(false);
    const [inputData , setInputData] = useState({})

    const handelInput=(e)=>{
        setInputData({
            ...inputData , [e.target.id]:e.target.value
        })
    }
console.log(inputData);
    const selectGender=(selectGender)=>{
        setInputData((prev)=>({
            ...prev , gender:selectGender === inputData.gender ? '' : selectGender
        }))
    }

    const handelSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true)
        if(inputData.password !== inputData.confpassword){
            setLoading(false)
            return toast.error("Password Dosen't match")
        }
        try {
            const register = await axios.post(`/api/auth/register`,inputData);
            const data = register.data;
            if(data.success === false){
                setLoading(false)
                toast.error(data.message)
                console.log(data.message);
            }
            toast.success(data?.message)
            localStorage.setItem('chatapp',JSON.stringify(data))
            setAuthUser(data)
            setLoading(false)
            navigate('/login')
        } catch (error) {
            setLoading(false)
            console.log(error);
            toast.error(error?.response?.data?.message)
        }
    }

  return (
        <div className='flex flex-col items-center justify-center min-w-full mx-auto py-10'>
            <div className='w-full max-w-md p-8 rounded-2xl glass-panel'>
                <h1 className='text-4xl font-bold text-center text-white mb-2'>
                    Register <span className='text-sky-400'>Chatters</span>
                </h1>
                <p className='text-sm text-center text-gray-300 mb-8'>Create an account to get started.</p>
                
                <form onSubmit={handelSubmit} className='flex flex-col gap-4'>
                    <div>
                        <label className='label p-1 mb-1'>
                            <span className='font-medium text-gray-200 text-sm'>Full Name</span>
                        </label>
                        <input
                            id='fullname'
                            type='text'
                            onChange={handelInput}
                            placeholder='Enter Full Name'
                            required
                            className='w-full px-4 py-3 rounded-lg glass-input text-sm' />
                    </div>
                    <div>
                        <label className='label p-1 mb-1'>
                            <span className='font-medium text-gray-200 text-sm'>Username</span>
                        </label>
                        <input
                            id='username'
                            type='text'
                            onChange={handelInput}
                            placeholder='Enter Username'
                            required
                            className='w-full px-4 py-3 rounded-lg glass-input text-sm' />
                    </div>
                    <div>
                        <label className='label p-1 mb-1'>
                            <span className='font-medium text-gray-200 text-sm'>Email</span>
                        </label>
                        <input
                            id='email'
                            type='email'
                            onChange={handelInput}
                            placeholder='Enter email'
                            required
                            className='w-full px-4 py-3 rounded-lg glass-input text-sm' />
                    </div>
                    <div>
                        <label className='label p-1 mb-1'>
                            <span className='font-medium text-gray-200 text-sm'>Password</span>
                        </label>
                        <input
                            id='password'
                            type='password'
                            onChange={handelInput}
                            placeholder='Enter password'
                            required
                            className='w-full px-4 py-3 rounded-lg glass-input text-sm' />
                    </div>
                    <div>
                        <label className='label p-1 mb-1'>
                            <span className='font-medium text-gray-200 text-sm'>Confirm Password</span>
                        </label>
                        <input
                            id='confpassword'
                            type='password'
                            onChange={handelInput}
                            placeholder='Confirm password'
                            required
                            className='w-full px-4 py-3 rounded-lg glass-input text-sm' />
                    </div>

                    <div id='gender' className="flex gap-4 mt-2">
                        <label className="cursor-pointer flex items-center gap-2">
                            <input 
                                onChange={()=>selectGender('male')}
                                checked={inputData.gender === 'male'}
                                type='checkbox' 
                                className="checkbox checkbox-sm checkbox-info rounded-sm border-gray-400"
                            />
                            <span className="font-medium text-gray-200 text-sm">Male</span>
                        </label>
                        <label className="cursor-pointer flex items-center gap-2">
                            <input 
                                checked={inputData.gender === 'female'}
                                onChange={()=>selectGender('female')}
                                type='checkbox' 
                                className="checkbox checkbox-sm checkbox-info rounded-sm border-gray-400"
                            />
                            <span className="font-medium text-gray-200 text-sm">Female</span>
                        </label>
                    </div>

                    <button type='submit'
                        disabled={loading}
                        className='mt-4 w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'>
                        {loading ? <span className="loading loading-spinner loading-sm"></span> : "Register"}
                    </button>
                </form>

                <div className='pt-6 text-center'>
                    <p className='text-sm text-gray-300'>
                        Already have an account? <Link to={'/login'}>
                            <span className='text-sky-400 font-semibold hover:text-sky-300 hover:underline transition-colors'>
                                Login Now!
                            </span>
                        </Link>
                    </p>
                </div>
           </div>
        </div>
  )
}

export default Register