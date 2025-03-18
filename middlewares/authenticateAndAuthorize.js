import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


const authenticateAndAuthorize = (allowedRoles)=>{
    return async(req,res,next)=>{
      let {token} = req.cookies || req.headers;
    //   console.log(token)

      if(!token || token == "undefined"){
        req.flash("error","Please login to access this resource")
        return res.redirect("/user/login")
      }

      try {
       const decodedData =  jwt.verify(token,process.env.JWT_SECRET_KEY);

      const user =  await User.findById(decodedData.id).select("-password");
      req.user = user

      if(!allowedRoles.includes(user.role)){
        req.flash("error","Access denied: You do not have permission to access this resource")
        return res.redirect("/user/login")
      }
      next();
      } catch (error) {
        req.flash("error","Invalid token")
        return res.redirect("/user/login")
      }
    }
}

export default authenticateAndAuthorize