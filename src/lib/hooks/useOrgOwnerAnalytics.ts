import { useState, useEffect } from "react";
import { apiClient } from "../api";
import { TicketStats } from "./useDashboardAnalytics";

export interface CrossProjectPerformance {
  projectId: string;
  projectName: string;
  totalTickets: number;
  open: number;
  resolved: number;
  avgResolutionDays: number;
  activeAgents: number;
}

export interface TopPerformer {
  userId: string;
  userName: string;
  ticketsResolved: number;
  avgResolutionDays: number;
}

export interface BottleneckAnalysis {
  projectId: string;
  projectName: string;
  staleTickets: number;
  unassignedTickets: number;
  avgOpenAge: number;
}

export interface SLACompliance {
  slaStatus: string;
  count: number;
}

export interface ResourceAllocation {
  projectName: string;
  agentCount: number;
}

export interface OrgOwnerAnalytics {
  crossProjectPerformance: CrossProjectPerformance[];
  topPerformers: TopPerformer[];
  bottleneckAnalysis: BottleneckAnalysis[];
  orgStats: TicketStats;
  slaCompliance: SLACompliance[];
  resourceAllocation: ResourceAllocation[];
}

export function useOrgOwnerAnalytics(orgId?: string) {
  const [data, setData] = useState<OrgOwnerAnalytics | null>(null);
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
        const result = await apiClient<OrgOwnerAnalytics>(
          "/analytics/org-owner",
          {
            auth: true,
            headers: {
              "x-org-id": activeOrgId,
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
  }, [orgId]);

  return { data, loading, error };
}
