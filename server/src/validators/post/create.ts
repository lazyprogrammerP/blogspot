import { z } from "zod";

const CreateOrUpdatePostRequestSchema = z
  .object({
    title: z.string(),
    content: z.string(),

    published: z.boolean().optional().default(false),
    scheduledAt: z.number().optional(),

    tags: z.array(z.string()),
  })
  .refine((schema) => {
    if (schema.tags.length === 0) {
      return false;
    }

    return true;
  });

export default CreateOrUpdatePostRequestSchema;
