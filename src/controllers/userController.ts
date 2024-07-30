import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Users from "../models/userModel";
import jwt from "jsonwebtoken";

const controller = {
  GetLogin: async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      const { email, password } = req.body;
      const userExists = await Users.findOne({ email });
      if (!userExists) {
        throw new Error("Please signup");
      } else {
        const passwordMatch = await bcrypt.compare(
          password,
          userExists.password
        );
        if (!password) {
          throw new Error("The password is not match");
        }
        const jwt_secret = process.env.ACCESS_TOKEN;
        if (!jwt_secret) {
          throw new Error("Access token is not getting");
        }
        const token = jwt.sign(
          {
            _id: userExists._id,
            name: userExists.name,
            email: userExists.email,
          },
          jwt_secret
        );
        res.cookie("user", token, {
          httpOnly: true,
          maxAge: 100 * 60 * 60 * 24,
        });
        res.status(200).json({
          success: true,
          message: "Successfully login",
          data: userExists,
        });
      }
    } catch (error) {
      console.error("Something wrong", error);
    }
  },
  GetSignup: async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      const { name, email, password } = req.body;
      const userExists = await Users.findOne({ email });
      if (userExists) {
        throw new Error("user alredy exists");
      } else {
        const newUser = new Users({
          name: name,
          email: email,
          password: password,
        });

        const saveUSer = await newUser.save();

        const jwt_secret = process.env.ACCESS_TOKEN;
        if (!jwt_secret) {
          throw new Error("Access token does not getting");
        }
        const token = jwt.sign(
          {
            _id: saveUSer._id,
            name: saveUSer.name,
            email: saveUSer.email,
          },
          jwt_secret
        );

        res.cookie("user", token, {
          httpOnly: true,
          maxAge: 100 * 60 * 60 * 24,
        });
        const data = {
          name: newUser.name,
          email: newUser.email,
          isAvatarImageset: newUser.isAvatarImageset,
        };
        res.status(201).json({ success: true, message: "Successfully", data });
      }
    } catch (error: any) {
      console.error("Something happen", error);
      res.status(500).json({ success: false, error: error?.message });
    }
  },
  GetAllUser: async (req: Request, res: Response) => {
    try {
      console.log(req.params.id);
      const RestOfthem = await Users.find({ _id: { $ne: req.params.id } });
      res.json({ success: true, data: RestOfthem });
    } catch (err) {
      console.error(err);
    }
  },
  GetCurrentUser: async (req: Request, res: Response) => {
    try {
      console.log(req.params);
      const { email } = req.params;
      const currentUser = await Users.findOne({ email: email });
      if (currentUser) {
        res.status(201).json({ success: true, data: currentUser });
      } else {
        res.status(400).json({ success: false, error: "is not valid" });
      }
    } catch (err: any) {}
  },
  setAvatar: async (req: Request, res: Response) => {
    try {
      console.log(req.params);
      console.log(req.body);
      await Users.updateOne(
        { email: req.params.email },
        { $set: { isAvatarImageset: true, avatarImage: req.body.image } }
      );
      const after = await Users.findOne({ email: req.params.email });
      if (!after) {
        res.json({ isSet: false });
      } else {
        res.json({ success: true, data: after });
      }
    } catch (err) {
      console.log(err);
    }
  },
  Logout: async (req: Request, res: Response) => {
    try {
      // console.log(req.body, "kkkookokoko");
      res.clearCookie("token").send({ message: "user logout" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(err.message);
      } else {
        console.log(
          "unknow in error in the logout functionality-usercontroler"
        );
      }
    }
  },
};

export default controller;
