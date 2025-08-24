import React from 'react';
import { Badge } from './ui/badge';
import { CheckCircle, Zap, Brain, Mail, CreditCard, Settings } from 'lucide-react';
import { motion } from 'motion/react';

interface Integration {
  name: string;
  status: 'connected' | 'active' | 'syncing' | 'error';
  icon: React.ReactNode;
  description: string;
}

const integrations: Integration[] = [
  {
    name: 'Dedalus',
    status: 'connected',
    icon: '🔧',
    description: 'Workflow automation'
  },
  {
    name: 'Convex',
    status: 'connected',
    icon: '⚡',
    description: 'AI processing'
  },
  {
    name: 'BrowserUse',
    status: 'connected',
    icon: '🧠',
    description: 'Smart contracts'
  },
  {
    name: 'AgentMail',
    status: 'connected',
    icon: '📧',
    description: 'Email automation'
  },
];

const statusConfig = {
  connected: {
    variant: 'secondary' as const,
    indicator: CheckCircle,
    color: 'text-green-500'
  },
  active: {
    variant: 'default' as const,
    indicator: Zap,
    color: 'text-blue-500'
  },
  syncing: {
    variant: 'outline' as const,
    indicator: Settings,
    color: 'text-yellow-500'
  },
  error: {
    variant: 'destructive' as const,
    indicator: Settings,
    color: 'text-red-500'
  }
};

interface IntegrationBadgesProps {
  showTitle?: boolean;
  layout?: 'horizontal' | 'grid';
}

export function IntegrationBadges({ 
  showTitle = true, 
  layout = 'horizontal' 
}: IntegrationBadgesProps) {
  return (
    <div className="space-y-3">
      {showTitle && (
        <h4 className="text-muted-foreground">Active Integrations</h4>
      )}
      
      <div className={`gap-2 ${layout === 'grid' ? 'grid grid-cols-2' : 'flex flex-wrap'}`}>
        {integrations.map((integration, index) => {
          const config = statusConfig[integration.status];
          const StatusIcon = config.indicator;
          
          return (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Badge 
                variant={config.variant} 
                className="gap-2 px-3 py-1 cursor-pointer hover:scale-105 transition-transform"
                title={integration.description}
              >
                <span className="text-sm">{integration.icon}</span>
                <span>{integration.name}</span>
                <StatusIcon className={`w-3 h-3 ${config.color}`} />
              </Badge>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}