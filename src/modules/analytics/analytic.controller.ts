import type { Request, Response } from "express";
import analyticServie from "./analytic.service";

/** * Get all analytics
 */
const getAnalytics = async (req: Request, res: Response) => {
  try {
    const result = await analyticServie.getAnalytics();

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/** * Analytics Controller
 */
const analyticController = {
  getAnalytics,
};

/** * Export the analytic controller
 */
export default analyticController;
