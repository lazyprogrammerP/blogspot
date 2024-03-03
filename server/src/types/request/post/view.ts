import { z } from "zod";
import ViewPostsRequestSchema from "../../../validators/post/view";

type ViewPostsRequest = z.infer<typeof ViewPostsRequestSchema>;

export default ViewPostsRequest;
