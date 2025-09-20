import UserModel from "../models/User.js";
import BadRequestError from "../errors/bad-request.js";
import notFound from "../errors/not-found.js";
import unauthenteation from "../errors/unauthenticated.js"
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken"
export const register = async (req, res) => {
  
  const newUser = await UserModel.create({...req.body});
  const token = await newUser.createJWT();

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "User created successfully", data:{name:newUser.name} ,token});
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if ( !email || !password) {
    throw new BadRequestError("email and password are required");
  }
  const user =await UserModel.findOne({email})
  if(!user)
  {
    throw new notFound("the user not found");
  }
  const ispassCorrect = await user.comparePassword(password);
  if(!ispassCorrect)
  {
    throw new unauthenteation("invalid cradientials")
  }
  const token = user.createJWT();
  res.status(StatusCodes.ACCEPTED).json({msg:"login in succefiully" , token})
};
