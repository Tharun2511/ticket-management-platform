import { useState, useEffect } from "react";
import { apiClient } from "../api";

export interface AgentProductivityStats {
  resolvedToday: number;
  resolvedThisWeek: number;
  assigned: number;
  inProgress: number;
}

export interface AgentVelocityTrend {
  date: string;
  resolved: number;
}

export interface AgentResolutionTime {
  resolvedCount: number;
  avgDays: number;
}

export interface AgentInflowOutflow {
  date: string;
  inflow: number;
  outflow: number;
}

export interface TaskDueBucket {
  priority: string;
  ageBucket: string;
  count: number;
}

export interface AgentAnalytics {
  productivity: AgentProductivityStats;
  velocityTrend: AgentVelocityTrend[];
  resolutionTime: AgentResolutionTime;
  inflowOutflow: AgentInflowOutflow[];
  tasksDue: TaskDueBucket[];
}

export function useAgentAnalytics(orgId?: string) {
  const [data, setData] = useState<AgentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!orgId) {
      setLoading(false);
      return;
    }
    const activeOrgId = orgId;

    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const result = await apiClient<AgentAnalytics>("/analytics/agent", {
          auth: true,
          headers: {
            "x-org-id": activeOrgId,
          },
        });
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
  }, [orgId]);

  return { data, loading, error };
}
