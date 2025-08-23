import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ApprovalModal } from './ApprovalModal';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DollarSign, Mail, Users, Clock, CheckCircle, X } from 'lucide-react';
import { motion } from 'motion/react';

interface ApprovalRequest {
  id: string;
  title: string;
  description: string;
  type: 'payment' | 'email' | 'data';
  amount?: string;
  recipient?: string;
  context: string;
  riskLevel: 'low' | 'medium' | 'high';
  requestedBy: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

const mockRequests: ApprovalRequest[] = [
  {
    id: '1',
    title: 'Pay contractor invoice',
    description: 'Payment for development services',
    type: 'payment',
    amount: '$4,500',
    recipient: 'VendorX Corp',
    context: 'Monthly retainer payment for software development services as outlined in contract VX-2024-001. Invoice received via email and verified against contract terms.',
    riskLevel: 'medium',
    requestedBy: 'AI Agent #1',
    timestamp: '5 minutes ago',
    status: 'pending'
  },
  {
    id: '2',
    title: 'Send email sequence to new leads',
    description: 'Marketing automation for 500 new leads',
    type: 'email',
    recipient: '500 leads',
    context: 'Automated welcome sequence for leads captured from recent webinar. Sequence includes 5 emails over 2 weeks with personalized content.',
    riskLevel: 'low',
    requestedBy: 'AI Agent #1',
    timestamp: '12 minutes ago',
    status: 'pending'
  },
  {
    id: '3',
    title: 'Update contractor database',
    description: 'Bulk update of contractor information',
    type: 'data',
    context: 'Synchronizing contractor profiles with latest tax forms and contact information from HR system.',
    riskLevel: 'high',
    requestedBy: 'AI Agent #1',
    timestamp: '1 hour ago',
    status: 'approved'
  }
];

const typeConfig = {
  payment: { icon: DollarSign, label: 'Payment', color: 'text-green-600' },
  email: { icon: Mail, label: 'Email', color: 'text-blue-600' },
  data: { icon: Users, label: 'Data', color: 'text-purple-600' }
};

const riskConfig = {
  low: { variant: 'secondary' as const, label: 'Low Risk' },
  medium: { variant: 'outline' as const, label: 'Medium Risk' },
  high: { variant: 'destructive' as const, label: 'High Risk' }
};

export function ApprovalsScreen() {
  const [requests, setRequests] = useState<ApprovalRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleApprove = (requestId: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'approved' as const } : req
      )
    );
  };

  const handleReject = (requestId: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'rejected' as const } : req
      )
    );
  };

  const openApprovalModal = (request: ApprovalRequest) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const completedRequests = requests.filter(req => req.status !== 'pending');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Approvals & Governance</h1>
          <p className="text-muted-foreground">
            Review and approve AI agent actions requiring human oversight
          </p>
        </div>
        <Badge variant="outline" className="gap-2">
          <Clock className="w-4 h-4" />
          {pendingRequests.length} Pending
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Pending Approvals</p>
                <p className="text-2xl font-bold">{pendingRequests.length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Approved Today</p>
                <p className="text-2xl font-bold text-green-600">12</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Approval Rate</p>
                <p className="text-2xl font-bold">94.2%</p>
              </div>
              <Badge variant="secondary">30d avg</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approval Tables */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            History ({completedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.map((request, index) => {
                    const typeInfo = typeConfig[request.type];
                    const riskInfo = riskConfig[request.riskLevel];
                    const TypeIcon = typeInfo.icon;

                    return (
                      <motion.tr
                        key={request.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group cursor-pointer hover:bg-muted/50"
                        onClick={() => openApprovalModal(request)}
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.title}</p>
                            <p className="text-muted-foreground">{request.description}</p>
                            {request.amount && (
                              <p className="font-medium text-green-600 mt-1">{request.amount}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="gap-1">
                            <TypeIcon className="w-3 h-3" />
                            {typeInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={riskInfo.variant}>
                            {riskInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {request.timestamp}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReject(request.id);
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApprove(request.id);
                              }}
                            >
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Approval History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Completed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedRequests.map((request) => {
                    const typeInfo = typeConfig[request.type];
                    const TypeIcon = typeInfo.icon;

                    return (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.title}</p>
                            <p className="text-muted-foreground">{request.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="gap-1">
                            <TypeIcon className="w-3 h-3" />
                            {typeInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={request.status === 'approved' ? 'secondary' : 'destructive'}>
                            {request.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {request.timestamp}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Approval Modal */}
      <ApprovalModal
        request={selectedRequest}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}