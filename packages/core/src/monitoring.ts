import * as Sentry from "@sentry/node";
import PostHog from "posthog-node";

/**
 * Scrubs PHI/PII from data before sending to external monitoring services
 * HIPAA Compliance: No PHI should be transmitted to Sentry/PostHog
 */
function scrubPHI(data: any): any {
  if (typeof data === "string") {
    let scrubbed = data;

    // Remove email addresses
    scrubbed = scrubbed.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[EMAIL_REDACTED]");
    
    // Remove phone numbers
    scrubbed = scrubbed.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, "[PHONE_REDACTED]");
    
    // Remove dates
    scrubbed = scrubbed.replace(/\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/g, "[DATE_REDACTED]");
    
    // Remove SSN/MRN patterns
    scrubbed = scrubbed.replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[SSN_REDACTED]");
    scrubbed = scrubbed.replace(/\b(MRN|ID)[:\s-]?\d{5,}\b/gi, "[ID_REDACTED]");
    
    // Remove patient names (capitalized words pattern - conservative)
    scrubbed = scrubbed.replace(/\b[A-Z][a-z]{2,}\s+[A-Z][a-z]{2,}\b/g, "[NAME_REDACTED]");

    return scrubbed;
  }

  if (Array.isArray(data)) {
    return data.map(scrubPHI);
  }

  if (typeof data === "object" && data !== null) {
    const scrubbed: any = {};
    for (const [key, value] of Object.entries(data)) {
      // Skip sensitive keys entirely
      if (
        key.toLowerCase().includes("ssn") ||
        key.toLowerCase().includes("password") ||
        key.toLowerCase().includes("token") ||
        key.toLowerCase().includes("secret")
      ) {
        scrubbed[key] = "[REDACTED]";
      } else {
        scrubbed[key] = scrubPHI(value);
      }
    }
    return scrubbed;
  }

  return data;
}

// Initialize Sentry with PHI scrubbing
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // CRITICAL: Scrub PHI before sending to Sentry
  beforeSend(event, hint) {
    // Scrub exception message
    if (event.exception?.values) {
      event.exception.values = event.exception.values.map((exception) => ({
        ...exception,
        value: scrubPHI(exception.value),
      }));
    }

    // Scrub breadcrumbs
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => ({
        ...breadcrumb,
        message: scrubPHI(breadcrumb.message),
        data: scrubPHI(breadcrumb.data),
      }));
    }

    // Scrub contexts
    if (event.contexts) {
      event.contexts = scrubPHI(event.contexts);
    }

    // Scrub extra data
    if (event.extra) {
      event.extra = scrubPHI(event.extra);
    }

    return event;
  },
});

// Initialize PostHog
const posthog = new PostHog(process.env.POSTHOG_API_KEY || "phc_test");

export interface AnalyticsEvent {
  distinctId: string;
  event: string;
  properties?: Record<string, any>;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
}

export class MonitoringService {
  /**
   * Track user event
   */
  static trackEvent(event: AnalyticsEvent): void {
    posthog.capture({
      distinctId: event.distinctId,
      event: event.event,
      properties: event.properties,
    });
  }

  /**
   * Track performance metric
   */
  static trackMetric(metric: PerformanceMetric): void {
    Sentry.captureMessage(`Metric: ${metric.name} = ${metric.value}${metric.unit}`, "info");
  }

  /**
   * Track error
   */
  static trackError(error: Error, context?: Record<string, any>): void {
    Sentry.captureException(error, {
      contexts: {
        additional: context,
      },
    });
  }

  /**
   * Track appointment completion
   */
  static trackAppointmentCompletion(appointmentId: string, durationMinutes: number, userId: string): void {
    this.trackEvent({
      distinctId: userId,
      event: "appointment_completed",
      properties: {
        appointmentId,
        durationMinutes,
      },
    });
  }

  /**
   * Track AI agent execution
   */
  static trackAgentExecution(
    agentType: string,
    tokensUsed: number,
    latencyMs: number,
    success: boolean,
    userId: string
  ): void {
    this.trackEvent({
      distinctId: userId,
      event: "agent_execution",
      properties: {
        agentType,
        tokensUsed,
        latencyMs,
        success,
      },
    });

    this.trackMetric({
      name: `agent_${agentType}_latency`,
      value: latencyMs,
      unit: "ms",
    });
  }

  /**
   * Flush analytics
   */
  static async flush(): Promise<void> {
    await posthog.flush();
  }
}