import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
 
    const authHeader = req.headers.authorization;
    
   
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Unauthorized. No token provided." });
    }

   
    const token = authHeader.split(' ')[1];

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next(); 
    } catch (err) {
        res.status(401).json({ message: "Unauthorized. Invalid token." });
    }
}

export default auth;