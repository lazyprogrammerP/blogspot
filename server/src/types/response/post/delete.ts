import ErrorResponse from "../error";

type DeletePostResponse =
  | ErrorResponse
  | {
      success: true;
    };

export default DeletePostResponse;
