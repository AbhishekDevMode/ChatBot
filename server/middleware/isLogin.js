import express from "express";
import User from "../Models/userModels.js";
import jwt from "jsonwebtoken";
const isLogin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(401)
        .send({ success: false, message: "User Unauthorized" });
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res
        .status(500)
        .send({ success: false, message: "User unauthorize invalid token" });
    }
    const user =await User.findById(decode.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(`error is in isLogin middleware ${error.message}`);
    res.status(500).send({
      success: false,
      message: error
    });
  }
};
export default isLogin;
