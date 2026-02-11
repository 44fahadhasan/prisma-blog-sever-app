import { Router, type IRouter } from "express";
import analyticsRouter from "../../modules/analytics/analytic.route";
import blogRouter from "../../modules/blogs/blog.route";
import commentRouter from "../../modules/comments/comment.route";

/** * Module Route Interface
 */
interface IModuleRoute {
  path: string;
  route: IRouter;
}

/** * Initialize Express Router
 */
const router = Router();

/** * Module Routes
 */
const moduleRoutes: IModuleRoute[] = [
  {
    path: "/blogs",
    route: blogRouter,
  },
  {
    path: "/comments",
    route: commentRouter,
  },
  {
    path: "/analytics",
    route: analyticsRouter,
  },
];

/** * Use Module Routes
 */
moduleRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});

/** * Export the router
 */
export default router;
