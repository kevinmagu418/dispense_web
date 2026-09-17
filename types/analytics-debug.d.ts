/**
 * Debug/verification surface exposed by the analytics layer.
 *
 * These globals exist so the instrumentation can be inspected by the audits and
 * the end-to-end suite without a vendor account. They contain no personal data:
 * event names, flat non-identifying parameters and consent transitions only.
 */
interface DispenseAnalyticsSnapshot {
  status: "uninitialized" | "enabled" | "disabled";
  consent: boolean | null;
  measurementId: string;
  consentHistory: Array<{ at: number; granted: boolean }>;
}

interface DispenseAnalyticsEventRecord {
  event: string;
  params: Record<string, string | number | boolean | undefined>;
  at: number;
}

interface Window {
  __dispenseAnalyticsState?: DispenseAnalyticsSnapshot;
  __dispenseAnalyticsEvents?: DispenseAnalyticsEventRecord[];
}
