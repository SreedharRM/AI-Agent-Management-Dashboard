import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LogsViewer } from './LogsViewer';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Download, RefreshCw, Activity, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface LogsScreenProps {
  onNavigate?: (screen: string) => void;
}

export function LogsScreen({ onNavigate }: LogsScreenProps) {
  const taskList = useQuery(api.tasks.getAllTasks);
  const tasks = taskList ?? [];

  const [workflowFilter, setWorkflowFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [logsByTask, setLogsByTask] = useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    if (!tasks || tasks.length === 0) return;
    setLoading(true);

    const results: { [key: string]: any[] } = {};
    await Promise.all(
      tasks.map(async (task: any) => {
        try {
          const res = await fetch(`http://localhost:8000/tasks/${task.taskId}/logs`);
          if (!res.ok) throw new Error(`Failed logs for ${task.taskId}`);
          const data = await res.json();
          results[task._id] = data;
        } catch (err) {
          console.error(err);
          results[task._id] = [];
        }
      })
    );

    setLogsByTask(results);
    setLoading(false);
  }, [tasks]);

  useEffect(() => {
    fetchLogs();
  }, [tasks, fetchLogs]);

  const workflows = [
    'All Workflows',
    'Invoice Processing',
    'Sales Automation',
    'Lead Upload',
    'Data Sync',
    'Email Marketing'
  ];

  // 🔹 Compute stats dynamically from logs
  const computeStats = (logs: { [key: string]: any[] }) => {
    const allLogs = Object.values(logs).flat();

    const totalEvents = allLogs.length;
    const errors = allLogs.filter(log => log.level === "error").length;
    const selfHealed = allLogs.filter(log => log.status === "self-healed").length;
    const successCount = allLogs.filter(log => log.status === "success").length;
    const successRate = totalEvents > 0 ? ((successCount / totalEvents) * 100).toFixed(1) + "%" : "0%";

    return [
      {
        label: 'Total Events',
        value: totalEvents.toString(),
        icon: Activity,
        color: 'text-blue-600',
        gradient: 'gradient-primary'
      },
      {
        label: 'Self-Healed',
        value: selfHealed.toString(),
        icon: Zap,
        color: 'text-yellow-600',
        gradient: 'gradient-warning'
      },
      {
        label: 'Errors',
        value: errors.toString(),
        icon: AlertTriangle,
        color: 'text-red-600',
        gradient: 'gradient-danger'
      },
      {
        label: 'Success Rate',
        value: successRate,
        icon: CheckCircle,
        color: 'text-green-600',
        gradient: 'gradient-success'
      }
    ];
  };

  // 🔹 Full-screen loading screen
// 🔹 Full-screen spinner loader
if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-muted-foreground">
          Fetching logs and generating stats...
        </p>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950">
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Logs & Monitoring
            </h1>
            <p className="text-muted-foreground">
              Real-time activity feed and system monitoring
            </p>
          </div>
          <motion.div 
            className="flex gap-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 hover:bg-blue-50 hover:border-blue-200"
              onClick={fetchLogs}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
            <Button variant="outline" size="sm" className="gap-2 hover:bg-green-50 hover:border-green-200">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {computeStats(logsByTask).map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  damping: 25,
                  stiffness: 200
                }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                  <div className={`absolute top-0 right-0 w-16 h-16 ${stat.gradient} opacity-10 rounded-full -mr-8 -mt-8`} />
                  <CardContent className="p-4 relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      </div>
                      <div className={`p-2 rounded-lg ${stat.gradient}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-500" />
                Filter Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-blue-200/50 focus:border-blue-400"
                  />
                </div>

                {/* Workflow Filter */}
                <Select value={workflowFilter} onValueChange={setWorkflowFilter}>
                  <SelectTrigger className="bg-white/50 dark:bg-black/20 backdrop-blur-sm border-blue-200/50">
                    <SelectValue placeholder="Select workflow" />
                  </SelectTrigger>
                  <SelectContent>
                    {workflows.map((workflow, index) => (
                      <SelectItem key={index} value={index === 0 ? 'all' : workflow.toLowerCase()}>
                        {workflow}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Date Filter */}
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="bg-white/50 dark:bg-black/20 backdrop-blur-sm border-blue-200/50">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="week">Last 7 days</SelectItem>
                    <SelectItem value="month">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Logs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LogsViewer 
                searchQuery={searchQuery}
                workflowFilter={workflowFilter}
                logs={logsByTask}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
