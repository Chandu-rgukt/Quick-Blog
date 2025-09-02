import React, { useEffect } from 'react'
import { useState } from 'react'
import { assets, blog_data } from '../../assets/assets';
import BlogTableitem from '../../components/admin/BlogTableitem.jsx';
import { useAppContext } from '../../context/AppContext.jsx';
import { toast } from 'react-hot-toast';

const ListBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const {axios} = useAppContext();

  const fetchBlogs = async () => {
    try {
      const {data} = await axios.get('/api/admin/blogs');
      if(data.success) {
        setBlogs(data.blogs);
      }else{
        toast.error(data.message);
      }
    } catch (error) {
       toast.error(error?.response?.data?.message || error.message)
    }
  }

  useEffect(()=>{
    fetchBlogs()
  })

  return (
    <div className='flex-1 h-4/5 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50'>
      <h1 className='text-lg font-semibold'>All blogs</h1>
      <div className='relative max-w-4xl mt-4 overflow-x-auto shadow
    scrollbar-hide bg-white'>
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
          {blogs.map((blog, index) => {
            return <BlogTableitem key={blog.id} blog={blog} fetchBlogs={fetchBlogs} index={index + 1} />
          })}
        </tbody>
      </table>

    </div>
      
    </div>
  )
}

export default ListBlog
