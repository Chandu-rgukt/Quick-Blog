import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Blog from './pages/Blog.jsx'
import Layout from './pages/admin/Layout.jsx' 
import DashBoard from './pages/admin/DashBoard.jsx'
import AddBlog from './pages/admin/AddBlog.jsx'
import Comments from './pages/admin/Comments.jsx'
import ListBlog from './pages/admin/ListBlog.jsx'
import Login from './components/admin/Login.jsx'
import 'quill/dist/quill.snow.css' 
import {Toaster} from 'react-hot-toast'
import { useAppContext } from './context/AppContext.jsx'

const App = () => {

  const {token}=useAppContext()
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/admin" element={token ? <Layout /> : <Login />} >
          <Route index element={<DashBoard />} />
          <Route path="addBlog" element={<AddBlog />} />
          <Route path="comments" element={<Comments />} />
          <Route path='listBlog' element={<ListBlog />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
