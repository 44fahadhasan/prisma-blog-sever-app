import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import { auth } from "./lib/auth";
import globalErrorHandler from "./middleware/globalErrorHandler";
import router from "./routes";

/** * Initialize Express Application
 */
const app = express();

/** * CORS Middleware Configuration
 */
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  }),
);

/** * Middleware to parse JSON requests
 */
app.use(express.json());

/** * Root route for health check or welcome message
 */
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

/** * Use the main router for API routes
 */
app.use("/api", router);

/** * Use the authentication handler for auth routes
 */
app.all("/api/v1/auth/*splat", toNodeHandler(auth));

/** * Handle global error
 */
app.use(globalErrorHandler);

/** * Export the Express application
 */
export default app;
