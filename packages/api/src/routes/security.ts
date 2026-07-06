import { Router, Response } from "express";
import { authMiddleware } from "../middleware/auth";
import { RateLimiter } from "@/core";
import { TokenManager } from "@/core";

const router = Router();
const tokenManager = new TokenManager();
const loginRateLimiter = new RateLimiter({
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
});

// Failed login tracker
const failedLogins = new Map<string, number>();

// Refresh token endpoint
router.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token required" });
    }

    const payload = tokenManager.verifyRefreshToken(refreshToken);
    if (!payload) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const newAccessToken = tokenManager.generateAccessToken(payload);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(500).json({ error: "Token refresh failed" });
  }
});

// Revoke token endpoint
router.post("/revoke-token", authMiddleware, async (req, res) => {
  try {
    // Implementation would add token to blacklist
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Token revocation failed" });
  }
});

// Check rate limits
router.get("/rate-limit-status", (req, res) => {
  const ip = req.ip || "unknown";
  const remaining = loginRateLimiter.getRemainingRequests(ip);

  res.json({
    remaining,
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });
});

// Session endpoints
router.get("/session", authMiddleware, async (req, res) => {
  res.json({
    user: req.user,
    sessionId: req.sessionID,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
  });
});

router.post("/session/extend", authMiddleware, async (req, res) => {
  res.json({ success: true, newExpiry: new Date(Date.now() + 15 * 60 * 1000) });
});

export default router;