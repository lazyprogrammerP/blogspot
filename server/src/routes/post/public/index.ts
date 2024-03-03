import express from "express";
import postInclude from "../../../includes/post";
import Prisma from "../../../prisma";
import ViewPostsRequest from "../../../types/request/post/view";
import ViewPostsResponse from "../../../types/response/post/view";
import ViewPostsRequestSchema from "../../../validators/post/view";

const publicPostRouter = express.Router();

// Get All Posts for Current User - ?page=...&tags=...
publicPostRouter.get("/", async (req: express.Request<null, ViewPostsResponse, null, ViewPostsRequest>, res: express.Response<ViewPostsResponse>) => {
  try {
    const validation = ViewPostsRequestSchema.safeParse(req.query);
    if (!validation.success) {
      return res.status(400).send({ error: `${validation.error.message}` });
    }

    const posts = await Prisma.post.findMany({
      where: {
        published: true,
        tags: {
          some: {
            name: {
              in: req.query.tags,
            },
          },
        },
      },
      include: postInclude,
      skip: parseInt(req.query.page) * 9,
      take: 9,
    });

    return res.status(200).send({ posts });
  } catch (error) {
    return res.status(500).send({ error: error instanceof Error ? error.message : "Something unexpected went wrong." });
  }
});

export default publicPostRouter;
