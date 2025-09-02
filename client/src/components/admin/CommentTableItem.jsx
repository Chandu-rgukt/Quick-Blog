import React from 'react'
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

function CommentTableItem({ comment, fetchComments }) {
  const { blog, createdAt, _id } = comment;
  const BlogDate = new Date(createdAt);
  const { axios, token } = useAppContext();

const approveComment = async () => {
  try {
    const { data } = await axios.put(`/api/admin/comments/${_id}/approve`, 
      {}, // Empty body since ID is in URL
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    if (data.success) {
      toast.success(data.message);
      fetchComments();
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error("Failed to approve comment:", error);
    toast.error(error.response?.data?.message || "Failed to approve comment");
  }
};

const deleteComment = async () => {
  try {
    const confirm = window.confirm("Are you sure you want to delete this comment?");
    if(!confirm) return;
    
    const { data } = await axios.delete(`/api/admin/comments/${_id}`, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    if (data.success) {
      toast.success(data.message);
      fetchComments();
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error("Failed to delete comment:", error);
    toast.error(error.response?.data?.message || "Failed to delete comment");
  }
};

  return (
    <tr className='border-y border-gray-300'>
      <td className='px-6 py-4'>
        <b className='font-medium text-gray-600'>Blog</b> : {blog.title}
        <br />
        <br />
        <b className='font-medium text-gray-600'>Name</b> : {comment.name}
        <br />
        <b className='font-medium text-gray-600'>Comment</b> : {comment.content}
      </td>
      <td className='px-6 py-4 max-sm:hidden'>
        {BlogDate.toLocaleDateString()}
      </td>
      <td className='px-6 py-4 '>
        <div className='flex items-center gap-4'>
          {!comment.isApproved ? (
            <img
              onClick={approveComment}
              src={assets.tick_icon}
              className='w-5 hover:scale-110 transition-all cursor-pointer'
            />
          ) : (
            <p className='text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1'>
              Approved
            </p>
          )}
          <img
            onClick={deleteComment}
            src={assets.bin_icon}
            alt=""
            className='w-5 hover:scale-110 transition-all cursor-pointer'
          />
        </div>
      </td>
    </tr>
  )
}

export default CommentTableItem
