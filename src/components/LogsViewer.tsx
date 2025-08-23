import React, { useState, useMemo } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  ChevronDown, 
  ChevronRight, 
  Mail, 
  LogIn, 
  Zap, 
  CreditCard,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Search,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  workflow: string;
  details?: {
    raw?: any;
    api_trace?: any;
  };
}

const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: '2 minutes ago',
    message: 'Agent received email with invoice attachment from vendor@company.com',
    type: 'info',
    workflow: 'Invoice Processing',
    details: {
      raw: { from: 'vendor@company.com', subject: 'Invoice #INV-2024-001', amount: '$4,500' },
      api_trace: { method: 'POST', endpoint: '/api/emails/process', status: 200 }
    }
  },
  {
    id: '2',
    timestamp: '5 minutes ago',
    message: 'Agent successfully logged into Outreach platform',
    type: 'success',
    workflow: 'Sales Automation',
    details: {
      raw: { platform: 'Outreach', user: 'ai-agent@company.com' },
      api_trace: { method: 'POST', endpoint: '/api/auth/outreach', status: 200 }
    }
  },
  {
    id: '3',
    timestamp: '8 minutes ago',
    message: 'Agent script failed → automatically self-healed and retried',
    type: 'warning',
    workflow: 'Lead Upload',
    details: {
      raw: { error: 'Rate limit exceeded', retry_count: 1, success: true },
      api_trace: { method: 'POST', endpoint: '/api/leads/upload', status: 429, retry_status: 200 }
    }
  },
  {
    id: '4',
    timestamp: '15 minutes ago',
    message: 'Agent successfully paid invoice via Autumn payment system',
    type: 'success',
    workflow: 'Invoice Processing',
    details: {
      raw: { amount: '$4,500', payment_method: 'ACH', confirmation: 'PAY-2024-001' },
      api_trace: { method: 'POST', endpoint: '/api/payments/process', status: 200 }
    }
  },
  {
    id: '5',
    timestamp: '22 minutes ago',
    message: 'Failed to connect to external API - Salesforce timeout',
    type: 'error',
    workflow: 'Data Sync',
    details: {
      raw: { error: 'Connection timeout after 30s', service: 'Salesforce CRM' },
      api_trace: { method: 'GET', endpoint: '/api/salesforce/contacts', status: 408 }
    }
  },
  {
    id: '6',
    timestamp: '25 minutes ago',
    message: 'Email sequence sent to 150 new leads successfully',
    type: 'success',
    workflow: 'Email Marketing',
    details: {
      raw: { recipients: 150, template: 'welcome-series-1', delivery_rate: '98.7%' },
      api_trace: { method: 'POST', endpoint: '/api/emails/bulk-send', status: 200 }
    }
  },
  {
    id: '7',
    timestamp: '30 minutes ago',
    message: 'Database sync completed for contractor records',
    type: 'info',
    workflow: 'Data Sync',
    details: {
      raw: { records_updated: 23, sync_duration: '4.2s' },
      api_trace: { method: 'PUT', endpoint: '/api/sync/contractors', status: 200 }
    }
  }
];

const typeConfig = {
  info: { 
    icon: FileText, 
    color: 'text-blue-500', 
    bg: 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20',
    border: 'border-l-blue-500'
  },
  success: { 
    icon: CheckCircle, 
    color: 'text-green-500', 
    bg: 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
    border: 'border-l-green-500'
  },
  warning: { 
    icon: Zap, 
    color: 'text-yellow-500', 
    bg: 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20',
    border: 'border-l-yellow-500'
  },
  error: { 
    icon: AlertCircle, 
    color: 'text-red-500', 
    bg: 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20',
    border: 'border-l-red-500'
  }
};

interface LogsViewerProps {
  searchQuery?: string;
  workflowFilter?: string;
}

export function LogsViewer({ searchQuery = '', workflowFilter = '' }: LogsViewerProps) {
  const [rawMode, setRawMode] = useState(false);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [localSearch, setLocalSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Use either external search or local search
  const effectiveSearch = searchQuery || localSearch;

  // Filter logs based on search and filters
  const filteredLogs = useMemo(() => {
    return mockLogs.filter(log => {
      // Search filter
      const matchesSearch = !effectiveSearch || 
        log.message.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
        log.workflow.toLowerCase().includes(effectiveSearch.toLowerCase());

      // Workflow filter
      const matchesWorkflow = !workflowFilter || workflowFilter === 'all' ||
        log.workflow.toLowerCase() === workflowFilter.toLowerCase();

      // Type filter
      const matchesType = typeFilter === 'all' || log.type === typeFilter;

      return matchesSearch && matchesWorkflow && matchesType;
    });
  }, [effectiveSearch, workflowFilter, typeFilter]);

  const toggleLogExpansion = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const workflows = [...new Set(mockLogs.map(log => log.workflow))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Activity Timeline
          </h3>
          <p className="text-muted-foreground">
            {filteredLogs.length} of {mockLogs.length} events
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRawMode(!rawMode)}
            className="gradient-primary text-white border-0 hover:opacity-90"
          >
            {rawMode ? 'Human View' : 'Raw Mode'}
          </Button>
        </div>
      </div>

      {/* Filters - Only show if no external filters provided */}
      {!searchQuery && !workflowFilter && (
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-blue-500" />
              <span>Filters</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>

              <Select value={workflowFilter || 'all'} onValueChange={() => {}}>
                <SelectTrigger>
                  <SelectValue placeholder="All workflows" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Workflows</SelectItem>
                  {workflows.map(workflow => (
                    <SelectItem key={workflow} value={workflow.toLowerCase()}>
                      {workflow}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Logs */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredLogs.map((log, index) => {
            const config = typeConfig[log.type];
            const Icon = config.icon;
            const isExpanded = expandedLogs.has(log.id);

            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ 
                  delay: index * 0.05,
                  type: "spring",
                  damping: 25,
                  stiffness: 200
                }}
                layout
              >
                <Card className={`${config.bg} ${config.border} border-l-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]`}>
                  <Collapsible>
                    <CollapsibleTrigger
                      onClick={() => toggleLogExpansion(log.id)}
                      className="w-full"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.05 + 0.2 }}
                          >
                            <Icon className={`w-5 h-5 mt-0.5 ${config.color}`} />
                          </motion.div>
                          <div className="flex-1 text-left">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="outline" 
                                  className="text-xs bg-white/50 dark:bg-black/50 backdrop-blur-sm"
                                >
                                  {log.workflow}
                                </Badge>
                                <span className="text-muted-foreground">{log.timestamp}</span>
                              </div>
                              <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </motion.div>
                            </div>
                            <p className="mt-1">{log.message}</p>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <motion.div 
                        className="px-4 pb-4 pt-0 border-t border-border/50 mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="mt-3 space-y-3">
                          {rawMode && log.details ? (
                            <div className="space-y-2">
                              <div>
                                <h4 className="text-sm font-medium">Raw Data</h4>
                                <pre className="mt-1 p-3 bg-muted/50 rounded-lg text-xs overflow-x-auto backdrop-blur-sm">
                                  {JSON.stringify(log.details.raw, null, 2)}
                                </pre>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">API Trace</h4>
                                <pre className="mt-1 p-3 bg-muted/50 rounded-lg text-xs overflow-x-auto backdrop-blur-sm">
                                  {JSON.stringify(log.details.api_trace, null, 2)}
                                </pre>
                              </div>
                            </div>
                          ) : (
                            <div className="text-muted-foreground">
                              <p>Additional context and details for this activity.</p>
                              <Button variant="link" size="sm" className="p-0 h-auto text-blue-500">
                                View full trace →
                              </Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {filteredLogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No logs match your current filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}