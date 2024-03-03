import bcrypt from "bcrypt";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import Prisma from "../../prisma";
import JWTPayload from "../../types/common/jwt-payload";
import LoginRequest from "../../types/request/auth/login";
import RegisterRequest from "../../types/request/auth/register";
import LoginResponse from "../../types/response/auth/login";
import RegisterResponse from "../../types/response/auth/register";
import LoginRequestSchema from "../../validators/auth/login";
import RegisterRequestSchema from "../../validators/auth/register";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("Please add a JWT_SECRET to the environment variables.");
}

const authRouter = express.Router();

authRouter.post("/register", async (req: express.Request<null, RegisterResponse, RegisterRequest, null>, res: express.Response<RegisterResponse>) => {
  try {
    const validation = RegisterRequestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).send({ error: `${validation.error.message}` });
    }

    const passwordHash = bcrypt.hashSync(req.body.password, 10);
    await Prisma.user.create({
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        passwordHash,
      },
    });

    return res.status(201).send({ message: "Registered the user successfully!" });
  } catch (error) {
    return res.status(500).send({ error: error instanceof Error ? error.message : "Something unexpected went wrong." });
  }
});

authRouter.post("/login", async (req: express.Request<null, any, LoginRequest, null>, res: express.Response<LoginResponse>) => {
  try {
    const validation = LoginRequestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).send({ error: `${validation.error.message}` });
    }

    const user = await Prisma.user.findUnique({ where: { email: req.body.email } });
    if (!user) {
      return res.status(404).send({ error: `User does not exist.` });
    }

    const isValidPassword = bcrypt.compareSync(req.body.password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).send({ error: `Invalid credentials.` });
    }

    const token = jwt.sign({ userId: user.id, email: user.email } as JWTPayload, JWT_SECRET, { expiresIn: "7d" });
    res.status(200).send({ token });
  } catch (error) {
    return res.status(500).send({ error: error instanceof Error ? error.message : "Something unexpected went wrong." });
  }
});

export default authRouter;
