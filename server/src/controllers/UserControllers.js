const bcrypt = require('bcrypt');
const User = require('../models/UserModels');
const { generateToken } = require('../service/jwtTokenGeneration');


const createUser = async (req, res) => {
    try {
        const body = req.body;

        const username = (body.Username || body.username || '').trim();
        const role = (body.Role || body.role || '').trim();
        const email = (body.Email || body.email || '').trim().toLowerCase();
        const district = (body.District || body.district || '').trim();
        const phoneNumber = String(body.PhoneNumber || body.phoneNumber || body.phone || '').trim();
        const password = body.Password || body.password;

     
        if (!username || !role || !email || !district || !phoneNumber || !password) {
            return res.status(400).json({ message: 'All fields must be filled' });
        }

      
        if (!/^[0-9]{10}$/.test(phoneNumber)) {
            return res.status(400).json({ message: 'Phone number must be exactly 10 digits long' });
        }

     
        if (String(password).length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

      
        const existingUser = await User.findOne({ email });


        if (existingUser) {
            return res.status(409).json({ message: 'Email is already registered' });
        }

        const hashedPassword = await bcrypt.hash(String(password), 10);
        const newUser = new User({
            username,
            role,
            email,
            district,
            phoneNumber,
            password: hashedPassword,
        });

        await newUser.save();
        const userResponse = {
            id: newUser._id,
            username: newUser.username,
            role: newUser.role,
            email: newUser.email,
            district: newUser.district,
            phoneNumber: newUser.phoneNumber,
        };
   
        return res.status(201).json({ message: 'User created successfully',user: userResponse });

    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Internal server error occurred' });
    }
};

const loginUser = async (req, res) => {
    try {
        const email = (req.body.Email || req.body.email || '').trim().toLowerCase();
        const password = req.body.Password || req.body.password;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ $or: [{ email }, { Email: email }] });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if(user.banned){
            return res.status(403).json({ message: 'Your account has been banned.' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }


        const token = generateToken(user);
        const userResponse = {
            id: user._id,
            username: user.username || user.Username,
            role: user.role || user.Role,
            email: user.email || user.Email,
            district: user.district || user.District,
            phoneNumber: user.phoneNumber || user.PhoneNumber,
        };

        res.status(200).json({ message: 'Login successful', token, user: userResponse });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Error logging in user' });
    }
};

const updateProfile=async(req,res)=>{
     const userId=req.params.id;
     const user=await User.findById(userId);
     if(!user){
        return res.status(404).json({message:'User not found'});
     }
     const username=req.body.Username || req.body.username || user.username;
     const role=req.body.Role || req.body.role || user.role;
     const email=req.body.Email || req.body.email || user.email;
     const district=req.body.District || req.body.district || user.district;
     const phoneNumber=req.body.PhoneNumber || req.body.phoneNumber || user.phoneNumber;
     const password=req.body.Password || req.body.password || user.password;

     if(phoneNumber && !/^[0-9]{10}$/.test(phoneNumber)){
        return res.status(400).json({message:'Phone number must be exactly 10 digits long'});
     }
    if(password && String(password).length<8){  
      return res.status(400).json({message:'Password must be at least 8 characters long'});
    }
        user.username=username;
        user.role=role;
        user.email=email;
        user.district=district;
        user.phoneNumber=phoneNumber;
        if(password && password !== user.password){
            const hashedPassword=await bcrypt.hash(password,10);
            user.password=hashedPassword;
        }
        await user.save();
        return res.status(200).json({message:'Profile updated successfully',user:user});  
}
const updatePassword=async(req,res)=>{
    const userId=req.params.id;
    const user=await User.findById(userId);
    if(!user){
         return res.status(404).json({message:'User not found'});
    }
    const currentPassword=req.body.currentPassword;
    const newPassword=req.body.newPassword;
    if(!currentPassword || !newPassword){
        return res.status(400).json({message:'Current password and new password are required'});
    }
    const passwordMatch=await bcrypt.compare(currentPassword,user.password);
    if(!passwordMatch){
        return res.status(401).json({message:'Current password is incorrect'});
    }
    if(String(newPassword).length<8){
        return res.status(400).json({message:'New password must be at least 8 characters long'});
    }
    const hashedPassword=await bcrypt.hash(newPassword,10);
    user.password=hashedPassword;
    await user.save();

    return res.status(200).json({message:'Password updated successfully'});
}
module.exports = { createUser, loginUser,updateProfile, updatePassword };