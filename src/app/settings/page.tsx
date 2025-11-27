'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  User,
  Bell,
  Palette,
  Globe,
  Zap,
  Shield,
  Database,
  Key,
  Monitor,
  Smartphone,
  Download,
  Upload,
  RefreshCw,
  Save
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <AuthGuard requiredRoles={['admin']}>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Configure system settings, preferences, and administrative options
            </p>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>User Management</span>
                </CardTitle>
                <CardDescription>
                  Manage users, roles, and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Users</span>
                    <Badge variant="secondary">156</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Sessions</span>
                    <Badge variant="default">42</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending Invites</span>
                    <Badge variant="outline">8</Badge>
                  </div>
                  <Button className="w-full" variant="outline">
                    Manage Users
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>System Configuration</span>
                </CardTitle>
                <CardDescription>
                  Core system settings and configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Environment</span>
                    <Badge variant="secondary">Development</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Version</span>
                    <Badge variant="outline">v2.1.0</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Updated</span>
                    <span className="text-sm text-muted-foreground">2 hours ago</span>
                  </div>
                  <Button className="w-full" variant="outline">
                    System Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Security</span>
                </CardTitle>
                <CardDescription>
                  Security settings and access controls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Two-Factor Auth</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Session Timeout</span>
                    <span className="text-sm text-muted-foreground">30 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Failed Attempts</span>
                    <span className="text-sm text-muted-foreground">5 attempts</span>
                  </div>
                  <Button className="w-full" variant="outline">
                    Security Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </CardTitle>
                <CardDescription>
                  Configure notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Notifications</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Push Notifications</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SMS Alerts</span>
                    <Badge variant="outline">Disabled</Badge>
                  </div>
                  <Button className="w-full" variant="outline">
                    Notification Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5" />
                  <span>Appearance</span>
                </CardTitle>
                <CardDescription>
                  Customize the look and feel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Theme</span>
                    <Badge variant="secondary">Light</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Font Size</span>
                    <span className="text-sm text-muted-foreground">Medium</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Compact Mode</span>
                    <Badge variant="outline">Disabled</Badge>
                  </div>
                  <Button className="w-full" variant="outline">
                    Appearance Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Localization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>Localization</span>
                </CardTitle>
                <CardDescription>
                  Language and regional settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Language</span>
                    <Badge variant="secondary">English (IN)</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Time Zone</span>
                    <span className="text-sm text-muted-foreground">IST (UTC+5:30)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Date Format</span>
                    <span className="text-sm text-muted-foreground">DD/MM/YYYY</span>
                  </div>
                  <Button className="w-full" variant="outline">
                    Localization Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Performance</span>
                </CardTitle>
                <CardDescription>
                  System performance and optimization settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Animations</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-save</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cache Size</span>
                    <span className="text-sm text-muted-foreground">256 MB</span>
                  </div>
                  <Button className="w-full" variant="outline">
                    Performance Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5" />
                  <span>Data Management</span>
                </CardTitle>
                <CardDescription>
                  Data backup and management options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Backup</span>
                    <span className="text-sm text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto Backup</span>
                    <Badge variant="default">Daily</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Retention</span>
                    <span className="text-sm text-muted-foreground">90 days</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="flex-1" variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                    <Button className="flex-1" variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-1" />
                      Import
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API & Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="w-5 h-5" />
                  <span>API & Integration</span>
                </CardTitle>
                <CardDescription>
                  API keys and third-party integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Keys</span>
                    <Badge variant="secondary">3 Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Webhooks</span>
                    <Badge variant="default">5 Configured</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rate Limit</span>
                    <span className="text-sm text-muted-foreground">1000/hr</span>
                  </div>
                  <Button className="w-full" variant="outline">
                    API Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Device Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="w-5 h-5" />
                  <span>Device Management</span>
                </CardTitle>
                <CardDescription>
                  Manage connected devices and sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Devices</span>
                    <Badge variant="default">3</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Trusted Devices</span>
                    <Badge variant="secondary">2</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sessions</span>
                    <Badge variant="outline">5</Badge>
                  </div>
                  <Button className="w-full" variant="outline">
                    Manage Devices
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Mobile App */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5" />
                  <span>Mobile App</span>
                </CardTitle>
                <CardDescription>
                  Mobile application settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">App Version</span>
                    <Badge variant="secondary">v1.2.0</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Push Notifications</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Biometric Login</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <Button className="w-full" variant="outline">
                    Mobile Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Advanced</span>
                </CardTitle>
                <CardDescription>
                  Advanced system configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Debug Mode</span>
                    <Badge variant="outline">Disabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Feature Flags</span>
                    <Badge variant="secondary">12 Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">System Logs</span>
                    <span className="text-sm text-muted-foreground">Available</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="flex-1" variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Restart
                    </Button>
                    <Button className="flex-1" variant="outline" size="sm">
                      <Save className="w-4 h-4 mr-1" />
                      Save Config
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}