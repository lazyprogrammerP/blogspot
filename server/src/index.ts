import dotenv from "dotenv";
import express from "express";
import verifyToken from "./middlewares/verify-token";
import authRouter from "./routes/auth";
import postRouter from "./routes/post";
import publicPostRouter from "./routes/post/public";
import HealthResponse from "./types/response/health";

dotenv.config();
const PORT = process.env.PORT || 8000;

const server = express();

// register global middlewares here
server.use(express.json());

server.get("/api/v1/health", (req, res: express.Response<HealthResponse>) => {
  return res.status(200).send({ status: "OK" });
});

server.use("/api/v1/auth", authRouter);
server.use("/api/v1/post/public", publicPostRouter);
server.use("/api/v1/post", verifyToken, postRouter);

// starts the server, no touching below this point
server.listen(PORT, () => console.log(`server is listening on http://127.0.0.1:${PORT}`));
