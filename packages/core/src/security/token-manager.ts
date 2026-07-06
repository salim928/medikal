import jwt from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  orgId: string;
}

export class TokenManager {
  private accessTokenSecret: string;
  private refreshTokenSecret: string;

  constructor(
    accessTokenSecret: string = process.env.JWT_ACCESS_SECRET || "access-secret",
    refreshTokenSecret: string = process.env.JWT_REFRESH_SECRET || "refresh-secret"
  ) {
    this.accessTokenSecret = accessTokenSecret;
    this.refreshTokenSecret = refreshTokenSecret;
  }

  generateAccessToken(payload: TokenPayload, expiresIn: string = "15m"): string {
    return jwt.sign(payload, this.accessTokenSecret, { expiresIn });
  }

  generateRefreshToken(
    payload: TokenPayload,
    expiresIn: string = "7d"
  ): string {
    return jwt.sign(payload, this.refreshTokenSecret, { expiresIn });
  }

  verifyAccessToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.accessTokenSecret) as TokenPayload;
    } catch {
      return null;
    }
  }

  verifyRefreshToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.refreshTokenSecret) as TokenPayload;
    } catch {
      return null;
    }
  }

  decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch {
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  }
}

export const tokenManager = new TokenManager();