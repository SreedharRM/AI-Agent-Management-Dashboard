import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AgentCard } from './AgentCard';
import { TaskList } from './TaskList';
import { TaskModal } from './TaskModal';
import { IntegrationBadges } from './IntegrationBadges';
import { Button } from './ui/button';
import { Activity, CheckSquare, Clock, Zap, TrendingUp, Plus, Eye } from 'lucide-react';
import { motion } from 'motion/react';

const stats = [
  {
    label: 'Tasks Completed Today',
    value: '24',
    icon: CheckSquare,
    change: '+12%',
    color: 'text-green-600',
    gradient: 'gradient-success'
  },
  {
    label: 'Active Tasks',
    value: '3',
    icon: Clock,
    change: '-2',
    color: 'text-blue-600',
    gradient: 'gradient-primary'
  },
  {
    label: 'Self-Healed Issues',
    value: '7',
    icon: Zap,
    change: '+3',
    color: 'text-yellow-600',
    gradient: 'gradient-warning'
  },
  {
    label: 'Success Rate',
    value: '94.2%',
    icon: TrendingUp,
    change: '+2.1%',
    color: 'text-green-600',
    gradient: 'gradient-success'
  }
];

interface DashboardProps {
  onNavigate?: (screen: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const handleViewLogs = () => {
    if (onNavigate) {
      onNavigate('logs');
    }
  };

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
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor your AI agents and workflow automation
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <TaskModal />
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="glass hover:shadow-xl transition-all duration-300 border-0 overflow-hidden relative">
                  <div className={`absolute top-0 right-0 w-20 h-20 ${stat.gradient} opacity-10 rounded-full -mr-10 -mt-10`} />
                  <CardContent className="p-4 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-muted-foreground text-sm">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1 bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-50 bg-clip-text text-transparent">
                          {stat.value}
                        </p>
                        <p className={`text-sm ${stat.color} mt-1 flex items-center gap-1`}>
                          <TrendingUp className="w-3 h-3" />
                          {stat.change} from yesterday
                        </p>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.gradient} shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

              {/* Main Content Grid */}
      {/* Left & Right Column for AgentCard and Quick Actions */}
      <motion.div 
        className="xl:col-span-1"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: AgentCard */}
          <div>
            <AgentCard onNavigate={onNavigate} />
          </div>

          {/* Right: Quick Actions */}
          <div>
            <Card className="glass border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <TaskModal
                    trigger={
                      <Button 
                        variant="outline" 
                        className="h-auto p-4 flex items-center justify-start gap-3 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:border-blue-200 transition-all duration-200 hover:scale-105"
                      >
                        <Plus className="w-5 h-5 text-blue-500" />
                        <span>Assign New Task</span>
                      </Button>
                    }
                  />
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex items-center justify-start gap-3 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 hover:border-green-200 transition-all duration-200 hover:scale-105"
                    onClick={handleViewLogs}
                  >
                    <Eye className="w-5 h-5 text-green-500" />
                    <span>View Logs</span>
                  </Button>
                </div>
                
                <div className="pt-4">
                  <IntegrationBadges layout="grid" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="glass border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Recent Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TaskList onNavigate={onNavigate} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}