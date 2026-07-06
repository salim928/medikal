import { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    orgId: string;
  };
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Fetch user details
    const user = await db.query.users.findFirst({
      where: eq(users.id, data.user.id),
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      orgId: user.orgId!,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}