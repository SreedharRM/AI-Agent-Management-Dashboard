import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Plus, Upload, FileText, Mail, CreditCard, Users } from 'lucide-react';
import { toast } from 'sonner';

// ✅ Task type metadata
const taskTypes = [
  { id: 'sales-sequence', label: 'Update Sales Sequence', icon: Mail, category: 'Sales' },
  { id: 'pay-invoice', label: 'Pay Invoice', icon: CreditCard, category: 'Finance' },
  { id: 'upload-leads', label: 'Upload Lead List', icon: Upload, category: 'Sales' },
  { id: 'onboard-contractor', label: 'Onboard Contractor', icon: Users, category: 'HR' },
  { id: 'process-document', label: 'Process Payroll Details', icon: FileText, category: 'General' }
];

// ✅ Dynamic field schemas
const taskFieldSchemas: Record<string, any[]> = {
  "sales-sequence": [
    { id: "leads", label: "Leads (comma-separated)", type: "text" }
  ],
  "pay-invoice": [
    { id: "amount", label: "Invoice Amount", type: "number" },
    { id: "recipient", label: "Recipient", type: "text" }
  ],
  "upload-leads": [
    { id: "file", label: "Lead List File", type: "file", accept: ".csv,.xlsx" }
  ],
  "onboard-contractor": [
    { id: "name", label: "Contractor Name", type: "text" },
    { id: "email", label: "Email", type: "email" }
  ],
  "process-document": [
    { id: "details", label: "Document Details", type: "textarea" }
  ],
};

interface TaskModalProps {
  trigger?: React.ReactNode;
}

export function TaskModal({ trigger }: TaskModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [title, setTitle] = useState('');
  const [formData, setFormData] = useState<any>({});

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };


  async function createTask(payload: any) {
  try {
    const res = await fetch("http://localhost:8000/task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Backend error: ${res.status}`);

    return await res.json();
  } catch (err) {
    console.error("❌ Task creation failed:", err);
    throw err;
  }
}



 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!selectedType || !title) {
    toast.error("Please fill in all required fields");
    return;
  }

  const payload = {
    type: selectedType,
    data: {
      title,
      ...formData,
    },
  };

  try {
    const result = await createTask(payload);
    toast.success(`Task created: ${result.task_id}`);
    console.log("✅ Task created:", result);

    // Reset form
    setSelectedType('');
    setTitle('');
    setFormData({});
    setOpen(false);
  } catch {
    toast.error("Failed to create task. Check backend logs.");
  }
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
          {/* Task Type */}
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

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
            />
          </div>


          {/* ✅ Dynamic Fields */}
          {selectedType && taskFieldSchemas[selectedType]?.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>{field.label}</Label>

              {field.type === "text" && (
                <Input
                  id={field.id}
                  type="text"
                  value={formData[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              )}

              {field.type === "email" && (
                <Input
                  id={field.id}
                  type="email"
                  value={formData[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              )}

              {field.type === "number" && (
                <Input
                  id={field.id}
                  type="number"
                  value={formData[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              )}

              {field.type === "file" && (
                <Input
                  id={field.id}
                  type="file"
                  accept={field.accept}
                  onChange={(e) => handleChange(field.id, e.target.files?.[0])}
                />
              )}

              {field.type === "textarea" && (
                <Textarea
                  id={field.id}
                  value={formData[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  rows={3}
                />
              )}
            </div>
          ))}

          {/* Actions */}
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
