import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import BlogTableitem from '../../components/admin/BlogTableitem.jsx';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';

function DashBoard() {
  const { axios, token } = useAppContext();
  const [dashboardData, setDashboardData] = useState({
    blogs: 0,
    comments: 0,
    drafts: 0,
    recentBlogs: []
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 p-4 md:p-10 bg-blue-50/50 flex items-center justify-center">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-10 bg-blue-50/50">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all">
          <img src={assets.dashboard_icon_1} alt=""/>
          <div>
            <p className="text-2xl font-semibold">{dashboardData.blogs}</p>
            <p className="text-gray-400 font-light">Blogs</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all">
          <img src={assets.dashboard_icon_2} alt=""/>
          <div>
            <p className="text-2xl font-semibold">{dashboardData.comments}</p>
            <p className="text-gray-400 font-light">Comments</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all">
          <img src={assets.dashboard_icon_3} alt=""/>
          <div>
            <p className="text-2xl font-semibold">{dashboardData.drafts}</p>
            <p className="text-gray-400 font-light">Drafts</p>
          </div>
        </div>
      </div>

      <div className='flex items-center gap-3 m-4 text-gray-600'>
        <img src={assets.dashboard_icon_4} alt=""/>
        <p className="text-gray-400 font-light">Recent Blogs</p>
      </div>

      <div className='relative max-w-4xl overflow-x-auto shadow scrollbar-hide bg-white'>
        <table className='w-full text-sm text-gray-500'>
          <thead className='text-xs text-gray-600 text-left uppercase'>
            <tr>
              <th scope='col' className='px-2 py-4'>#</th>
              <th scope='col' className='px-2 py-4'>Blog title</th>
              <th scope='col' className='px-2 py-4'>Date</th>
              <th scope='col' className='px-2 py-4'>Status</th>
              <th scope='col' className='px-2 py-4'>Action</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.recentBlogs.map((blog, index) => (
              <BlogTableitem 
                key={blog._id} 
                blog={blog} 
                fetchBlogs={fetchDashboardData} 
                index={index + 1} 
              />
            ))}
            {dashboardData.recentBlogs.length === 0 && (
              <tr>
                <td colSpan="5" className="px-2 py-4 text-center text-gray-500">
                  No blogs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DashBoard;