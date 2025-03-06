import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/helper";
import { User } from "../models/user/user";
import { promisify } from "util";
import { CustomRequest } from "../utils/types";

export const generateAccessToken = (
  userId: string,
  isAdmin: boolean
): string => {
  return jwt.sign({ id: userId, isAdmin }, process.env.JWT_SECRET as string, {
    expiresIn: "40d",
  });
};

// export const verifyToken = (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ): void => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return sendError(res, 401, "You are not authenticated");
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET as string
//     ) as JwtPayload;
//     req.user = decoded; // Attach decoded user details to request
//     next();
//   } catch (err) {
//     return sendError(res, 403, "Invalid token");
//   }
// };

// export const verifyTokenAndAuthorization = async (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return sendError(res, 403, "User not authorized");
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = (await promisify(jwt.verify)(
//       token,
//       process.env.JWT_SECRET as string
//     )) as JwtPayload;

//     req.userId = decoded.id;

//     const user = await User.findById(decoded.id);
//     if (!user) {
//       return sendError(res, 404, "User does not exist");
//     }

//     req.user = user;
//     next();
//   } catch (err: any) {
//     res.status(500).json({
//       status: "error",
//       message: err.message,
//     });
//   }
// };
