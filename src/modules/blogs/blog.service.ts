import type { Request } from "express";
import { prisma } from "../../config/prisma";
import type { Post, PostStatus } from "../../generated/prisma/client";
import type { PostWhereInput } from "../../generated/prisma/models";
import type { TUser } from "../../middleware/auth";
import paginationOptions from "../../utils/pagination.util";

const createBlog = async (data: Post) => {
  const result = await prisma.post.create({ data });

  return result;
};

const updateBlog = async (data: Partial<Post>, postId: string, user: TUser) => {
  const isAdmin = user.id === "admin";

  const post = await prisma.post.findUniqueOrThrow({
    where: { id: postId },
    select: {
      id: true,
      author_id: true,
    },
  });

  if (user.id !== post.author_id && !isAdmin) {
    throw new Error("You can't update anyother post");
  }

  if (!isAdmin) {
    delete data.is_featured;
  }

  const result = await prisma.post.update({
    where: { id: postId },
    data,
  });

  return result;
};

const getBlog = async (req: Request) => {
  const { id } = req.params;

  if (!id) {
    throw new Error("Post id is required");
  }

  const result = await prisma.$transaction(async (tx) => {
    const post = await tx.post.findUnique({
      where: {
        id,
      },
      include: {
        _count: true,

        comments: {
          where: {
            parent_id: null,
            status: "approved",
          },
          orderBy: { created_at: "desc" },
          include: {
            _count: true,
            replies: {
              where: {
                status: "approved",
              },
              orderBy: { created_at: "asc" },
              include: {
                _count: true,
                replies: {
                  where: {
                    status: "approved",
                  },
                  orderBy: { created_at: "asc" },
                },
              },
            },
          },
        },

        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await tx.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return post;
  });

  return result;
};

const getBlogs = async (req: Request) => {
  const { status, search, tags, featured } = req.query;
  const { page, limit, skip, orderBy, order } = paginationOptions(req);

  const where: PostWhereInput = {
    ...(status && ["draft", "published", "archived"].includes(status as string)
      ? {
          status: status as PostStatus,
        }
      : {}),

    ...(search
      ? {
          OR: [
            {
              title: {
                contains: search as string,
                mode: "insensitive",
              },
            },

            {
              content: {
                contains: search as string,
                mode: "insensitive",
              },
            },

            {
              tags: {
                has: search as string,
              },
            },
          ],
        }
      : {}),

    ...(tags
      ? {
          tags: {
            hasSome: (tags as string).split(","),
          },
        }
      : {}),

    ...(featured && ["true", "false"].includes(featured as string)
      ? {
          is_featured: JSON.parse(featured as string),
        }
      : {}),
  };

  // custom way
  // const [blogs, total] = await Promise.all([
  //   prisma.post.findMany({
  //     skip,
  //     take: limit,
  //     where,
  //     orderBy: { [orderBy]: order },
  //   }),
  //   prisma.post.count({ where }),
  // ]);

  // build in way
  const [blogs, total] = await prisma.$transaction([
    prisma.post.findMany({
      skip,
      take: limit,
      where,
      orderBy: { [orderBy]: order },

      include: {
        _count: {
          select: { comments: true },
        },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return { page, limit, total, blogs };
};

const getMyBlogs = async (req: Request) => {
  const { user } = req;

  if (!user?.id) {
    throw new Error("User id is required");
  }

  const result = prisma.post.findMany({
    where: {
      author_id: user.id,
    },
    include: {
      _count: {
        select: { comments: true },
      },
      comments: true,
    },
  });

  const total = await prisma.post.aggregate({
    _count: {
      author_id: true,
    },
  });

  //  const total = await prisma.post.count({
  //    where: {
  //      author_id: user.id,
  //    },
  //  });

  return { total, result };
};

const deleteBlog = async (req: Request) => {
  const { params, user } = req;

  const isAdmin = user?.role === "admin";

  if (!params.id) {
    throw new Error("Post id is required");
  }

  const post = await prisma.post.findUniqueOrThrow({
    where: { id: params.id },
    select: { author_id: true },
  });

  if (post.author_id !== user?.id && !isAdmin) {
    throw new Error("You cant't delte anyother post");
  }

  const result = await prisma.post.delete({
    where: { id: params.id },
  });

  return result;
};

const blogServie = {
  createBlog,
  updateBlog,
  getBlog,
  getBlogs,
  getMyBlogs,
  deleteBlog,
};

export default blogServie;
