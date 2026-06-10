import React, { useEffect, useRef, useState } from "react";
import { assets, blogCategories } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext.jsx";
import Quill from "quill";
import toast from "react-hot-toast";
import { marked } from 'marked';


function AddBlog({onBlogAdded}) {
  const { axios, token } = useAppContext(); // grab token
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);
  const quilRef = useRef(null);

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("");

  const [isPublished, setIsPublished] = useState(true);

  const generateContent = async () => {
       if(!title) return toast.error("Please enter a title first");
       try{
        setLoading(true);
        const descriptionText = quilRef.current ? quilRef.current.getText().trim() : "";
        const { data } = await axios.post("/api/blogs/generate", { 
          prompt: title, 
          description: descriptionText 
        });
        if (data.success) {
          quilRef.current.root.innerHTML = marked.parse(data.content);
        } else {
          toast.error(data.message);
        }
       }catch(err){
        toast.error("Failed to generate content");
       }finally{
         setLoading(false);
       }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!title || !category || !quilRef.current) return;

    setIsAdding(true);

    try {
      const blog = {
        title,
        subTitle,
        category,
        isPublished,
        description: quilRef.current.root.innerHTML,
      };

      const formData = new FormData();
      formData.append("blog", JSON.stringify(blog));
      formData.append("image", image);

      const { data } = await axios.post("/api/blogs/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // send token
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Backend response:", data);

      if (data.success) {
        toast.success(data.message);
        setImage(null);
        setTitle("");
        setSubTitle("");
        setCategory("");
        quilRef.current.root.innerHTML = "";
        if (onBlogAdded) {
           onBlogAdded(); // Call the refresh callback
        }
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Error adding blog:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    if (!quilRef.current && editorRef.current) {
      quilRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);

  return (
    <form onSubmit={onSubmitHandler} className="flex-1 text-gray-600 h-full overflow-scroll">
      <div className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded">
        <p>Upload thumbnail</p>
        <label htmlFor="image">
          <img
            src={image ? URL.createObjectURL(image) : assets.upload_area}
            alt="upload preview"
            className="mt-12 h-16 rounded cursor-pointer"
          />
          <input
            type="file"
            id="image"
            hidden
            required
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        <p>Blog title</p>
        <input
          type="text"
          placeholder="Enter blog title"
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
        />

        <p>Blog subtitle</p>
        <input
          type="text"
          placeholder="Enter blog subtitle"
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          onChange={(e) => setSubTitle(e.target.value)}
          value={subTitle}
        />

        <p className="mt-4">Blog Description</p>
        <div className="max-w-lg h-74 pb-16 sm:pb-20 relative">
          <div ref={editorRef}></div>
          {loading && <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">Loading...</p>
            </div>
          </div>}
          <button
            type="button"
            disabled={loading}
            onClick={generateContent}
            className="absolute bottom-2 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer sm:static sm:mt-4 sm:w-full"
            style={{ zIndex: 10 }}
          >
            Create with AI
          </button>
        </div>

        <p className="mt-4">Blog category</p>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          name="category"
          className="mt-2 px-3 border text-gray-500 border-gray-300 outline-none rounded"
          required
        >
          <option value="">Select category</option>
          {blogCategories.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-3 mt-6">
          <p>Publish Now</p>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </div>

        <button
          type="submit"
          disabled={isAdding}
          className="mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm"
        >
          {isAdding ? "Adding..." : "Add Blog"}
        </button>
      </div>
    </form>
  );
}

export default AddBlog;
