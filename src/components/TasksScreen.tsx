import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TaskList } from './TaskList';
import { TaskModal } from './TaskModal';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Filter, Plus, CheckSquare, Clock, Zap, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface TasksScreenProps {
  onNavigate?: (screen: string) => void;
}

export function TasksScreen({ onNavigate }: TasksScreenProps) {

    // ✅ Move useQuery inside the component
    // Inside TasksScreen component

// ✅ Real-time tasks (already coming from Convex useQuery)
const taskList = useQuery(api.tasks.getAllTasks);
const tasks = taskList ?? [];
console.log("Fetched tasks:", tasks);

// ✅ Compute stats dynamically
const totalTasks = tasks.length;
const inProgress = tasks.filter((t: any) => t.status === "in-progress").length;
const selfHealed = tasks.filter((t: any) => t.status === "self-healed").length;
const failed = tasks.filter((t: any) => t.status === "failed").length;

const stats = [
  {
    label: "Total Tasks",
    value: totalTasks,
    icon: CheckSquare,
    color: "text-blue-600",
    gradient: "gradient-primary"
  },
  {
    label: "In Progress",
    value: inProgress,
    icon: Clock,
    color: "text-yellow-600",
    gradient: "gradient-warning"
  },
  {
    label: "Self-Healed",
    value: selfHealed,
    icon: Zap,
    color: "text-green-600",
    gradient: "gradient-success"
  },
  {
    label: "Failed",
    value: failed,
    icon: AlertTriangle,
    color: "text-red-600",
    gradient: "gradient-danger"
  }
];

  const [showFailed, setShowFailed] = useState(false);
  const [showSelfHealed, setShowSelfHealed] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');


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
              Tasks
            </h1>
            <p className="text-muted-foreground">
              Manage and monitor all AI agent tasks
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <TaskModal 
              trigger={
                <Button className="gradient-primary text-white border-0 hover:opacity-90 transition-all duration-200 hover:scale-105 gap-2">
                  <Plus className="w-4 h-4" />
                  New Task
                </Button>
              }
            />
          </motion.div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
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
              <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                <Filter className="w-4 h-4 text-blue-500" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-blue-200/50 focus:border-blue-400"
                  />
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-white/50 dark:bg-black/20 backdrop-blur-sm border-blue-200/50">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="self-healed">Self-Healed</SelectItem>
                  </SelectContent>
                </Select>

                {/* Show Failed Toggle */}
                <div className="flex items-center space-x-2 p-3 bg-white/50 dark:bg-black/20 rounded-lg backdrop-blur-sm">
                  <Switch
                    id="show-failed"
                    checked={showFailed}
                    onCheckedChange={setShowFailed}
                  />
                  <Label htmlFor="show-failed" className="text-sm">Show Failed</Label>
                </div>

              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tasks Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  All Tasks
                </CardTitle>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-sm">Showing filtered results</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <TaskList 
                showFailed={showFailed}
                showSelfHealed={showSelfHealed}
                onNavigate={onNavigate}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}