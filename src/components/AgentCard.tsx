// AgentCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Activity, Zap, Bot } from 'lucide-react';
import { motion } from 'motion/react';

export type AgentStatus = 'active' | 'running' | 'failed';

export interface AgentCardProps {
  name?: string;
  status?: AgentStatus;
  currentTask?: string;
  tasksCompleted?: number;
  uptime?: string;
  onNavigate?: (screen: string) => void;
}

const statusConfig = {
  active: {
    color: 'bg-green-500',
    label: 'Active',
    icon: '🟢',
    gradient: 'gradient-success'
  },
  running: {
    color: 'bg-yellow-500',
    label: 'Running',
    icon: '🟡',
    gradient: 'gradient-warning'
  },
  failed: {
    color: 'bg-red-500',
    label: 'Failed',
    icon: '🔴',
    gradient: 'gradient-danger'
  }
};

export function AgentCard({
  name = "AI Employee #1",
  status = 'active',
  currentTask = "Processing invoice from VendorX",
  tasksCompleted = 127,
  uptime = "99.2%",
  onNavigate
}: AgentCardProps) {
  const statusInfo = statusConfig[status];

  const handleViewLogs = () => {
    if (onNavigate) {
      onNavigate('logs');
    }
  };

  const handleAssignTask = () => {
    if (onNavigate) {
      onNavigate('mail');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full glass hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Avatar className="w-12 h-12 gradient-primary shadow-lg">
                  <AvatarFallback className="bg-transparent text-white">
                    <Bot className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <div>
                <h3 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <motion.span 
                    className={`w-2 h-2 rounded-full ${statusInfo.color}`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                  <span className="text-muted-foreground">{statusInfo.label}</span>
                </div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Badge 
                variant={status === 'failed' ? 'destructive' : 'secondary'} 
                className={`${statusInfo.gradient} text-white border-0 shadow-sm`}
              >
                {statusInfo.icon} {statusInfo.label}
              </Badge>
            </motion.div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-muted-foreground">Current Task</p>
            <p className="mt-1 bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent dark:from-slate-300 dark:to-slate-100">
              {currentTask}
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">
              <p className="text-muted-foreground text-sm">Tasks Completed</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Activity className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-blue-600">{tasksCompleted}</span>
              </div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg">
              <p className="text-muted-foreground text-sm">Uptime</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Zap className="w-4 h-4 text-green-500" />
                <span className="font-semibold text-green-600">{uptime}</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="flex gap-2 pt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-200"
              onClick={handleViewLogs}
            >
              View Logs
            </Button>
            <Button 
              size="sm" 
              className="flex-1 gradient-primary text-white border-0 hover:opacity-90 transition-all duration-200 hover:scale-105"
              onClick={handleAssignTask}
            >
              Open Mail
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
