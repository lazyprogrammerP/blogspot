import { z } from "zod";

const RegisterRequestSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),

    username: z.string(),
    email: z.string(),

    password: z.string(),
  })
  .refine((schema) => {
    if (schema.password.length < 8) {
      return false;
    }

    return true;
  });

export default RegisterRequestSchema;
