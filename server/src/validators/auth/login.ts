import { z } from "zod";

const LoginRequestSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export default LoginRequestSchema;
