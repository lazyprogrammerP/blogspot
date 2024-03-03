import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import JWTPayload from "../types/common/jwt-payload";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("Please add a JWT_SECRET to the environment variables.");
}

const verifyToken: express.Handler = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).send({ error: `Unauthorized access.` });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    req.cookies = { userId: decoded.userId, email: decoded.email };

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Invalid token." });
  }
};

export default verifyToken;
