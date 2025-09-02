import React from 'react'
import { useState, useEffect } from 'react'
import { useAppContext }  from '../../context/AppContext'
import CommentTableItem from '../../components/admin/CommentTableItem'
import toast from 'react-hot-toast'
import axios from 'axios'

const Comments = () => {
  const { axios, token } = useAppContext()
  const [comments, setComments] = useState([])
  const [filter, setFilter] = useState('Not Approved')
  const [loading, setLoading] = useState(true)

  const fetchComments = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/admin/comments', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (data.success) {
        setComments(data.comments)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error)
      toast.error(error.response?.data?.message || "Failed to load comments")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [])

  const filteredComments = comments.filter((comment) => {
    if (filter === 'Approved') return comment.isApproved
    return !comment.isApproved
  })

  if (loading) {
    return (
      <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50 flex items-center justify-center'>
        <div className="text-gray-600">Loading comments...</div>
      </div>
    )
  }

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50'>
      <div className='flex justify-between items-center max-w-3xl'>
        <h1 className="text-xl font-semibold text-gray-800">Comments</h1>
        <div className='flex gap-4'>
          <button 
            onClick={() => setFilter('Approved')} 
            className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs ${
              filter === 'Approved' ? 'text-primary bg-primary/10 border-primary' : 'text-gray-500 border-gray-300'
            }`}
          >
            Approved
          </button>
          <button 
            onClick={() => setFilter('Not Approved')} 
            className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs ${
              filter === 'Not Approved' ? 'text-primary bg-primary/10 border-primary' : 'text-gray-500 border-gray-300'
            }`}
          >
            Not Approved
          </button>
        </div>
      </div>
      
      <div className='relative h-4/5 max-w-3xl overflow-x-auto mt-4 bg-white shadow rounded-lg scrollbar-hide'>
        <table className='w-full text-sm text-gray-500'>
          <thead className='text-xs text-gray-700 text-left uppercase bg-gray-50'>
            <tr>
              <th scope='col' className='px-6 py-3'>Blog Title & Comment</th>
              <th scope='col' className='px-6 py-3 hidden sm:table-cell'>Date</th>
              <th scope='col' className='px-6 py-3'>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredComments.length > 0 ? (
              filteredComments.map((comment) => (
                <CommentTableItem 
                  key={comment._id} 
                  comment={comment} 
                  fetchComments={fetchComments} 
                />
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  No {filter.toLowerCase()} comments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Comments