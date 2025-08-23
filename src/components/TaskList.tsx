import React, { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { MoreHorizontal, Play, FileText, Zap, CheckCircle, X, Clock, AlertTriangle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

export type TaskStatus = 'pending' | 'in-progress' | 'self-healed' | 'completed' | 'failed';

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  source: string;
  lastUpdated: string;
  type: string;
}

const statusConfig = {
  'pending': {
    variant: 'secondary' as const,
    icon: Clock,
    label: 'Pending',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50 dark:bg-yellow-950/20'
  },
  'in-progress': {
    variant: 'default' as const,
    icon: Play,
    label: 'In Progress',
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-950/20'
  },
  'self-healed': {
    variant: 'secondary' as const,
    icon: Zap,
    label: 'Self-Healed',
    color: 'text-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-950/20'
  },
  'completed': {
    variant: 'secondary' as const,
    icon: CheckCircle,
    label: 'Completed',
    color: 'text-green-600',
    bg: 'bg-green-50 dark:bg-green-950/20'
  },
  'failed': {
    variant: 'destructive' as const,
    icon: AlertTriangle,
    label: 'Failed',
    color: 'text-red-600',
    bg: 'bg-red-50 dark:bg-red-950/20'
  }
};

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Upload lead list to Outreach',
    status: 'completed',
    source: 'Email',
    lastUpdated: '2m ago',
    type: 'Sales'
  },
  {
    id: '2',
    title: 'Pay contractor invoice',
    status: 'self-healed',
    source: 'Nozomio',
    lastUpdated: '5m ago',
    type: 'Finance'
  },
  {
    id: '3',
    title: 'Update Outreach sequence',
    status: 'failed',
    source: 'Manual',
    lastUpdated: '8m ago',
    type: 'Sales'
  },
  {
    id: '4',
    title: 'Process new contractor onboarding',
    status: 'in-progress',
    source: 'Dedalus',
    lastUpdated: '12m ago',
    type: 'HR'
  },
  {
    id: '5',
    title: 'Send welcome email sequence',
    status: 'pending',
    source: 'AgentMail',
    lastUpdated: '15m ago',
    type: 'Marketing'
  }
];

interface TaskListProps {
  showFailed?: boolean;
  showSelfHealed?: boolean;
  onNavigate?: (screen: string) => void;
}

export function TaskList({ showFailed = true, showSelfHealed = true, onNavigate }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const filteredTasks = tasks.filter(task => {
    if (!showFailed && task.status === 'failed') return false;
    if (!showSelfHealed && task.status === 'self-healed') return false;
    return true;
  });

  const handleRetryTask = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: 'in-progress' as TaskStatus, lastUpdated: 'now' }
          : task
      )
    );
    toast.success('Task retry initiated');
  };

  const handleViewLogs = (taskId: string) => {
    if (onNavigate) {
      onNavigate('logs');
      toast.info('Viewing logs for task');
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white/50 dark:bg-black/20 backdrop-blur-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
            <TableHead>Task</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {filteredTasks.map((task, index) => {
              const statusInfo = statusConfig[task.status];
              const StatusIcon = statusInfo.icon;
              
              return (
                <motion.tr
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    delay: index * 0.05,
                    type: "spring",
                    damping: 25,
                    stiffness: 200
                  }}
                  className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-950/20 dark:hover:to-purple-950/20 transition-all duration-200"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-50 bg-clip-text text-transparent">
                          {task.title}
                        </p>
                        <p className="text-muted-foreground text-sm">{task.type}</p>
                      </div>
                      {task.status === 'self-healed' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Zap className="w-4 h-4 text-purple-500" />
                        </motion.div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={statusInfo.variant} 
                      className={`flex items-center gap-1 w-fit ${statusInfo.bg} border-0 ${statusInfo.color}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusInfo.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{task.source}</TableCell>
                  <TableCell className="text-muted-foreground">{task.lastUpdated}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white/90 dark:bg-black/90 backdrop-blur-sm">
                        <DropdownMenuItem 
                          onClick={() => handleRetryTask(task.id)}
                          className="hover:bg-blue-50 dark:hover:bg-blue-950/20"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Retry
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleViewLogs(task.id)}
                          className="hover:bg-green-50 dark:hover:bg-green-950/20"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View Logs
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </TableBody>
      </Table>
      
      {filteredTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <CheckSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No tasks match your current filters</p>
        </motion.div>
      )}
    </div>
  );
}