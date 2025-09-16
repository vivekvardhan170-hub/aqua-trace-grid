import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Coins,
  TrendingUp,
  MapPin,
  Calendar,
  MessageCircle,
  Wallet,
  Plus,
  Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StepWizardForm } from "@/components/reports/StepWizardForm";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";

export const NGODashboard = () => {
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const { toast } = useToast();

  // Load user's reports with real-time updates
  useEffect(() => {
    if (!user?.id) return;

    const loadReports = async () => {
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setReports(data || []);
      } catch (error) {
        console.error('Error loading reports:', error);
        toast({
          title: "Error",
          description: "Failed to load reports. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadReports();

    // Subscribe to real-time updates for user's reports
    const channel = supabase
      .channel('user-reports-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reports',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time update:', payload);
          loadReports(); // Reload reports when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, toast]);

  const getStatusIcon = (status: string, verificationStatus?: string) => {
    const effectiveStatus = verificationStatus || status;
    switch (effectiveStatus.toLowerCase()) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-orange-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string, verificationStatus?: string) => {
    const effectiveStatus = verificationStatus || status;
    switch (effectiveStatus.toLowerCase()) {
      case "approved":
        return "default" as const;
      case "pending":
        return "secondary" as const;
      case "rejected":
        return "destructive" as const;
      default:
        return "outline" as const;
    }
  };

  const handleTransferCredits = () => {
    toast({
      title: "Transfer Initiated",
      description: "Credit transfer functionality will be available soon.",
    });
  };

  const handleTradeCredits = () => {
    toast({
      title: "Trading Platform",
      description: "Carbon credit trading marketplace coming soon.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">NGO Dashboard</h1>
          <p className="text-muted-foreground">Community Restoration Organization</p>
        </div>
        <Button onClick={() => setShowSubmissionForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Submit New Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">{reports.length}</div>
                <div className="text-sm text-muted-foreground">Total Reports</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Coins className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {reports.filter(r => r.verification_status === 'approved').reduce((sum, r) => sum + (r.actual_credits || 0), 0)}
                </div>
                <div className="text-sm text-muted-foreground">Credits Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {reports.filter(r => r.verification_status === 'pending').reduce((sum, r) => sum + r.estimated_credits, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Pending Credits</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Submission Dialog */}
      <Dialog open={showSubmissionForm} onOpenChange={setShowSubmissionForm}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submit New Restoration Activity Report</DialogTitle>
          </DialogHeader>
          <StepWizardForm onSuccess={() => setShowSubmissionForm(false)} />
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">My Reports</TabsTrigger>
          <TabsTrigger value="wallet">Credit Wallet</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No reports submitted yet. Click "Submit New Report" to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {report.title}
                          <Badge variant={getStatusVariant(report.status, report.verification_status)} className="gap-1">
                            {getStatusIcon(report.status, report.verification_status)}
                            {report.verification_status ? report.verification_status.charAt(0).toUpperCase() + report.verification_status.slice(1) : report.status}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{report.project_name}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedReport(report)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Submitted:</span>
                        <p className="font-medium">{new Date(report.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Area:</span>
                        <p className="font-medium">{report.area_covered} hectares</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Credits:</span>
                        <p className="font-medium">
                          {report.verification_status === 'approved' ? report.actual_credits : report.estimated_credits} tonnes
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Activity:</span>
                        <p className="font-medium">{report.activity_type}</p>
                      </div>
                    </div>
                    
                    {report.verification_status === "rejected" && report.verification_notes && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-700">
                          <strong>Rejection Reason:</strong> {report.verification_notes}
                        </p>
                      </div>
                    )}
                    
                    {report.verification_status === "approved" && report.verification_notes && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-sm text-green-700">
                          <strong>Verification Notes:</strong> {report.verification_notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Wallet Tab */}
        <TabsContent value="wallet" className="space-y-4">
          <div className="text-center py-8 text-muted-foreground">
            Credit wallet functionality coming soon.
          </div>
        </TabsContent>

        {/* Progress Tracking Tab */}
        <TabsContent value="progress" className="space-y-4">
          <div className="text-center py-8 text-muted-foreground">
            Progress tracking coming soon.
          </div>
        </TabsContent>

        {/* Marketplace Tab */}
        <TabsContent value="marketplace" className="space-y-4">
          <div className="text-center py-8 text-muted-foreground">
            Carbon credit marketplace coming soon.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};