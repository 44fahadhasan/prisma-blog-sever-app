import { prisma } from "../../config/prisma";

const getAnalytics = async () => {
  const [user, post, PostViews, comment] = await prisma.$transaction([
    prisma.user.count(),
    prisma.post.count(),
    prisma.post.aggregate({
      _sum: {
        views: true,
      },
    }),
    prisma.comment.count(),
  ]);

  return {
    user,
    post,
    totalPostViews: PostViews._sum.views,
    comment,
  };
};

const analyticServie = {
  getAnalytics,
};

export default analyticServie;
