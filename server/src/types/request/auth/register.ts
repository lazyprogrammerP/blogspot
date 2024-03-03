import { z } from "zod";
import RegisterRequestSchema from "../../../validators/auth/register";

type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

export default RegisterRequest;
