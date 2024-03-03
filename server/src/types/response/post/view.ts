import { Post } from "@prisma/client";
import ErrorResponse from "../error";

type ViewPostsResponse =
  | ErrorResponse
  | {
      posts: Array<Post>;
    };

export default ViewPostsResponse;
