import rateLimit from "express-rate-limit";

/**
 * Rate limiter for authentication endpoints
 * Prevents brute force attacks and credential stuffing
 * 
 * Limits: 5 requests per 15 minutes per IP address
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window per IP
  message: {
    error: "Too many authentication attempts from this IP, please try again after 15 minutes",
    code: "RATE_LIMIT_EXCEEDED",
    retryAfter: "15 minutes"
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  // Skip rate limiting for successful requests (optional)
  skipSuccessfulRequests: false,
  // Skip rate limiting for failed requests (optional)
  skipFailedRequests: false,
});

/**
 * Rate limiter for general API endpoints
 * Prevents API abuse and DDoS attacks
 * 
 * Limits: 100 requests per minute per IP address
 */
export const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per window per IP
  message: {
    error: "Too many requests from this IP, please slow down",
    code: "RATE_LIMIT_EXCEEDED",
    retryAfter: "1 minute"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict rate limiter for sensitive operations
 * (e.g., password reset, account deletion)
 * 
 * Limits: 3 requests per hour per IP address
 */
export const strictRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per window per IP
  message: {
    error: "Too many sensitive operation attempts, please try again later",
    code: "RATE_LIMIT_EXCEEDED",
    retryAfter: "1 hour"
  },
  standardHeaders: true,
  legacyHeaders: false,
});
