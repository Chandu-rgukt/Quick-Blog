import React from 'react'
import { assets } from '../../assets/assets';

import { toast } from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';



const BlogTableitem = ({ blog, fetchBlogs, index }) => {
   const {title,createdAt}= blog;
   const BlogDate=new Date(createdAt);

   const {axios,token} = useAppContext();

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this blog?');
    if (!confirm) return;

    try {

      const { data } = await axios.delete(`/api/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      
      if(data.success) {
        toast.success(data.message);
        fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
}

const handleTogglePublish = async (blogId) => {
  try {
    const { data } = await axios.put(`/api/blogs/${blogId}/toggle-publish`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (data.success) {
      toast.success(data.message);
      fetchBlogs(); 
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  }
}

  return (
    <tr className='border-y border-gray-300'>
      <th className='px-2 py-4'>{index}</th>
      <td className='px-2 py-4'>{title}</td>
      <td>{BlogDate.toDateString()}</td>
      <td>{BlogDate.toLocaleDateString()}</td>
      <td className='px-2 py-4 max-sm:hidden'>
        <p className={`${blog.isPublished ? 'text-green-600' : 'text-red-700'}`}>{blog.isPublished ? 'Published' : 'Unpublished'}</p>
      </td>
      <td className='px-2 py-4 flex text-xs gap-3'>
        <button onClick={() => handleTogglePublish(blog._id)} className='border px-2 py-0.5 mt-1 rounded cursor-pointer'>
          {blog.isPublished ? 'Unpublish' : 'Publish'}
        </button>
        <img src={assets.cross_icon} onClick={() => handleDelete(blog._id)} className='w-8 hover:scale-110 transition-all cursor-pointer pr-1' alt='Delete'/>
      </td>
    </tr>
      
  
  )
}

export default BlogTableitem
