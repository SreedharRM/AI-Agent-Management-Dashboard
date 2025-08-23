import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { 
  Mail, 
  Search, 
  Star, 
  StarOff,
  Archive, 
  Trash2, 
  Reply, 
  ReplyAll, 
  Forward, 
  Paperclip,
  Send,
  Inbox,
  SendHorizontal,
  FileEdit,
  Flag,
  Plus,
  RefreshCw,
  User,
  Bot,
  Filter,
  Download,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';

interface Email {
  id: string;
  from: string;
  fromEmail: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  hasAttachments: boolean;
  folder: 'inbox' | 'sent' | 'draft' | 'archive' | 'trash';
  labels: string[];
  isFromAgent?: boolean;
}

const mockEmails: Email[] = [
  {
    id: '1',
    from: 'AI Agent',
    fromEmail: 'agent@company.com',
    to: 'manager@company.com',
    subject: 'Weekly Automation Report - Outstanding Performance',
    body: 'Weekly Summary Report\n\nTask Completion Rate: 96.4%\nTotal Tasks Processed: 247\nSelf-Healed Issues: 12\nCost Savings: $15,200\n\nTop Achievements:\n✓ Successfully processed 45 invoices\n✓ Onboarded 8 new contractors\n✓ Sent 1,200+ marketing emails\n✓ Updated 350 customer records\n\nRecommendations:\n- Consider upgrading Salesforce integration\n- Review approval thresholds for payments over $5k\n\nFull detailed report attached.',
    timestamp: '1 hour ago',
    isRead: false,
    isStarred: true,
    isImportant: true,
    hasAttachments: true,
    folder: 'inbox',
    labels: ['Weekly Report', 'Analytics'],
    isFromAgent: true
  },
  {
    id: '2',
    from: 'Marketing Team',
    fromEmail: 'marketing@company.com',
    to: 'agent@company.com',
    subject: 'Urgent: Black Friday Campaign Launch',
    body: 'Hi AI Agent,\n\nWe need to launch our Black Friday email campaign ASAP. The campaign includes:\n\n- 3 email sequences\n- 5,000 segmented customers\n- A/B test variants\n- Automated follow-ups\n\nPriority: URGENT\nDeadline: Today 6 PM\n\nPlease confirm receipt and ETA.\n\nBest regards,\nMarketing Team',
    timestamp: '2 hours ago',
    isRead: false,
    isStarred: false,
    isImportant: true,
    hasAttachments: true,
    folder: 'inbox',
    labels: ['Marketing', 'Campaign', 'Urgent'],
    isFromAgent: false
  },
  {
    id: '3',
    from: 'AI Agent',
    fromEmail: 'agent@company.com',
    to: 'finance@company.com',
    subject: 'Payment Approval Required - Vendor XYZ',
    body: 'Payment Approval Request\n\nVendor: XYZ Solutions Inc.\nAmount: $12,500.00\nInvoice: INV-2024-1127\nCategory: Software License Renewal\nDue Date: December 1, 2024\n\nDetails:\n- Annual license renewal for project management software\n- Contract verified and validated\n- Budget allocation confirmed\n- Previous payment history: Excellent\n\nThis payment exceeds the $10,000 auto-approval threshold and requires manual approval.\n\nPlease approve or reject this payment request.',
    timestamp: '3 hours ago',
    isRead: true,
    isStarred: true,
    isImportant: true,
    hasAttachments: false,
    folder: 'sent',
    labels: ['Finance', 'Approval Required'],
    isFromAgent: true
  },
  {
    id: '4',
    from: 'HR Department',
    fromEmail: 'hr@company.com',
    to: 'agent@company.com',
    subject: 'New Contractor Documentation - Jane Doe',
    body: 'Please process the attached contractor documentation for Jane Doe:\n\n- W-9 Tax Form\n- Signed Contract\n- Background Check Results\n- Banking Information\n\nRequired Actions:\n1. Verify all documents\n2. Set up payroll\n3. Provision system access\n4. Send welcome email\n5. Schedule orientation\n\nExpected completion: Within 24 hours\n\nThanks!',
    timestamp: '4 hours ago',
    isRead: true,
    isStarred: false,
    isImportant: false,
    hasAttachments: true,
    folder: 'inbox',
    labels: ['HR', 'Contractor', 'Onboarding'],
    isFromAgent: false
  },
  {
    id: '5',
    from: 'AI Agent',
    fromEmail: 'agent@company.com',
    to: 'support@outreach.com',
    subject: 'API Rate Limit Issue - Urgent Support Needed',
    body: 'Support Ticket\n\nIssue: Experiencing API rate limit errors when processing large email sequences\n\nError Details:\n- Error Code: 429\n- Message: "Rate limit exceeded"\n- Occurrence: During bulk email operations (>500 recipients)\n- Frequency: Intermittent, 3-4 times per day\n\nCurrent Impact:\n- Email campaigns delayed by 2-3 hours\n- Customer communication disrupted\n- Revenue impact estimated at $2,000/day\n\nRequested Resolution:\n1. Increase API rate limits for our account\n2. Provide guidance on optimal batch sizes\n3. Implement retry logic recommendations\n\nAccount ID: ACC-789456\nPriority: High\n\nThank you for your prompt attention.',
    timestamp: '6 hours ago',
    isRead: true,
    isStarred: false,
    isImportant: false,
    hasAttachments: false,
    folder: 'sent',
    labels: ['Support', 'Technical'],
    isFromAgent: true
  },
  {
    id: '6',
    from: 'Sales Team',
    fromEmail: 'sales@company.com',
    to: 'agent@company.com',
    subject: 'Q4 Lead List - 750 New Prospects',
    body: 'Hi AI Agent,\n\nAttached is our Q4 lead list with 750 new prospects from:\n\n- Trade show contacts: 300\n- Website signups: 200\n- Referrals: 150\n- Cold outreach responses: 100\n\nRequired Actions:\n✓ Import to CRM\n✓ Data validation and cleaning\n✓ Lead scoring and segmentation\n✓ Assign to appropriate sales reps\n✓ Launch nurture sequences\n\nTarget completion: End of week\n\nNote: These are high-value prospects with estimated deal values of $5k-50k each.\n\nThanks!',
    timestamp: '1 day ago',
    isRead: true,
    isStarred: true,
    isImportant: false,
    hasAttachments: true,
    folder: 'inbox',
    labels: ['Sales', 'Leads', 'Q4'],
    isFromAgent: false
  }
];

const folders = [
  { id: 'inbox', label: 'Inbox', icon: Inbox, count: 15 },
  { id: 'sent', label: 'Sent', icon: SendHorizontal, count: 23 },
  { id: 'draft', label: 'Drafts', icon: FileEdit, count: 5 },
  { id: 'important', label: 'Important', icon: Flag, count: 8 },
  { id: 'archive', label: 'Archive', icon: Archive, count: 67 },
  { id: 'trash', label: 'Trash', icon: Trash2, count: 3 }
];

interface MailScreenProps {
  onNavigate?: (screen: string) => void;
}

export function MailScreen({ onNavigate }: MailScreenProps) {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    body: ''
  });

  const filteredEmails = emails.filter(email => {
    const matchesFolder = activeFolder === 'inbox' ? email.folder === 'inbox' :
                         activeFolder === 'sent' ? email.folder === 'sent' :
                         activeFolder === 'draft' ? email.folder === 'draft' :
                         activeFolder === 'important' ? email.isImportant :
                         activeFolder === 'archive' ? email.folder === 'archive' :
                         activeFolder === 'trash' ? email.folder === 'trash' : true;
    
    const matchesSearch = !searchQuery || 
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.body.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFolder && matchesSearch;
  });

  const handleStarEmail = (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
    ));
    toast.success('Email starred');
  };

  const handleMarkAsRead = (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, isRead: true } : email
    ));
  };

  const handleDeleteEmail = (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, folder: 'trash' } : email
    ));
    setSelectedEmail(null);
    toast.success('Email moved to trash');
  };

  const handleArchiveEmail = (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, folder: 'archive' } : email
    ));
    setSelectedEmail(null);
    toast.success('Email archived');
  };

  const handleSendEmail = () => {
    if (!composeData.to || !composeData.subject) {
      toast.error('Please fill in required fields');
      return;
    }

    const newEmail: Email = {
      id: Date.now().toString(),
      from: 'AI Agent',
      fromEmail: 'agent@company.com',
      to: composeData.to,
      subject: composeData.subject,
      body: composeData.body,
      timestamp: 'now',
      isRead: true,
      isStarred: false,
      isImportant: false,
      hasAttachments: false,
      folder: 'sent',
      labels: ['Sent'],
      isFromAgent: true
    };

    setEmails(prev => [newEmail, ...prev]);
    setComposeData({ to: '', subject: '', body: '' });
    setIsComposing(false);
    toast.success('Email sent successfully');
  };

  const handleReply = (email: Email) => {
    setComposeData({
      to: email.fromEmail,
      subject: `Re: ${email.subject}`,
      body: `\n\n--- Original Message ---\nFrom: ${email.from}\nTo: ${email.to}\nSubject: ${email.subject}\n\n${email.body}`
    });
    setIsComposing(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950">
      <div className="p-6">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Agent Mail
            </h1>
            <p className="text-muted-foreground">
              Intelligent email management and automation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => toast.success('Refreshed')}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Settings className="w-4 h-4" />
            </Button>
            <Dialog open={isComposing} onOpenChange={setIsComposing}>
              <DialogTrigger asChild>
                <Button size="sm" className="gradient-primary text-white border-0 gap-2">
                  <Plus className="w-4 h-4" />
                  Compose
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Compose Email</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">To</label>
                      <Input
                        value={composeData.to}
                        onChange={(e) => setComposeData(prev => ({ ...prev, to: e.target.value }))}
                        placeholder="recipient@example.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Subject</label>
                      <Input
                        value={composeData.subject}
                        onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Email subject"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                      value={composeData.body}
                      onChange={(e) => setComposeData(prev => ({ ...prev, body: e.target.value }))}
                      placeholder="Type your message..."
                      rows={10}
                    />
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" className="gap-2">
                      <Paperclip className="w-4 h-4" />
                      Attach Files
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsComposing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSendEmail} className="gap-2">
                        <Send className="w-4 h-4" />
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Mail Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass border-0 shadow-xl h-[800px] overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search emails..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-white/50 dark:bg-black/20 backdrop-blur-sm"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0 h-full">
              <div className="flex h-full">
                {/* Sidebar */}
                <div className="w-56 border-r border-border/50 p-4 space-y-2">
                  {folders.map((folder) => {
                    const Icon = folder.icon;
                    return (
                      <Button
                        key={folder.id}
                        variant={activeFolder === folder.id ? "secondary" : "ghost"}
                        className="w-full justify-start gap-2 text-sm"
                        onClick={() => setActiveFolder(folder.id)}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="flex-1 text-left">{folder.label}</span>
                        {folder.count > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {folder.count}
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                </div>

                {/* Email List */}
                <div className="flex-1 flex">
                  <div className="w-96 border-r border-border/50">
                    <ScrollArea className="h-full">
                      <div className="p-2 space-y-1">
                        <AnimatePresence>
                          {filteredEmails.map((email, index) => (
                            <motion.div
                              key={email.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ delay: index * 0.05 }}
                              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
                                selectedEmail?.id === email.id ? 'bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500' : ''
                              } ${!email.isRead ? 'bg-blue-50/30 dark:bg-blue-950/10' : ''}`}
                              onClick={() => {
                                setSelectedEmail(email);
                                handleMarkAsRead(email.id);
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className={email.isFromAgent ? 'gradient-primary text-white' : 'bg-muted'}>
                                    {email.isFromAgent ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className={`text-sm truncate ${!email.isRead ? 'font-semibold' : ''}`}>
                                      {email.from}
                                    </p>
                                    <div className="flex items-center gap-1">
                                      {email.isImportant && <Flag className="w-3 h-3 text-red-500" />}
                                      {email.hasAttachments && <Paperclip className="w-3 h-3 text-muted-foreground" />}
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-4 h-4 p-0 hover:bg-transparent"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleStarEmail(email.id);
                                        }}
                                      >
                                        {email.isStarred ? (
                                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        ) : (
                                          <StarOff className="w-3 h-3 text-muted-foreground hover:text-yellow-400" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                  <p className={`text-sm truncate ${!email.isRead ? 'font-medium' : 'text-muted-foreground'}`}>
                                    {email.subject}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate mt-1">
                                    {email.body.substring(0, 80)}...
                                  </p>
                                  <div className="flex items-center justify-between mt-2">
                                    <div className="flex gap-1">
                                      {email.labels.slice(0, 2).map(label => (
                                        <Badge key={label} variant="outline" className="text-xs">
                                          {label}
                                        </Badge>
                                      ))}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      {email.timestamp}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Email Content */}
                  <div className="flex-1">
                    {selectedEmail ? (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="h-full flex flex-col"
                      >
                        {/* Email Header */}
                        <div className="p-4 border-b border-border/50">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold mb-2">{selectedEmail.subject}</h3>
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarFallback className={selectedEmail.isFromAgent ? 'gradient-primary text-white' : 'bg-muted'}>
                                    {selectedEmail.isFromAgent ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{selectedEmail.from}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedEmail.fromEmail} → {selectedEmail.to}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {selectedEmail.timestamp}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStarEmail(selectedEmail.id)}
                              >
                                {selectedEmail.isStarred ? (
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ) : (
                                  <StarOff className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReply(selectedEmail)}
                              className="gap-2"
                            >
                              <Reply className="w-4 h-4" />
                              Reply
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2">
                              <ReplyAll className="w-4 h-4" />
                              Reply All
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2">
                              <Forward className="w-4 h-4" />
                              Forward
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleArchiveEmail(selectedEmail.id)}
                              className="gap-2"
                            >
                              <Archive className="w-4 h-4" />
                              Archive
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteEmail(selectedEmail.id)}
                              className="gap-2 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </Button>
                          </div>
                        </div>

                        {/* Email Body */}
                        <ScrollArea className="flex-1 p-6">
                          <div className="prose prose-sm max-w-none">
                            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-50 bg-clip-text text-transparent">
                              {selectedEmail.body}
                            </pre>
                          </div>
                          {selectedEmail.hasAttachments && (
                            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                              <p className="text-sm font-medium mb-2">Attachments</p>
                              <div className="flex gap-2">
                                <Badge variant="outline" className="gap-1">
                                  <Paperclip className="w-3 h-3" />
                                  report.pdf
                                </Badge>
                                <Badge variant="outline" className="gap-1">
                                  <Paperclip className="w-3 h-3" />
                                  data.xlsx
                                </Badge>
                              </div>
                            </div>
                          )}
                        </ScrollArea>
                      </motion.div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <Mail className="w-16 h-16 mx-auto mb-4" />
                          <p className="text-lg">Select an email to view</p>
                          <p className="text-sm">Choose from {filteredEmails.length} emails in {activeFolder}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}