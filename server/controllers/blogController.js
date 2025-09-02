import main from '../configs/gemini.js';
import imageKit from '../configs/imageKit.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comments.js';

export const addBlog = async (req, res) => {
    try {
        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
        const imageFile = req.file;

        if (!title || !description || !category || !imageFile) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const response = await imageKit.upload({
            file: imageFile.buffer,
            fileName: imageFile.originalname,
            folder: "/blogs"
        });

        const optimizedImageUrl = imageKit.url({
            path: response.filePath,
            transformation: [
                { quality: 'auto' },
                { format: 'webp' },
                { width: '1280' }
            ]
        });

        await Blog.create({ title, subTitle, description, category, image: optimizedImageUrl, isPublished });

        res.json({ success: true, message: "Blog added successfully" });

    } catch (error) {
        console.error("Add Blog Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({isPublished: true});
        res.json({ success: true,  blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const getBlogById = async (req, res) => {
    try {
        const { blogId } = req.params;
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        res.json({ success: true, blog });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const deleteBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        await Blog.findByIdAndDelete(id);
        await Comment.deleteMany({ blog: id });
        res.json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const togglePublish = async (req, res) => {
    try {
        const { blogId } = req.params;
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        blog.isPublished = !blog.isPublished;
        await blog.save();
        res.json({ success: true, message: "Blog updated successfully", blog });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const addComment = async (req, res) => {
    try {
        const { blog, name, content } = req.body;
        await Comment.create({ blog, name, content });
        res.json({ success: true, message: "Comment added successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const getCommentsByBlogId = async (req, res) => {
    try {
        const { blogId } = req.params;
        const comments = await Comment.find({ blog: blogId, isApproved: true }).sort({ createdAt: -1 });
        res.json({ success: true, comments });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const generateContent = async (req, res) => {
    try {
        const { prompt } = req.body;
        const content=await main(prompt + " generate in a blog post format");
        res.json({ success: true, content });
    } catch (error) {
        console.error("Generate Content Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};