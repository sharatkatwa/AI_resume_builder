import { JWTPayload } from "@/types/user.types";
import jwt from "jsonwebtoken";

export const generateJWT = (payload: JWTPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });
};

export const verifyJWT = (token: string): unknown => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};
