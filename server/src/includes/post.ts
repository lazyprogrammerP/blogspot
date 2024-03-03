import { Prisma } from "@prisma/client";

const postInclude: Prisma.PostInclude = {
  author: {
    select: { firstName: true, lastName: true, username: true, email: true },
  },
  tags: true,
  comments: true,
};

export default postInclude;
