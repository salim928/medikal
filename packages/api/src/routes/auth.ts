import { Router } from "express";
import { z } from "zod";
import { authRateLimiter, strictRateLimiter } from "../middleware/rate-limiter";
import { validateBody } from "../middleware/validation";
import { createClient } from "@supabase/supabase-js";

const router = Router();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Validation schemas
const signUpSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  fullName: z.string().min(2, "Full name is required"),
  role: z.enum(["patient", "provider"], {
    errorMap: () => ({ message: "Role must be either 'patient' or 'provider'" })
  }),
  phone: z.string().optional(),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

const updatePasswordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

// Sign Up - Rate limited to prevent spam
router.post(
  "/signup",
  authRateLimiter,
  validateBody(signUpSchema),
  async (req, res) => {
    try {
      const { email, password, fullName, role, phone } = req.body;

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm for now, can be changed
        user_metadata: {
          full_name: fullName,
          role,
          phone,
        },
      });

      if (authError) {
        return res.status(400).json({
          error: authError.message,
          code: "SIGNUP_FAILED"
        });
      }

      // Return success (don't return sensitive data)
      res.status(201).json({
        success: true,
        message: "Account created successfully. Please check your email to verify your account.",
        userId: authData.user.id,
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({
        error: "An error occurred during signup",
        code: "INTERNAL_ERROR"
      });
    }
  }
);

// Sign In - Rate limited to prevent brute force
router.post(
  "/login",
  authRateLimiter,
  validateBody(signInSchema),
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return res.status(401).json({
          error: "Invalid email or password",
          code: "INVALID_CREDENTIALS"
        });
      }

      res.json({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          role: data.user.user_metadata.role,
          fullName: data.user.user_metadata.full_name,
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        error: "An error occurred during login",
        code: "INTERNAL_ERROR"
      });
    }
  }
);

// Reset Password Request - Strictly rate limited
router.post(
  "/reset-password",
  strictRateLimiter,
  validateBody(resetPasswordSchema),
  async (req, res) => {
    try {
      const { email } = req.body;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_DOMAIN}/auth/update-password`,
      });

      if (error) {
        // Don't reveal if email exists for security
        console.error("Password reset error:", error);
      }

      // Always return success to prevent email enumeration
      res.json({
        success: true,
        message: "If an account exists with this email, you will receive password reset instructions.",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({
        error: "An error occurred processing your request",
        code: "INTERNAL_ERROR"
      });
    }
  }
);

// Update Password - Rate limited
router.post(
  "/update-password",
  authRateLimiter,
  validateBody(updatePasswordSchema),
  async (req, res) => {
    try {
      const { password } = req.body;
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          error: "No authorization token provided",
          code: "UNAUTHORIZED"
        });
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser(token);

      if (userError || !user) {
        return res.status(401).json({
          error: "Invalid or expired token",
          code: "INVALID_TOKEN"
        });
      }

      const { error } = await supabase.auth.admin.updateUserById(
        user.id,
        { password }
      );

      if (error) {
        return res.status(400).json({
          error: error.message,
          code: "PASSWORD_UPDATE_FAILED"
        });
      }

      res.json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error("Update password error:", error);
      res.status(500).json({
        error: "An error occurred updating your password",
        code: "INTERNAL_ERROR"
      });
    }
  }
);

// Sign Out
router.post("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "No authorization token provided",
        code: "UNAUTHORIZED"
      });
    }

    // Supabase handles token invalidation
    const { error } = await supabase.auth.admin.signOut(token);

    if (error) {
      console.error("Logout error:", error);
    }

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      error: "An error occurred during logout",
      code: "INTERNAL_ERROR"
    });
  }
});

// Get Current User
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "No authorization token provided",
        code: "UNAUTHORIZED"
      });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: "Invalid or expired token",
        code: "INVALID_TOKEN"
      });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.user_metadata.role,
        fullName: user.user_metadata.full_name,
        phone: user.user_metadata.phone,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      error: "An error occurred fetching user data",
      code: "INTERNAL_ERROR"
    });
  }
});

export default router;
