import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Plus, Upload, FileText, Mail, CreditCard, Users } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const taskTypes = [
  { id: 'sales-sequence', label: 'Update Sales Sequence', icon: Mail, category: 'Sales' },
  { id: 'pay-invoice', label: 'Pay Invoice', icon: CreditCard, category: 'Finance' },
  { id: 'upload-leads', label: 'Upload Lead List', icon: Upload, category: 'Sales' },
  { id: 'onboard-contractor', label: 'Onboard Contractor', icon: Users, category: 'HR' },
  { id: 'process-document', label: 'Process Document', icon: FileText, category: 'General' }
];

interface TaskModalProps {
  trigger?: React.ReactNode;
}

export function TaskModal({ trigger }: TaskModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedType || !title) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Mock task creation
    toast.success('Task created successfully and assigned to AI Employee #1');
    
    // Reset form
    setSelectedType('');
    setTitle('');
    setDescription('');
    setPriority('medium');
    setOpen(false);
  };

  const selectedTaskType = taskTypes.find(t => t.id === selectedType);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-type">Task Type *</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Choose task type" />
              </SelectTrigger>
              <SelectContent>
                {taskTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{type.label}</span>
                        <span className="text-muted-foreground">({type.category})</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide additional context or instructions..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic fields based on task type */}
          {selectedType === 'pay-invoice' && (
            <div className="space-y-2">
              <Label htmlFor="amount">Invoice Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                step="0.01"
              />
            </div>
          )}

          {selectedType === 'upload-leads' && (
            <div className="space-y-2">
              <Label htmlFor="file">Lead List File</Label>
              <Input
                id="file"
                type="file"
                accept=".csv,.xlsx"
              />
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}