import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const signupController = (req,res)=>{
    res.render("signup.ejs")
};


export const signup = async(req,res)=>{
    const {username,email,password,terms} = req.body;

    if(!username || !email || !password || !terms){
         req.flash('error','all fields mendatory')
         return res.redirect("/user/signup");
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
      req.flash('error',"Email already exist");
      return res.redirect("/user/signup");
    }

    const hashPassword = await bcrypt.hash(password,9);
    await new User({
        username,
        email,
        password:hashPassword,
        terms
    }).save();

//    return res.status(200).json({success:true,message:"Sign up successfully."});
        req.flash('success',"Sign up successfully.");
        return res.redirect("/user/login");
};



export const loginController = (req,res)=>{
    res.render("login.ejs")
};




export const login = async (req, res) => {
    // console.log(req.body)

    try {
        const { email, password, terms } = req.body;

        // Validate input fields
        if (!email || !password || !terms) {
            req.flash('error', 'All fields are mandatory.');
            return res.redirect('/user/login');
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            req.flash('error', 'Email not found.');
            return res.redirect('/user/login');
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            req.flash('error', 'Invalid credentials.');
            return res.redirect('/user/login');
        }

        // Generate JWT token
        const payload = {
            id: existingUser._id,
            email: existingUser.email,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

        // Set cookie with token
        res.cookie('token', token, {
            httpOnly: true, // Secure the cookie to prevent client-side access
            secure: process.env.NODE_ENV === 'production', // Set true in production
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });

        // Redirect to dashboard or desired page
        req.flash('success', 'Login successful!');
        return res.redirect('/'); // Adjust as needed

    } catch (error) {
        console.error('Login error:', error);
        req.flash('error', 'An unexpected error occurred. Please try again.');
        return res.redirect('/user/login');
    }
};
