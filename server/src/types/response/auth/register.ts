import ErrorResponse from "../error";

type RegisterResponse =
  | ErrorResponse
  | {
      message: string;
    };

export default RegisterResponse;
