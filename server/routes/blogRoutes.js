import express from 'express'
import { addBlog, getAllBlogs, togglePublish, deleteBlogById, getBlogById, addComment, getCommentsByBlogId } from '../controllers/blogController.js';
import upload from '../middleware/multer.js';
import auth from '../middleware/auth.js';
import { generateContent } from '../controllers/blogController.js';

const blogRouter = express.Router();

blogRouter.post("/add", upload.single("image"), auth, addBlog);
blogRouter.get("/all", getAllBlogs);
blogRouter.get("/:blogId", getBlogById);
blogRouter.delete("/:id", auth, deleteBlogById);
blogRouter.put("/:id/toggle-publish", auth, togglePublish);
blogRouter.post("/add-comment", addComment);
blogRouter.get("/:blogId/comments", getCommentsByBlogId);
blogRouter.post("/generate", generateContent);

export default blogRouter;