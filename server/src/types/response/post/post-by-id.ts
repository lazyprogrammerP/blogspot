import { Post } from "@prisma/client";
import ErrorResponse from "../error";

type GetPostByIdResponse =
  | ErrorResponse
  | {
      post: Post;
    };

export default GetPostByIdResponse;
