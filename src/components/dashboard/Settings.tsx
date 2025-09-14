import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, Lock, Bell, Database, Key, Users, Trash2, Download, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const adminUsers = [
  {
    id: "ADM-001",
    name: "Dr. Anita Sharma",
    email: "anita.sharma@nccr.gov.in",
    role: "Super Admin",
    department: "Marine Conservation",
    lastLogin: "2024-01-25 14:30",
    status: "Active",
    permissions: ["Full Access", "User Management", "Blockchain Access"]
  },
  {
    id: "ADM-002", 
    name: "Dr. Raj Patel",
    email: "raj.patel@nccr.gov.in",
    role: "Verification Admin",
    department: "Coastal Restoration",
    lastLogin: "2024-01-25 11:20",
    status: "Active",
    permissions: ["Report Verification", "Credit Issuance"]
  },
  {
    id: "ADM-003",
    name: "Dr. Meera Krishnan",
    email: "meera.krishnan@nccr.gov.in", 
    role: "Analytics Admin",
    department: "Data Analytics",
    lastLogin: "2024-01-24 16:45",
    status: "Active",
    permissions: ["Analytics Access", "Report Generation"]
  }
];

export const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [autoVerification, setAutoVerification] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { toast } = useToast();

  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  const resetPassword = () => {
    toast({
      title: "Password Reset",
      description: "Password reset link has been sent to your email.",
    });
  };

  const addNewUser = () => {
    toast({
      title: "Add User",
      description: "New user invitation form would open here.",
    });
  };

  const removeUser = (userId: string) => {
    toast({
      title: "User Removed",
      description: `User ${userId} has been removed from the system.`,
      variant: "destructive"
    });
  };

  const exportData = (dataType: string) => {
    toast({
      title: "Data Export",
      description: `${dataType} data export is being prepared.`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <Button variant="ocean" onClick={saveSettings}>
          Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="team">Team Management</TabsTrigger>
          <TabsTrigger value="system">System Config</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue="Dr. Anita Sharma" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="anita.sharma@nccr.gov.in" />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" defaultValue="Marine Conservation Division" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+91-11-2345-6789" />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Brief description about your role..."
                    defaultValue="Lead administrator for the Blue Carbon Restoration platform with expertise in marine conservation and coastal ecosystem management."
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button variant="outline" onClick={resetPassword} className="w-full">
                  <Lock className="h-4 w-4 mr-2" />
                  Reset Password via Email
                </Button>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Enable 2FA</span>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Communication Channels</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Email Notifications</span>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">SMS Alerts</span>
                      <p className="text-sm text-muted-foreground">Critical updates via SMS</p>
                    </div>
                    <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Notification Types</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">New Reports</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Verification Required</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Credits Issued</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">System Alerts</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Weekly Reports</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Blockchain Events</span>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Team Management</h2>
            <Button variant="ocean" onClick={addNewUser}>
              <Users className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>
          
          {adminUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {user.name}
                      <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                      <Badge variant="outline">{user.role}</Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                        Manage User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Manage User - {user.name}</DialogTitle>
                      </DialogHeader>
                      {selectedUser && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="role">Role</Label>
                            <Select defaultValue={selectedUser.role}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Super Admin">Super Admin</SelectItem>
                                <SelectItem value="Verification Admin">Verification Admin</SelectItem>
                                <SelectItem value="Analytics Admin">Analytics Admin</SelectItem>
                                <SelectItem value="Viewer">Viewer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label>Permissions</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {selectedUser.permissions.map((permission: string, index: number) => (
                                <Badge key={index} variant="outline">{permission}</Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">
                              Update Permissions
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={() => removeUser(selectedUser.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Department:</span>
                    <p className="font-medium">{user.department}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Login:</span>
                    <p className="font-medium">{user.lastLogin}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Permissions:</span>
                    <p className="font-medium">{user.permissions.length} assigned</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="dbHost">Database Host</Label>
                  <Input id="dbHost" defaultValue="localhost:5432" />
                </div>
                <div>
                  <Label htmlFor="dbName">Database Name</Label>
                  <Input id="dbName" defaultValue="blue_carbon_registry" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Auto Backup</span>
                    <p className="text-sm text-muted-foreground">Daily automatic backups</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button variant="outline" onClick={() => exportData("Database")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Database
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input id="apiKey" type="password" defaultValue="••••••••••••••••" />
                </div>
                <div>
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input id="webhookUrl" defaultValue="https://api.bluecarbon.gov.in/webhook" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Rate Limiting</span>
                    <p className="text-sm text-muted-foreground">1000 requests/hour</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button variant="outline">
                  <Key className="h-4 w-4 mr-2" />
                  Regenerate API Key
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>System Automation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">Auto Verification</span>
                  <p className="text-sm text-muted-foreground">Automatically verify reports meeting criteria</p>
                </div>
                <Switch checked={autoVerification} onCheckedChange={setAutoVerification} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">Smart Credit Calculation</span>
                  <p className="text-sm text-muted-foreground">AI-powered credit amount suggestions</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">Blockchain Auto-Submit</span>
                  <p className="text-sm text-muted-foreground">Automatically submit verified reports to blockchain</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Failed Login Attempts (24h)</span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Sessions</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Security Scan</span>
                    <span className="font-medium">2024-01-25</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Run Security Scan
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Access Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">IP Whitelisting</span>
                    <p className="text-sm text-muted-foreground">Restrict access to specific IPs</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Session Timeout</span>
                    <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input id="sessionTimeout" type="number" defaultValue="60" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Audit & Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">Audit Logging</span>
                  <p className="text-sm text-muted-foreground">Log all user actions</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => exportData("Audit Logs")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Audit Logs
                </Button>
                <Button variant="outline" onClick={() => exportData("Security Report")}>
                  <Download className="h-4 w-4 mr-2" />
                  Security Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};