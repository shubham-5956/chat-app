import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async(req,res)=>{
    try {
            const {fullname, username, password, confirmPassword, gender}=req.body;
            // console.log(fullname);
            // console.log(username);
            // console.log(password);
            // console.log(confirmPassword);
            // console.log(gender);
            if(!fullname || !username|| !password|| !confirmPassword|| !gender){
            return res.status(400).json({
                message:"All fields are mandatory"
            });
            }
            if(password !== confirmPassword){
                return res.status(400).json({
                    message:"Password is Different"
                });
            }
            const user = await User.findOne({username});
            if(user){
                return res.status(400).json({
                    message:"Username already exist try different"
                });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const maleAvatar=`https://avatar.iran.liara.run/public/boy?username=${username}`;
            const femaleAvatar=`https://avatar.iran.liara.run/public/girl?username=${username}`;
            await User.create({
                fullname,
                username,
                password: hashedPassword,
                profilePhoto: gender === "male" ? maleAvatar:femaleAvatar,
                gender
            });
            return res.status(201).json({
                message:"Acccount created successfully",
                success: true
            });
    } catch (error) {
        console.log(error);
    }
};

export const login = async(req,res)=>{
    try {
        const {username, password} = req.body;
        if(!username || !password){
            return res.status(400).json({
                message:"All fields are mandatory"
            })
        }
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({
                message:"Username is incorrect",
                success: false
            })
        };
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                message:"Password is incorrect",
                success: false
            })
        };

        const tokenData={
            userId:user._id
        };
        const token = await jwt.sign(tokenData, process.env.JWT_KEY,{expiresIn:'1d'});
        return res.status(200).cookie("token", token, {maxAge:24*60*60*1000, httpOnly: true, sameSite:'strict'}).json({
            _id:user._id,
            username: user.username,
            fullname: user.fullname,
            profilePhoto: user.profilePhoto
        }); 
    } catch (error) {
        console.log(error);
        
    }
};

export const logout = (req,res) => {
    try {
        return res.status(200).cookie("token", "",{maxAge:0}).json({
            message:"Successfully logged out."
        })
    } catch (error) {
        console.log(error);
    }
}

export const getOtherUser = async(req,res) => {
    try{
        const loggedInUserId = req.id;
        const otherUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        return res.status(200).json(otherUsers);

    } catch (error) {
        console.log(error);
    }
}