import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LogsViewer } from './LogsViewer';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Search, Calendar, Download, RefreshCw, Activity, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface LogsScreenProps {
  onNavigate?: (screen: string) => void;
}

export function LogsScreen({ onNavigate }: LogsScreenProps) {
  const [workflowFilter, setWorkflowFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');

  const workflows = [
    'All Workflows',
    'Invoice Processing', 
    'Sales Automation',
    'Lead Upload',
    'Data Sync',
    'Email Marketing'
  ];

  const stats = [
    {
      label: 'Total Events',
      value: '1,247',
      icon: Activity,
      color: 'text-blue-600',
      gradient: 'gradient-primary'
    },
    {
      label: 'Self-Healed',
      value: '23',
      icon: Zap,
      color: 'text-yellow-600',
      gradient: 'gradient-warning'
    },
    {
      label: 'Errors',
      value: '5',
      icon: AlertTriangle,
      color: 'text-red-600',
      gradient: 'gradient-danger'
    },
    {
      label: 'Success Rate',
      value: '96.1%',
      icon: CheckCircle,
      color: 'text-green-600',
      gradient: 'gradient-success'
    }
  ];

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
            <Button variant="outline" size="sm" className="gap-2 hover:bg-blue-50 hover:border-blue-200">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="gap-2 hover:bg-green-50 hover:border-green-200">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
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
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}