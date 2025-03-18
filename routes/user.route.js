import express from 'express'
import { loginController, signupController,signup, login } from '../controllers/user.controller.js';
import authenticateAndAuthorize from '../middlewares/authenticateAndAuthorize.js';
import User from '../models/user.model.js';
import upload from '../config/multerConfig.js';
import cloudinary from '../config/cloudinaryConfig.js';
const router = express.Router();


// sign up 
router.get("/signup",signupController);
router.post("/signup",signup);

// login 
router.get("/login",loginController);
router.post("/login",login);

// profile 
router.get("/profile",authenticateAndAuthorize(["user","admin"]),async(req,res)=>{
    const user =  await User.findById(req.user._id).select("-password");
    res.render("./dashboard/user/profile.ejs",{user})
});


// edit profile 
router.get("/edit-profile",authenticateAndAuthorize(["user","admin"]),async(req,res)=>{
    const user =  await User.findById(req.user._id).select("-password");
    res.render("./dashboard/user/edit-profile",{user})
});




router.post('/edit-profile', authenticateAndAuthorize(["user","admin"]),upload.single('profilePicture'), async (req, res) => {
    try {
      const { username, email } = req.body;
      let profilePictureUrl;
      let profilePicturePublicId;
  
      console.log('Form Data:', req.body);
      console.log('Uploaded File:', req.file);
  
      // Upload to Cloudinary if a file is provided
      if (req.file) {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: 'profile_pictures', // Cloudinary folder name
          public_id: `user_${req.user._id}`, // Unique ID for the user
          overwrite: true, // Overwrite existing file if re-uploaded
        });
        profilePictureUrl = uploadResult.secure_url;
        profilePicturePublicId = uploadResult.public_id;
      }
  
      // Update user details in the database
      const user = await User.findById(req.user._id); // Ensure `req.user` is populated
      if (!user) {
        req.flash('error', 'User not found.');
        return res.redirect('/user/login');
      }
  
      if (username) user.username = username;
      if (email) user.email = email;
      if (profilePictureUrl && profilePicturePublicId) {
        user.profile.url = profilePictureUrl
        user.profile.public_id = profilePicturePublicId
      }
  
      await user.save();
  
      req.flash('success', 'Profile updated successfully');
      return res.redirect('/user/profile');

    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });



  router.post('/logout', authenticateAndAuthorize(['user', 'admin']), (req, res) => {
    try {
      // Clear session cookie
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict', // Prevent CSRF
      });

      req.flash('success', 'Logout successful');
      return res.redirect('/user/login');

    } catch (error) {
      console.error('Logout Error:', error);
      req.flash('error', 'Failed to log out');
      return res.redirect('/user/login');
    }
  });
  



export default router