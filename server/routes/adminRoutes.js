import express from "express"
import auth from "../middleware/auth.js";
import { adminLogin, getAllComments, getAllBlogsAdmin, deleteCommentById, approveCommentById, getDashboard } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.get("/comments", auth, getAllComments);
adminRouter.get("/blogs", auth, getAllBlogsAdmin);
adminRouter.delete("/comments/:id", auth, deleteCommentById);
adminRouter.put("/comments/:id/approve", auth, approveCommentById);
adminRouter.get("/dashboard", auth, getDashboard);

export default adminRouter;