import { z } from "zod";

const ViewPostsRequestSchema = z.object({
  page: z.string(),
  tags: z.array(z.string()).optional(),
});

export default ViewPostsRequestSchema;
