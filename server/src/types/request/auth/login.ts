import { z } from "zod";
import LoginRequestSchema from "../../../validators/auth/login";

type LoginRequest = z.infer<typeof LoginRequestSchema>;

export default LoginRequest;
