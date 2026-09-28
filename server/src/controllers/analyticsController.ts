import { type Response } from "express";

import { getAnalyticsData } from "../services/analyticsService.js";
import { type UserRequest } from "../middleware/userRequest.js";

// ======================================
// GET ANALYTICS
// ======================================

export const getAnalytics = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    // ==================================
    // AUTH CHECK
    // ==================================

    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

      return;
    }

    // ==================================
    // GET ANALYTICS DATA
    // ==================================

    const analytics =
      await getAnalyticsData();

    // ==================================
    // RESPONSE
    // ==================================

    res.status(200).json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error(
      "Get analytics error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
