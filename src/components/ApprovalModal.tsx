import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { CheckCircle, X, AlertTriangle, DollarSign, Mail, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

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
}

interface ApprovalModalProps {
  request: ApprovalRequest | null;
  open: boolean;
  onClose: () => void;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

const riskConfig = {
  low: { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20', label: 'Low Risk' },
  medium: { color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20', label: 'Medium Risk' },
  high: { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20', label: 'High Risk' }
};

const typeIcons = {
  payment: DollarSign,
  email: Mail,
  data: Users
};

export function ApprovalModal({ 
  request, 
  open, 
  onClose, 
  onApprove, 
  onReject 
}: ApprovalModalProps) {
  const [loading, setLoading] = useState(false);

  if (!request) return null;

  const riskInfo = riskConfig[request.riskLevel];
  const TypeIcon = typeIcons[request.type];

  const handleApprove = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      onApprove(request.id);
      toast.success('Request approved successfully');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      onReject(request.id);
      toast.success('Request rejected');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TypeIcon className="w-5 h-5" />
            Approval Required
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Request Summary */}
          <div className={`p-4 rounded-lg ${riskInfo.bg}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium">{request.title}</h3>
                <p className="text-muted-foreground mt-1">{request.description}</p>
                {request.amount && (
                  <p className="mt-2 font-medium">{request.amount}</p>
                )}
                {request.recipient && (
                  <p className="text-muted-foreground">
                    Recipient: {request.recipient}
                  </p>
                )}
              </div>
              <Badge variant="outline" className={`${riskInfo.color} border-current`}>
                <AlertTriangle className="w-3 h-3 mr-1" />
                {riskInfo.label}
              </Badge>
            </div>
          </div>

          {/* Context */}
          <div>
            <h4 className="font-medium mb-2">Context</h4>
            <p className="text-muted-foreground bg-muted p-3 rounded">
              {request.context}
            </p>
          </div>

          <Separator />

          {/* Request Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Requested by</p>
              <p>{request.requestedBy}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Requested at</p>
              <p>{request.timestamp}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleReject}
              disabled={loading}
              className="flex-1 gap-2"
            >
              <X className="w-4 h-4" />
              Reject
            </Button>
            <Button
              onClick={handleApprove}
              disabled={loading}
              className="flex-1 gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {loading ? 'Approving...' : 'Approve'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}