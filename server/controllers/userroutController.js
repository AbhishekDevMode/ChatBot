import User from "../Models/userModels.js";
import bcryptjs from "bcryptjs";
import jwtToken from "../utils/jwtwebToken.js";

//user register
export const userRegsiter = async (req, res) => {
  try {
    // console.log("Working");
    const { fullname, username, email, gender, password, profilepic } =
      req.body;
    const user = await User.findOne({ username, email });
    if (user)
      return res
        .status(500)
        .send({ success: false, message: "Username or email already exists" });
    const hashPassword = bcryptjs.hashSync(password, 10);
    const profileBoy =
      profilepic ||
      `https://ui-avatars.com/api/?name=${username}&background=random`;
    const profileGirl =
      profilepic ||
      `https://ui-avatars.com/api/?name=${username}&background=random`;
    const newUser = new User({
      fullname,
      username,
      email,
      password: hashPassword,
      gender,
      profilepic: gender === "male" ? profileBoy : profileGirl
    });

    if (newUser) {
      await newUser.save();
      jwtToken(newUser._id, res);
    } else {
      res.status(500).send({ success: false, message: "Invalid User Data" });
    }
    res.status(201).send({
      _id: newUser._id,
      fullname: newUser.fullname,
      username: newUser.username,
      profilepic: newUser.profilepic,
      email: newUser.email,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error
    });
    console.log(error);
  }
};
//user login
export const userLogin = async(req, res) => {
  try { 
    const {email,password}=req.body;
    const user=await User.findOne({email});
   if(!user)return res.status(500).send({success:false,message:"Email doesn't exist"});
   const comparePass=bcryptjs.compareSync(password,user.password || "");
   if(!comparePass) return res.status(500).send({success:false,message:"Email doesn't exist"});
   jwtToken(user._id,res);
   res.status(200).send({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      profilepic: user.profilepic,
      email:user.email,
      message:"Successfully Login"
   })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error
    });
    console.log(error);
  }
};
export const userLogOut=async(req,res)=>{
  try {
    res.cookie('jwt','',{
      maxAge:0
    })
    res.status(200).send({message:"User LogOut"})
  } catch (error) {
    res.status(500).send({
      success:false,
      message:error
    })
    console.log(error);
  }
}