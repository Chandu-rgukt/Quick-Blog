import jwt from 'jsonwebtoken';
import Blog from '../models/Blog.js';
import Comment from '../models/Comments.js';

export const adminLogin = async (req, res) => {
    try{
        const { email, password } = req.body;
        console.log("LOGIN ATTEMPT:");
        console.log("  Incoming Email:", JSON.stringify(email));
        console.log("  Expected Email:", JSON.stringify(process.env.ADMIN_EMAIL));
        console.log("  Incoming Password:", JSON.stringify(password));
        console.log("  Expected Password:", JSON.stringify(process.env.ADMIN_PASSWORD));
        
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET);
            return res.json({success:true, token });
        } else {
            return res.status(401).json({success:false, message: "Invalid admin credentials" });
        }


        
    }catch(error){
        res.json({success:false, message: "Internal server error" });

    }

};

export const getAllBlogsAdmin = async (req, res) => {
    try {
        const blogs = await Blog.find({}).sort({ createdAt: -1 });
        res.json({ success: true, blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find({})
                                      .populate('blog') // This should now work
                                      .sort({ createdAt: -1 });
        res.json({ success: true, comments });
    } catch (error) {
        console.error("Get All Comments Error:", error);
        res.status(500).json({ success: false, message: "Internal server error: " + error.message });
    }
};


export const getDashboard = async (req, res) => {
    try {
        const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(5);
        const blogs = await Blog.countDocuments();
        const comments = await Comment.countDocuments();
        const drafts= await Blog.countDocuments({ isPublished: false });

        const dashboardData = {
            recentBlogs,
            blogs,
            comments,
            drafts
        }
        res.json({ success: true, dashboardData });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


export const deleteCommentById = async (req, res) => {
    try {
        const { id } = req.params; // Change from req.body to req.params
        await Comment.findByIdAndDelete(id);
        res.json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const approveCommentById = async (req, res) => {
  try {
    console.log("Approving comment ID:", req.params.id);
    const { id } = req.params;
    const updatedComment = await Comment.findByIdAndUpdate(
      id, 
      { isApproved: true },
      { new: true }
    );
    
    console.log("Updated comment:", updatedComment);
    
    if (!updatedComment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }
    
    res.json({ success: true, message: "Comment approved successfully" });
  } catch (error) {
    console.error("Approve Comment Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};