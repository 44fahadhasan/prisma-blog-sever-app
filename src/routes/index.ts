import { Router } from "express";
import v1Routes from "./v1/index";

/** * Initialize Express Router
 */
const router = Router();

/** * Use Versioned Routes
 */
router.use("/v1", v1Routes);

/** * Export the router
 */
export default router;
