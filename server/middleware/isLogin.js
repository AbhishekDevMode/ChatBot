import express from "express";
import User from "../Models/userModels.js";
import jwt from "jsonwebtoken";
const isLogin = async (req, res, next) => {
  try {
    let token = req.cookies?.jwt;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res
        .status(401)
        .send({ success: false, message: "User Unauthorized" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res
        .status(401)
        .send({ success: false, message: "User unauthorized invalid token" });
    }
    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(`error is in isLogin middleware ${error.message}`);
    res.status(401).send({
      success: false,
      message: "Unauthorized token invalid"
    });
  }
};
export default isLogin;
