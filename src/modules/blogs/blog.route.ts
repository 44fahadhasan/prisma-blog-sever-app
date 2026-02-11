import { Router } from "express";
import auth from "../../middleware/auth";
import blogController from "./blog.controller";

/** * Initialize Express Router
 */
const router = Router();

/**
 * @route GET /api/v1/blogs
 * @desc Get all blogs
 * @access Public
 */
router.get("/", blogController.getBlogs);

/**
 * @route GET /api/v1/blogs/my-blogs
 * @desc Get all my blogs
 * @access Public
 */
router.get("/my-blogs", auth("user"), blogController.getMyBlogs);

/**
 * @route GET /api/v1/blogs/blog/:id
 * @desc Get a blog by ID
 * @access Public
 */
router.get("/blog/:id", blogController.getBlog);

/**
 * @route POST /api/v1/blogs/create
 * @desc Create a new blog
 * @access Public
 */
router.post("/create", auth("user"), blogController.createBlog);

/**
 * @route PUT /api/v1/blogs/update/:id
 * @desc Update an existing blog
 * @access Public
 */
router.put("/update/:id", auth("user"), blogController.updateBlog);

/**
 * @route DELETE /api/v1/blogs/delete/:id
 * @desc Delete a blog by ID
 * @access Public
 */
router.delete("/delete/:id", auth("user"), blogController.deleteBlog);

/** * Export the router
 */
export default router;
