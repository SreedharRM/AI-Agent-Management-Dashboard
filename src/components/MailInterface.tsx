import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
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
  MoreHorizontal,
  Paperclip,
  Send,
  Inbox,
  SendHorizontal,
  FileEdit,
  Flag,
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  User,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
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
    subject: 'Invoice Processing Complete - VendorX Payment',
    body: 'The invoice from VendorX for $4,500 has been successfully processed and paid via Autumn payment system. Transaction ID: PAY-2024-001.\n\nDetails:\n- Amount: $4,500\n- Vendor: VendorX Corp\n- Payment Method: ACH\n- Processing Time: 2.3 seconds\n\nAll documentation has been filed automatically in the financial records system.',
    timestamp: '2 minutes ago',
    isRead: false,
    isStarred: true,
    isImportant: true,
    hasAttachments: true,
    folder: 'inbox',
    labels: ['Finance', 'Automated'],
    isFromAgent: true
  },
  {
    id: '2',
    from: 'Sarah Johnson',
    fromEmail: 'sarah@company.com',
    to: 'agent@company.com',
    subject: 'New Lead List for Outreach Campaign',
    body: 'Hi AI Agent,\n\nPlease process the attached lead list for our Q1 outreach campaign. The list contains 500 qualified prospects from the recent webinar.\n\nPriority: High\nTarget completion: Today\n\nThanks!',
    timestamp: '15 minutes ago',
    isRead: true,
    isStarred: false,
    isImportant: false,
    hasAttachments: true,
    folder: 'inbox',
    labels: ['Sales', 'Campaign'],
    isFromAgent: false
  },
  {
    id: '3',
    from: 'AI Agent',
    fromEmail: 'agent@company.com',
    to: 'hr@company.com',
    subject: 'Contractor Onboarding Complete - John Smith',
    body: 'Successfully completed onboarding process for contractor John Smith.\n\nCompleted Actions:\n- Document verification ✓\n- Tax form processing ✓\n- System access provisioning ✓\n- Welcome email sent ✓\n\nContractor is now active in the system and ready to begin work.',
    timestamp: '1 hour ago',
    isRead: true,
    isStarred: false,
    isImportant: false,
    hasAttachments: false,
    folder: 'sent',
    labels: ['HR', 'Onboarding'],
    isFromAgent: true
  },
  {
    id: '4',
    from: 'Finance Team',
    fromEmail: 'finance@company.com',
    to: 'agent@company.com',
    subject: 'Monthly Expense Report Request',
    body: 'Please generate and send the monthly expense report for December 2024. Include all automated transactions and vendor payments.',
    timestamp: '3 hours ago',
    isRead: false,
    isStarred: true,
    isImportant: true,
    hasAttachments: false,
    folder: 'inbox',
    labels: ['Finance', 'Reports'],
    isFromAgent: false
  }
];

const folders = [
  { id: 'inbox', label: 'Inbox', icon: Inbox, count: 12 },
  { id: 'sent', label: 'Sent', icon: SendHorizontal, count: 8 },
  { id: 'draft', label: 'Drafts', icon: FileEdit, count: 3 },
  { id: 'important', label: 'Important', icon: Flag, count: 5 },
  { id: 'archive', label: 'Archive', icon: Archive, count: 24 },
  { id: 'trash', label: 'Trash', icon: Trash2, count: 2 }
];

export function MailInterface() {
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
    <Card className="glass border-0 shadow-xl h-[600px] overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-500" />
            AI Agent Mail
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => toast.success('Refreshed')}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Dialog open={isComposing} onOpenChange={setIsComposing}>
              <DialogTrigger asChild>
                <Button size="sm" className="gradient-primary text-white border-0 gap-2">
                  <Plus className="w-4 h-4" />
                  Compose
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
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
                      rows={8}
                    />
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" className="gap-2">
                      <Paperclip className="w-4 h-4" />
                      Attach
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
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white/50 dark:bg-black/20 backdrop-blur-sm"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 h-full">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-48 border-r border-border/50 p-4 space-y-2">
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
                              {email.body.substring(0, 60)}...
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex gap-1">
                                {email.labels.map(label => (
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
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className={selectedEmail.isFromAgent ? 'gradient-primary text-white' : 'bg-muted'}>
                              {selectedEmail.isFromAgent ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{selectedEmail.from}</p>
                            <p className="text-sm text-muted-foreground">
                              to {selectedEmail.to}
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
                  <ScrollArea className="flex-1 p-4">
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {selectedEmail.body}
                      </pre>
                    </div>
                  </ScrollArea>
                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Mail className="w-12 h-12 mx-auto mb-4" />
                    <p>Select an email to view</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}