import type { Request } from "express";
import { prisma } from "../../config/prisma";
import type { Comment, CommentStatus } from "../../generated/prisma/client";

const createComment = async (data: Comment) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: data.post_id,
    },
  });

  if (data.parent_id) {
    await prisma.comment.findUniqueOrThrow({
      where: {
        id: data.parent_id,
      },
    });
  }

  const result = await prisma.comment.create({ data });

  return result;
};

const updateComment = async (req: Request) => {
  const { user, params, body } = req;

  if (!user?.id) {
    throw new Error("User id is required");
  }

  if (!params.id) {
    throw new Error("Comment id is required");
  }

  await prisma.comment.findFirstOrThrow({
    where: {
      id: params.id,
      author_id: user.id,
    },
  });

  const result = await prisma.comment.update({
    where: {
      id: params.id,
    },
    data: { ...body },
  });

  return result;
};

const moderateComment = async (id: string, status: CommentStatus) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: { id },
    select: { status: true },
  });

  if (comment.status === status) {
    throw new Error(`Status: '${status}' already set`);
  }

  const result = await prisma.comment.update({
    where: { id },
    data: { status },
  });

  return result;
};

const getComment = async (req: Request) => {
  const { id } = req.params;

  if (!id) {
    throw new Error("Comment id is required");
  }

  const result = await prisma.comment.findUnique({
    where: { id },
    include: {
      post: {
        select: {
          id: true,
          title: true,
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

  return result;
};

const getCommentsOfAuthor = async (req: Request) => {
  const { id } = req.params;

  if (!id) {
    throw new Error("Author id is required");
  }

  const result = await prisma.comment.findMany({
    where: { author_id: id },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          views: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  return result;
};

const deleteComment = async (req: Request) => {
  const { user, params } = req;

  if (!user?.id) {
    throw new Error("User id is required");
  }

  if (!params.id) {
    throw new Error("Comment id is required");
  }

  await prisma.comment.findFirstOrThrow({
    where: {
      id: params.id,
      author_id: user.id,
    },
  });

  const result = await prisma.comment.delete({
    where: {
      id: params.id,
    },
  });

  return result;
};

const commentServie = {
  createComment,
  updateComment,
  moderateComment,
  getComment,
  getCommentsOfAuthor,
  deleteComment,
};

export default commentServie;
