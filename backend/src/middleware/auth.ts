import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: any;
}

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      console.log("No Authorization header found");
      return res
        .status(401)
        .json({ message: "No authorization header, access denied" });
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token || token === authHeader) {
      console.log("No valid token found in Authorization header");
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Token verified successfully for user:", (decoded as any).id);
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token has expired" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(401).json({ message: "Token verification failed" });
  }
};
