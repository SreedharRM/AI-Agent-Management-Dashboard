import React, { useState } from "react";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export interface LogsViewerProps {
  searchQuery: string;
  workflowFilter: string;
  logs: { [taskId: string]: any[] };
}

export function LogsViewer({ searchQuery, workflowFilter, logs }: LogsViewerProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  // Flatten logs
  const allLogs = Object.entries(logs).flatMap(([taskId, taskLogs]) =>
    taskLogs.map((log) => ({ ...log, taskId }))
  );

  // Apply filters
  const filteredLogs = allLogs.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      JSON.stringify(log).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWorkflow =
      workflowFilter === "all" ||
      (log.workflow &&
        log.workflow.toLowerCase().includes(workflowFilter.toLowerCase()));
    return matchesSearch && matchesWorkflow;
  });

  // Title (prefer step over task_type)
  const formatLogTitle = (log: any) => {
    console.log("Log details:", log.details);
    if (log.details?.step) return log.details.step.replace(/_/g, " ");
    if (log.details?.task_type) return log.details.task_type.replace(/_/g, " ");
    return "Create Onborading Document"; // default/fallback
  };

  // Step-based background color mapping
  const stepColors: Record<string, string> = {
    onboarding: "from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/20",
    verification: "from-yellow-50 to-yellow-100 dark:from-yellow-950/40 dark:to-yellow-900/20",
    approval: "from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/20",
    review: "from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/20",
    payment: "from-pink-50 to-pink-100 dark:from-pink-950/40 dark:to-pink-900/20",
    default: "from-gray-50 to-gray-100 dark:from-gray-900/70 dark:to-black/50",
  };

  // Decide card background
  const stepBackground = (log: any) => {
    const step = log.details?.step?.toLowerCase();
    if (step && stepColors[step]) {
      return `bg-gradient-to-r ${stepColors[step]}`;
    }
    return `bg-gradient-to-r ${stepColors.default}`;
  };

  return (
    <div className="space-y-4">
      {filteredLogs.length === 0 ? (
        <p className="text-muted-foreground text-sm">No logs found.</p>
      ) : (
        filteredLogs.map((log, index) => {
          const isExpanded = expanded === String(index);
          const logTitle = formatLogTitle(log);

          return (
            <Card
              key={index}
              className={`border shadow-md rounded-2xl hover:shadow-lg transition ${stepBackground(log)}`}
            >
              <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <CardTitle className="text-lg font-semibold tracking-wide">
                  {logTitle.charAt(0).toUpperCase() + logTitle.slice(1)}
                </CardTitle>
                {log.timestamp && (
                  <span className="text-xs text-gray-600 dark:text-gray-400 italic">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                )}
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  {log.status && (
                    <Badge
                      variant={
                        log.status === "received"
                          ? "default"
                          : log.status === "failed"
                          ? "destructive"
                          : "secondary"
                      }
                      className="px-2 py-1 text-xs rounded-full"
                    >
                      {log.status}
                    </Badge>
                  )}
                </div>

                <div className="text-sm mt-1 leading-relaxed">
                  {log.message ? (
                    <p>{log.message}</p>
                  ) : (
                    <button
                      className="text-xs text-blue-600 dark:text-blue-400 underline hover:opacity-80"
                      onClick={() =>
                        setExpanded(isExpanded ? null : String(index))
                      }
                    >
                      {isExpanded ? "Hide details" : "Show details"}
                    </button>
                  )}
                  {isExpanded && (
                    <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded-lg overflow-x-auto mt-2 border text-gray-700 dark:text-gray-300">
                      {JSON.stringify(log, null, 2)}
                    </pre>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
