import multer from "multer";

// use memory storage, not disk
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
