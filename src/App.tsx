import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  CheckSquare, 
  FileText, 
  Shield, 
  Settings,
  Moon,
  Sun,
  Sparkles,
  Mail
} from 'lucide-react';
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';
import { Toaster } from './components/ui/toaster';
import { Dashboard } from './components/Dashboard';
import { TasksScreen } from './components/TasksScreen';
import { LogsScreen } from './components/LogsScreen';
import { ApprovalsScreen } from './components/ApprovalsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { MailScreen } from './components/MailScreen';
import { toast } from 'sonner';
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'mail', label: 'Mail', icon: Mail },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'logs', label: 'Logs', icon: FileText },
  { id: 'approvals', label: 'Approvals', icon: Shield },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function App() {
  const tasks = useQuery(api.tasks.getAllTasks); // now works under provider
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    toast.success(`Switched to ${!darkMode ? 'dark' : 'light'} mode`);
  };

  const handleScreenChange = (screenId: string) => {
    setActiveScreen(screenId);
  };

  const renderScreen = () => {
    const screenProps = { onNavigate: handleScreenChange };
    
    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard {...screenProps} />;
      case 'mail':
        return <MailScreen {...screenProps} />;
      case 'tasks':
        return <TasksScreen {...screenProps} />;
      case 'logs':
        return <LogsScreen {...screenProps} />;
      case 'approvals':
        return <ApprovalsScreen {...screenProps} />;
      case 'settings':
        return <SettingsScreen {...screenProps} />;
      default:
        return <Dashboard {...screenProps} />;
    }
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <motion.div 
        className="w-64 bg-card/80 backdrop-blur-xl border-r border-border/50 flex flex-col shadow-xl"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="p-6">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-2 h-10 rounded-xl flex items-center justify-center ">
              
            </div>
            <div>
              <h3 className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AImploy
              </h3>
              <p className="text-xs text-muted-foreground">Intelligent Automation</p>
            </div>
          </motion.div>
        </div>

        <Separator className="opacity-50" />

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Button
                  variant={activeScreen === item.id ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 transition-all duration-200 hover:scale-105 ${
                    activeScreen === item.id 
                      ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/20 shadow-sm' 
                      : 'hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-purple-500/5'
                  }`}
                  onClick={() => handleScreenChange(item.id)}
                >
                  <IconComponent className={`w-4 h-4 ${activeScreen === item.id ? 'text-blue-600' : ''}`} />
                  {item.label}
                </Button>
              </motion.div>
            );
          })}
        </nav>

        <Separator className="opacity-50" />

        {/* Theme toggle */}
        <div className="p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="w-full justify-start gap-3 hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-purple-500/5 transition-all duration-200"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScreen}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ 
              duration: 0.4,
              type: "spring",
              damping: 25,
              stiffness: 200
            }}
            className="flex-1"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}