import cron from "node-cron";
import Prisma from "../prisma";

const publishPosts = cron.schedule("* * * * *", async () => {
  const currentTimestamp = new Date();
  await Prisma.post.updateMany({ where: { published: false, scheduledAt: { lte: currentTimestamp } }, data: { published: true } });
});

export default publishPosts;
