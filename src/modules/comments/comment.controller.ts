import type { Request, Response } from "express";
import commentServie from "./comment.service";

/** * Create a new comment
 */
const createComment = async (req: Request, res: Response) => {
  try {
    const { body, user } = req;

    if (!user?.id) {
      throw new Error("User id is required");
    }

    if (!body.post_id) {
      throw new Error("Post id is required");
    }

    const result = await commentServie.createComment({
      ...body,
      author_id: user.id,
    });

    res.status(201).json({ result });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/** * Update an existing comment
 */
const updateComment = async (req: Request, res: Response) => {
  try {
    const result = await commentServie.updateComment(req);

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/** * Update an existing comment
 */
const moderateComment = async (req: Request, res: Response) => {
  try {
    const { params, body } = req;

    if (!params.id) {
      throw new Error("Comment id is required");
    }

    const result = await commentServie.moderateComment(params.id, body.status);

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/** * Get a comment by ID
 */
const getComment = async (req: Request, res: Response) => {
  try {
    const result = await commentServie.getComment(req);

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/** * Get all comments of author
 */
const getCommentsOfAuthor = async (req: Request, res: Response) => {
  try {
    const result = await commentServie.getCommentsOfAuthor(req);

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/** * Delete a comment by ID
 */
const deleteComment = async (req: Request, res: Response) => {
  try {
    const result = await commentServie.deleteComment(req);

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/** * Comment Controller
 */
const commentController = {
  createComment,
  updateComment,
  moderateComment,
  getComment,
  getCommentsOfAuthor,
  deleteComment,
};

/** * Export the comment controller
 */
export default commentController;
