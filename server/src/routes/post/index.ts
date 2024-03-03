import express from "express";
import postInclude from "../../includes/post";
import Prisma from "../../prisma";
import CreateOrUpdatePostRequest from "../../types/request/post/create";
import DeletePostRequestParams from "../../types/request/post/delete";
import GetPostByIdRequestParams from "../../types/request/post/post-by-id";
import ViewPostsRequest from "../../types/request/post/view";
import CreateOrUpdatePostResponse from "../../types/response/post/create";
import DeletePostResponse from "../../types/response/post/delete";
import GetPostByIdResponse from "../../types/response/post/post-by-id";
import ViewPostsResponse from "../../types/response/post/view";
import CreateOrUpdatePostRequestSchema from "../../validators/post/create";
import ViewPostsRequestSchema from "../../validators/post/view";

const postRouter = express.Router();

// Get All Posts for Current User - ?page=...&tags=...
postRouter.get("/", async (req: express.Request<null, ViewPostsResponse, null, ViewPostsRequest>, res: express.Response<ViewPostsResponse>) => {
  const userId = req.cookies["userId"];
  if (!userId) {
    return res.status(403).send({ error: "Unauthorized access." });
  }

  try {
    const validation = ViewPostsRequestSchema.safeParse(req.query);
    if (!validation.success) {
      return res.status(400).send({ error: `${validation.error.message}` });
    }

    const posts = await Prisma.post.findMany({
      where: {
        id: userId,
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
      orderBy: {
        updatedAt: "desc",
      },
    });

    return res.status(200).send({ posts });
  } catch (error) {
    return res.status(500).send({ error: error instanceof Error ? error.message : "Something unexpected went wrong." });
  }
});

// Get Post by ID
postRouter.get("/:id", async (req: express.Request<GetPostByIdRequestParams, GetPostByIdResponse, null, null>, res: express.Response<GetPostByIdResponse>) => {
  const userId = req.cookies["userId"];
  if (!userId) {
    return res.status(403).send({ error: "Unauthorized access." });
  }

  try {
    const post = await Prisma.post.findUnique({
      where: { id: parseInt(req.params.id), author: { id: userId } },
      include: postInclude,
    });

    if (!post) {
      return res.status(404).send({ error: `Post with the given ID was not found.` });
    }

    return res.status(200).send({ post });
  } catch (error) {
    return res.status(500).send({ error: error instanceof Error ? error.message : "Something unexpected went wrong." });
  }
});

// Create a Post
postRouter.post("/", async (req: express.Request<null, CreateOrUpdatePostResponse, CreateOrUpdatePostRequest, null>, res: express.Response<CreateOrUpdatePostResponse>) => {
  const userId = req.cookies["userId"];
  if (!userId) {
    return res.status(403).send({ error: "Unauthorized access." });
  }

  try {
    const validation = CreateOrUpdatePostRequestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).send({ error: `${validation.error.message}` });
    }

    const post = await Prisma.post.create({
      data: {
        title: req.body.title,
        content: req.body.content,
        published: req.body.published,
        scheduledAt: req.body.scheduledAt ? new Date(req.body.scheduledAt) : null,
        author: {
          connect: { id: userId },
        },
        tags: {
          connectOrCreate: req.body.tags.map((tagName) => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
        },
      },
      include: postInclude,
    });

    return res.status(200).send({ post });
  } catch (error) {
    return res.status(500).send({ error: error instanceof Error ? error.message : "Something unexpected went wrong." });
  }
});

// Update a Post by ID
postRouter.put("/:id", async (req: express.Request<{ id: string }, CreateOrUpdatePostResponse, CreateOrUpdatePostRequest, null>, res: express.Response<CreateOrUpdatePostResponse>) => {
  const userId = req.cookies["userId"];
  if (!userId) {
    return res.status(403).send({ error: "Unauthorized access." });
  }

  try {
    const validation = CreateOrUpdatePostRequestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).send({ error: `${validation.error.message}` });
    }

    const post = await Prisma.post.update({
      where: { id: parseInt(req.params.id), author: { id: userId } },
      data: {
        title: req.body.title,
        content: req.body.content,
        published: req.body.published,
        scheduledAt: req.body.scheduledAt ? new Date(req.body.scheduledAt) : null,
        author: {
          connect: { id: userId },
        },
        tags: {
          connectOrCreate: req.body.tags.map((tagName) => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
        },
      },
      include: postInclude,
    });

    return res.status(200).send({ post });
  } catch (error) {
    return res.status(500).send({ error: error instanceof Error ? error.message : "Something unexpected went wrong." });
  }
});

// Delete a Post by ID
postRouter.delete("/:id", async (req: express.Request<DeletePostRequestParams, DeletePostResponse, null, null>, res: express.Response<DeletePostResponse>) => {
  const userId = req.cookies["userId"];
  if (!userId) {
    return res.status(403).send({ error: "Unauthorized access." });
  }

  try {
    await Prisma.post.deleteMany({ where: { id: parseInt(req.params.id), author: { id: userId } } });
    return res.status(200).send({ success: true });
  } catch (error) {
    return res.status(500).send({ error: error instanceof Error ? error.message : "Something unexpected went wrong." });
  }
});

export default postRouter;
