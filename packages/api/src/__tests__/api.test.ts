import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "@/index";

describe("API Endpoints", () => {
  const testToken = process.env.TEST_JWT_TOKEN || "test-token";

  describe("GET /health", () => {
    it("returns health status", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("ok");
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe("GET /appointments", () => {
    it("requires authentication", async () => {
      const response = await request(app).get("/api/appointments");

      expect(response.status).toBe(401);
    });

    it("returns appointments for authenticated user", async () => {
      const response = await request(app)
        .get("/api/appointments")
        .set("Authorization", `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("POST /appointments", () => {
    it("creates appointment", async () => {
      const response = await request(app)
        .post("/api/appointments")
        .set("Authorization", `Bearer ${testToken}`)
        .send({
          providerId: "test-provider-id",
          scheduledAt: new Date(Date.now() + 86400000).toISOString(),
          reasonForVisit: "I am experiencing persistent headaches and need consultation",
          reasonCategory: "acute",
        });

      expect(response.status).toBeOneOf([200, 201]);
      expect(response.body.id).toBeDefined();
    });
  });
});