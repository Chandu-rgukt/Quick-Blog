import React from 'react'
import { assets } from '../../assets/assets'
import { Outlet, useNavigate } from 'react-router-dom'
import SideBar from '../../components/admin/SideBar.jsx'
import { useAppContext } from '../../context/AppContext'

function Layout() {
    const navigate = useNavigate()
    const { setToken } = useAppContext()

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        navigate('/'); 
    }

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <div className='flex items-center justify-between p-4 py-2 h-[70px] sm:px-12 border-b border-gray-200 shadow-md bg-white z-50'>
                <img 
                    src={assets.logo} 
                    alt="Logo"  
                    className="h-[40px] sm:h-[40px] lg:h-[40px] w-auto object-contain cursor-pointer"  
                    onClick={() => navigate('/')}
                />

                <button 
                    onClick={logout} 
                    className='text-sm px-8 py-2 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition-colors'
                >
                    Logout
                </button>
            </div>

            {/* Main Content Area */}
            <div className='flex flex-1 overflow-hidden'>
                {/* Sidebar with fixed width */}
                <div className="w-64 bg-gray-100 border-r border-gray-200">
                    <SideBar />
                </div>
                
                {/* Main content area */}
                <div className="flex-1 overflow-auto bg-blue-50/50 p-4">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

export default Layout