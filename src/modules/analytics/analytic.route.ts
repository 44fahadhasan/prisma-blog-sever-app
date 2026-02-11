import { Router } from "express";
import analyticController from "./analytic.controller";

/** * Initialize Express Router
 */
const router = Router();

/**
 * @route GET /api/v1/analytics
 * @desc Get all analytics
 * @access Public
 */
router.get("/", analyticController.getAnalytics);

/** * Export the router
 */
export default router;
