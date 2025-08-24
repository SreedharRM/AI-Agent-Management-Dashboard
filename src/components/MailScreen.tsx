import React, { useState, useEffect } from 'react';
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
  Flag,
  Plus,
  RefreshCw,
  User,
  Bot,
  Filter,
  Download,
  Settings,
  Radius
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // <-- fix import for framer-motion
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';
import { useWsClient } from './ws-client';

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

const folders = [
  { id: 'inbox', label: 'Inbox', icon: Inbox, count: 15 },
  { id: 'sent', label: 'Sent', icon: SendHorizontal, count: 23 },
  { id: 'important', label: 'Important', icon: Flag, count: 8 },
  { id: 'trash', label: 'Trash', icon: Trash2, count: 3 }
];

// 🔹 Mapper: API JSON → Email interface
function mapApiMessageToEmail(msg: any): Email {
  const isSent = msg.labels?.includes("sent");
  return {
    id: msg.message_id,
    from: msg.from.split(" <")[0], // "AgentMail"
    fromEmail: msg.from.match(/<(.*?)>/)?.[1] ?? msg.from,
    to: msg.to?.[0] ?? "",
    subject: msg.subject ?? "(no subject)",
    body: msg.preview ?? "", // API only provides preview
    timestamp: new Date(msg.timestamp).toLocaleString(),
    isRead: !msg.labels?.includes("unread"),
    isStarred: false,
    isImportant: false,
    hasAttachments: false,
    folder: isSent ? "sent" : "inbox",
    labels: msg.labels ?? [],
    isFromAgent: msg.from.includes("agentmail.to")
  };
}

interface MailScreenProps {
  onNavigate?: (screen: string) => void;
}

export function MailScreen({ onNavigate }: MailScreenProps) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    body: ''
  });
  const [loading, setLoading] = useState(true);

  const wsClient = useWsClient();
  useEffect(() => {
    loadMessages(); // 🔹 initial fetch on first render only
  }, []);
  useEffect(() => {
  if (!wsClient) return;

  wsClient.onJSON = (data: any) => {
    console.log("Received WS data:", data);

    // ✅ Handle new incoming mail
    if (data.type === "event" && data.event_type === "message.received") {
      const msg = data.message;
      const newEmail = mapApiMessageToEmail({
        message_id: msg.message_id,
        from: msg.from_,
        to: msg.to,
        subject: msg.subject,
        preview: msg.preview,
        timestamp: msg.timestamp ?? Date.now(),
        labels: msg.labels ?? ["inbox"],
      });

      setEmails(prev => {
        // Avoid duplicates (if same id already exists)
        if (prev.some(e => e.id === newEmail.id)) {
          return prev;
        }
        return [newEmail, ...prev];
      });
      toast.success("📩 New email received");
    }
  };

  wsClient.sendIfOpen({
    type: "subscribe",
    inbox_ids: ["shinyproperty819@agentmail.to"],
  });

}, [wsClient]);



  async function loadMessages() {
    try {
      const res = await fetch("http://localhost:8080/messages");
      const data = await res.json();
      const mapped = data.messages.map(mapApiMessageToEmail);
      setEmails(mapped);
    } catch (err) {
      console.error("Failed to load messages", err);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }


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
      timestamp: new Date().toLocaleString(),
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

  // Add a variable for the email list width
  const emailListWidth = selectedEmail ? 380 : '100%';

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
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={loadMessages}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Mail Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass border-0 shadow-2xl h-[800px] overflow-hidden rounded-3xl">
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
                <div className="w-56 border-r border-border/50 p-4 space-y-2 bg-white/60 dark:bg-slate-900/40 rounded-l-3xl shadow-lg">
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
                <motion.div
                  animate={{ width: emailListWidth }}
                  transition={{ type: "spring", stiffness: 200, damping: 30 }}
                  className={`
                    relative h-full transition-all duration-300
                    ${selectedEmail ? 'border-r border-border/50 bg-white/80 dark:bg-slate-900/60' : 'bg-white/90 dark:bg-slate-900/70'}
                    shadow-xl
                    ${selectedEmail ? 'rounded-none' : 'rounded-r-3xl'}
                  `}
                  style={{ minWidth: 0, maxWidth: selectedEmail ? 400 : '100%' }}
                >
                  <ScrollArea className="h-full">
                    <div className="p-2 space-y-2" style={{ width: selectedEmail ? '350px' : '100%' }}>
                      <AnimatePresence>
                        {filteredEmails.map((email, index) => (
                          <motion.div
                            key={email.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className={`
                              p-4 rounded-xl cursor-pointer transition-all duration-200
                              hover:bg-gradient-to-r hover:from-blue-100/60 hover:to-purple-100/60 dark:hover:from-blue-900/40 dark:hover:to-purple-900/40
                              border border-transparent
                              ${selectedEmail?.id === email.id ? 'bg-gradient-to-r from-blue-200/60 to-purple-200/60 dark:from-blue-900/60 dark:to-purple-900/60 border-blue-400 shadow-lg' : ''}
                              ${!email.isRead ? 'font-semibold ring-2 ring-blue-200 dark:ring-blue-900' : ''}
                              flex flex-col gap-1
                            `}
                            onClick={() => {
                              setSelectedEmail(email);
                              handleMarkAsRead(email.id);
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <Avatar className="w-8 h-8 shadow-md">
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
                  {/* Overlay for closing email content on mobile/small screens */}
                  {selectedEmail && (
                    <button
                      className="absolute top-2 right-2 z-20 bg-white/80 dark:bg-slate-900/80 rounded-full p-1 shadow hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                      onClick={() => setSelectedEmail(null)}
                      title="Close email view"
                    >
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  )}
                </motion.div>

                {/* Email Content */}
                <AnimatePresence>
                  {selectedEmail && (
                    <motion.div
                      key="email-content"
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      transition={{ type: "spring", stiffness: 200, damping: 30 }}
                      className="flex-1 h-full bg-white/90 dark:bg-slate-900/80 shadow-2xl rounded-r-3xl flex flex-col"
                      style={{ minWidth: 0 }}
                    >
                      {/* Email Header */}
                      <div className="p-6 border-b border-border/50 bg-gradient-to-r from-blue-50/60 to-purple-50/60 dark:from-blue-950/40 dark:to-purple-950/40 rounded-tr-3xl">
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
                      <ScrollArea className="flex-1 p-8" style={{padding: '10px'}}>
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-50 bg-clip-text text-transparent">
                            {selectedEmail.body || "(no content available)"}
                          </pre>
                        </div>
                      </ScrollArea>
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* End Email Content */}
                {!selectedEmail && (
                  <div >
                    
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
