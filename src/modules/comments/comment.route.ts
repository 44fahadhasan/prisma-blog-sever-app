import { Router } from "express";
import auth from "../../middleware/auth";
import commentController from "./comment.controller";

/** * Initialize Express Router
 */
const router = Router();

/**
 * @route POST /api/v1/comments
 * @desc Create a new comment
 * @access Public
 */
router.post("/", auth("user"), commentController.createComment);

/**
 * @route PUT /api/v1/comments/:id
 * @desc Update an existing comment
 * @access Public
 */
router.put("/:id", auth("user"), commentController.updateComment);

/**
 * @route PATCH /api/v1/comments/moderate/:id
 * @desc Update an existing comment status
 * @access Public
 */
router.patch("/moderate/:id", auth("user"), commentController.moderateComment);

/**
 * @route GET /api/v1/comments/:id
 * @desc Get a comment by ID
 * @access Public
 */
router.get("/:id", commentController.getComment);

/**
 * @route GET /api/v1/comments/author/id
 * @desc Get all comments of author by ID
 * @access Public
 */
router.get("/author/:id", commentController.getCommentsOfAuthor);

/**
 * @route DELETE /api/v1/comments/:id
 * @desc Delete a comment by ID
 * @access Public
 */
router.delete("/:id", auth("user"), commentController.deleteComment);

/** * Export the router
 */
export default router;
