import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { IntegrationBadges } from './IntegrationBadges';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Settings, Shield, Link, Bell, Users, Key } from 'lucide-react';
import { motion } from 'motion/react';

const integrationSettings = [
  {
    name: 'Salesforce',
    description: 'CRM and lead management',
    status: 'connected',
    lastSync: '2 minutes ago',
    permissions: ['Read contacts', 'Create leads', 'Update opportunities']
  },
  {
    name: 'Outreach',
    description: 'Sales engagement platform',
    status: 'connected',
    lastSync: '5 minutes ago',
    permissions: ['Send emails', 'Create sequences', 'Update prospects']
  },
  {
    name: 'Slack',
    description: 'Team communication',
    status: 'disconnected',
    lastSync: 'Never',
    permissions: ['Send messages', 'Read channels']
  },
  {
    name: 'Autumn',
    description: 'Payment processing',
    status: 'connected',
    lastSync: '1 hour ago',
    permissions: ['Process payments', 'View transactions']
  }
];

const permissionSettings = [
  {
    category: 'Finance',
    description: 'Financial operations and payments',
    requiresApproval: true,
    permissions: [
      { name: 'Process payments under $1,000', enabled: true, requiresApproval: false },
      { name: 'Process payments over $1,000', enabled: true, requiresApproval: true },
      { name: 'Create vendor accounts', enabled: false, requiresApproval: true }
    ]
  },
  {
    category: 'Sales',
    description: 'Sales automation and outreach',
    requiresApproval: false,
    permissions: [
      { name: 'Send automated emails', enabled: true, requiresApproval: false },
      { name: 'Create sales sequences', enabled: true, requiresApproval: false },
      { name: 'Update customer records', enabled: true, requiresApproval: false }
    ]
  },
  {
    category: 'HR',
    description: 'Human resources operations',
    requiresApproval: true,
    permissions: [
      { name: 'Onboard contractors', enabled: true, requiresApproval: true },
      { name: 'Update employee records', enabled: false, requiresApproval: true },
      { name: 'Process timesheets', enabled: true, requiresApproval: false }
    ]
  }
];

export function SettingsScreen() {
  const [integrations, setIntegrations] = useState(integrationSettings);
  const [permissions, setPermissions] = useState(permissionSettings);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const toggleIntegration = (name: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.name === name 
          ? { 
              ...integration, 
              status: integration.status === 'connected' ? 'disconnected' : 'connected',
              lastSync: integration.status === 'connected' ? 'Never' : 'Just now'
            }
          : integration
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Settings</h1>
          <p className="text-muted-foreground">
            Configure integrations, permissions, and system preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="integrations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="integrations" className="gap-2">
            <Link className="w-4 h-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="permissions" className="gap-2">
            <Shield className="w-4 h-4" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Key className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <IntegrationBadges showTitle={false} layout="horizontal" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configure Integrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.map((integration, index) => (
                <motion.div
                  key={integration.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4>{integration.name}</h4>
                      <Badge variant={integration.status === 'connected' ? 'secondary' : 'outline'}>
                        {integration.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">{integration.description}</p>
                    <p className="text-muted-foreground">Last sync: {integration.lastSync}</p>
                    <div className="flex gap-1 mt-2">
                      {integration.permissions.map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleIntegration(integration.name)}
                    >
                      {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                    </Button>
                    <Button variant="ghost" size="sm">
                      Configure
                    </Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Permission Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {permissions.map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4>{category.category}</h4>
                      <p className="text-muted-foreground">{category.description}</p>
                    </div>
                    <Badge variant={category.requiresApproval ? 'destructive' : 'secondary'}>
                      {category.requiresApproval ? 'Approval Required' : 'Auto-run'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 ml-4">
                    {category.permissions.map((permission) => (
                      <div key={permission.name} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                        <div className="flex items-center gap-3">
                          <Switch checked={permission.enabled} />
                          <Label>{permission.name}</Label>
                        </div>
                        {permission.requiresApproval && (
                          <Badge variant="outline" className="text-xs">
                            Requires approval
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {index < permissions.length - 1 && <Separator />}
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Notifications</Label>
                  <p className="text-muted-foreground">Receive system notifications and alerts</p>
                </div>
                <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Alerts</Label>
                  <p className="text-muted-foreground">Get email notifications for important events</p>
                </div>
                <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Notification Types</Label>
                <div className="space-y-2">
                  {[
                    'Task completions',
                    'Failed operations',
                    'Self-healed issues', 
                    'Approval requests',
                    'Integration errors'
                  ].map((type) => (
                    <div key={type} className="flex items-center justify-between">
                      <Label>{type}</Label>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security & Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>API Keys</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p>Production API Key</p>
                      <p className="text-muted-foreground">••••••••••••••••</p>
                    </div>
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p>Webhook Secret</p>
                      <p className="text-muted-foreground">••••••••••••••••</p>
                    </div>
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Access Control</Label>
                <div className="flex items-center justify-between">
                  <div>
                    <p>Require 2FA for sensitive operations</p>
                    <p className="text-muted-foreground">Add extra security for high-risk actions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}