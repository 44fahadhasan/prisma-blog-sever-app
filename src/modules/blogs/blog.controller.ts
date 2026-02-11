import type { NextFunction, Request, Response } from "express";
import blogServie from "./blog.service";

/** * Create a new blog
 */
const createBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body, user } = req;

    if (!user?.id) {
      throw new Error("User id is required");
    }

    const result = await blogServie.createBlog({
      ...body,
      author_id: user.id,
    });

    res.status(201).json({ result });
  } catch (error) {
    next(error);
  }
};

/** * Update an existing blog
 */
const updateBlog = async (req: Request, res: Response) => {
  try {
    const { body, params, user } = req;

    if (!params.id) {
      throw new Error("Post id is required");
    }

    const result = await blogServie.updateBlog({ ...body }, params.id, user!);

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/** * Get a blog by ID
 */
const getBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await blogServie.getBlog(req);

    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

/** * Get all blogs
 */
const getBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await blogServie.getBlogs(req);

    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

/** * Get all my blogs
 */
const getMyBlogs = async (req: Request, res: Response) => {
  try {
    const result = await blogServie.getMyBlogs(req);

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/** * Delete a blog by ID
 */
const deleteBlog = async (req: Request, res: Response) => {
  try {
    const result = await blogServie.deleteBlog(req);

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/** * Blog Controller
 */
const blogController = {
  createBlog,
  updateBlog,
  getBlog,
  getBlogs,
  getMyBlogs,
  deleteBlog,
};

/** * Export the blog controller
 */
export default blogController;
