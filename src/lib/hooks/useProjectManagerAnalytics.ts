import { useState, useEffect } from "react";
import { apiClient } from "../api";

export interface TeamPerformanceMetric {
  agentId: string;
  agentName: string;
  resolved: number;
  inProgress: number;
  assigned: number;
  avgResolutionDays: number;
}

export interface WorkloadDistribution {
  agentId: string;
  agentName: string;
  assigned: number;
  inProgress: number;
  total: number;
}

export interface TicketAgingBucket {
  ageBucket: "0-2 days" | "3-7 days" | "7+ days";
  count: number;
}

export interface InflowOutflow {
  date: string;
  inflow: number;
  outflow: number;
}

export interface TicketTypeDistribution {
  label: string;
  value: number;
}

export interface ProjectManagerAnalytics {
  teamPerformance: TeamPerformanceMetric[];
  workloadDistribution: WorkloadDistribution[];
  agingBuckets: TicketAgingBucket[];
  inflowOutflow: InflowOutflow[];
  typeDistribution: TicketTypeDistribution[];
}

export function useProjectManagerAnalytics(projectId?: string) {
  const [data, setData] = useState<ProjectManagerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }
    const activeProjectId = projectId;

    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const result = await apiClient<ProjectManagerAnalytics>(
          "/analytics/project-manager",
          {
            auth: true,
            headers: {
              "x-project-id": activeProjectId,
            },
          },
        );
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err : new Error("Failed to fetch analytics"),
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  return { data, loading, error };
}
