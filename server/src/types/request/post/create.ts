import { z } from "zod";
import CreateOrUpdateRequestSchema from "../../../validators/post/create";

type CreateOrUpdatePostRequest = z.infer<typeof CreateOrUpdateRequestSchema>;

export default CreateOrUpdatePostRequest;
