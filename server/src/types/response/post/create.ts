import { Post } from "@prisma/client";
import ErrorResponse from "../error";

type CreateOrUpdatePostResponse =
  | ErrorResponse
  | {
      post: Post;
    };

export default CreateOrUpdatePostResponse;
