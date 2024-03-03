import ErrorResponse from "../error";

type LoginResponse =
  | ErrorResponse
  | {
      token: string;
    };

export default LoginResponse;
