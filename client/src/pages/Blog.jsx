import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import Navbar from '../components/Navbar';
import Moment from 'moment';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

function Blog() {
  const { id } = useParams();
  const { axios } = useAppContext();
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  const fetchBlogData = async () => {
    try{
      const {data} = await axios.get(`/api/blogs/${id}`);
      data.success ? setData(data.blog) : toast.error(data.message);
    }catch(error){
      toast.error(error.message);
    }
  };

  const fetchComments = async () => {
    try{
      const {data} = await axios.get(`/api/blogs/${id}/comments`);
      if(data.success){
        setComments(data.comments);
      }else{
        toast.error(data.message);
      }
    }catch(error){
      toast.error(error.message);
    }
  }

  const addComment = async (e) => {
    e.preventDefault();
    try{
      const {data} = await axios.post(`/api/blogs/add-comment`, { blog: id, name, content });
      if(data.success){
        toast.success(data.message);
        fetchComments();
        setName('');
        setContent('');
      }else{
        toast.error(data.message);
      }
    }catch(error){
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchBlogData();
    fetchComments();
  }, [id]);

  return data ? (
    <div className="relative">
      <img
        src={assets.gradientBackground}
        alt=""
        className="absolute -top-[50px] -z-10 opacity-50"
      />
      <Navbar />

      <div className='text-center mt-20 text-gray-600'>
        <p>Published on {Moment(data.createdAt).format('MMMM Do YYYY')}</p>
        <h1 className='text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto'>{data.title}</h1>
        <h2 className='my-5 max-w-lg truncate mx-auto'>{data.subTitle}</h2>
        <p className='inline-block py-1 px-4 rounded-full mb-6 border text-sm
        border-primary/35 bg-primary/5 font-medium text-primary'>HeisenBerg</p>
      </div>

      <div className='max-w-5xl mx-auto my-10 mt-6'>
        <img src={data.image} alt="" className='rounded-3xl mb-5 max-w-2xl w-full mx-auto block' />
        <div className='rich-text max-w-3xl mx-auto' dangerouslySetInnerHTML={{ __html: data.description }}></div>
        <div className='mt-14 mb-10 max-w-3xl mx-auto'>
          <p className='font-semibold mb-2'> Comments {comments.length} </p>

          <div className='mt-4 mb-10'>
            {comments.map((item,index) => (
              <div key={index} className='relative bg-primary/2 border
              border-primary/5 max-w-xl p-4 rounded text-gray-600 mb-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <img src={assets.user_icon} alt="" className='w-6'/>
                  <p className='font-medium'>{item.name}</p>
                </div>
                <p className='text-sm max-w-md ml-8'>{item.content}</p>
                <div className='absolute right-4 bottom-3 flex items-center gap-2 text-xs'>{Moment(item.createdAt).format('MMMM Do YYYY')}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <div className='max-w-3xl mx-auto'>
        <p>Add a comment</p>
         <form onSubmit={addComment} className='flex flex-col items-start gap-4 max-w-lg'>
           <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Name' className='border border-gray-300 p-2 rounded w-full' required/>
           <textarea onChange={(e) => setContent(e.target.value)} value={content} className='border border-gray-300 p-2 rounded w-full' rows={4} placeholder='Write your comment...' required></textarea>
           <button type='submit' className='mt-2 bg-primary text-white py-2 px-4 rounded'>Submit</button>
         </form>

      </div>
      <div className='my-24 max-w-3xl mx-auto'>
        <p className='font-semibold my-4 '>Share this post on your social media</p>
        <div className='flex gap-4'>
          <img src={assets.facebook_icon} alt="Share on Facebook" width={50} height={32} />
          <img src={assets.twitter_icon} alt="Share on Twitter" width={50} height={32} />
          <img src={assets.googleplus_icon} alt="Share on Google Plus" width={50} height={32} />
        </div>
      </div>
      <Footer />
    </div>
  ) : (
    <div>
      <Loader />
    </div>
  );
}

export default Blog;