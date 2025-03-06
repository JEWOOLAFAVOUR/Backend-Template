import { Request, Response } from "express";
import { User } from "../../models/user/user";
import crypto from "crypto-js";
import { generateAccessToken } from "../../middlewares/verifyToken";
import { sendError } from "../../utils/helper";

const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, avatar } = req.body;

    const secret_key = process.env.PASS_SEC;

    if (!secret_key) {
      throw new Error("error variable ");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser)
      return sendError(res, 400, "Username or Email already exists");

    const hashedPassword = crypto.AES.encrypt(password, secret_key).toString();
    let picked_avatar = avatar || 1;

    // Create and save new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      avatar: picked_avatar,
    });

    await newUser.save();

    // Generate JWT token
    const token = generateAccessToken(newUser._id.toString(), false);

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        token,
      },
    });
  } catch (error) {
    return sendError(res, 500, "Internal server error");
  }
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const secret_key = process.env.PASS_SEC;

    if (!secret_key) {
      throw new Error("error variable ");
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return sendError(res, 400, "Invalid email or password");

    // Decrypt and compare password
    const decryptedPassword = crypto.AES.decrypt(
      user.password,
      secret_key
    ).toString(crypto.enc.Utf8);

    if (decryptedPassword !== password) {
      return sendError(res, 400, "Invalid email or password");
    }

    // Generate JWT token
    const token = generateAccessToken(user._id.toString(), false);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        token,
      },
    });
  } catch (error) {
    return sendError(res, 500, "Internal server error");
  }
};

export default { createUser, loginUser };
