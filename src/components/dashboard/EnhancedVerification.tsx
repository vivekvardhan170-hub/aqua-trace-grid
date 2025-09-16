import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  MapPin, 
  Calendar, 
  User, 
  Camera, 
  MessageCircle,
  FileText,
  Clock,
  Satellite,
  Coins,
  Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const EnhancedVerification = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [verificationComment, setVerificationComment] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [messageToSubmitter, setMessageToSubmitter] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load reports from database with real-time updates
  useEffect(() => {
    const loadReports = async () => {
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('*')
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

    // Subscribe to real-time updates
    const channel = supabase
      .channel('reports-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reports'
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
  }, [toast]);

  const handleVerify = async (reportId: string, status: 'approved' | 'rejected') => {
    try {
      const creditsToIssue = status === 'approved' ? (parseInt(creditAmount) || selectedReport?.estimated_credits) : null;
      
      const { error } = await supabase
        .from('reports')
        .update({
          status: status === 'approved' ? 'Verified' : 'Rejected',
          verification_status: status,
          actual_credits: creditsToIssue,
          verification_notes: verificationComment,
          verification_date: new Date().toISOString(),
        })
        .eq('id', reportId);

      if (error) throw error;
      
      toast({
        title: `Report ${status}`,
        description: `Report has been ${status}${status === 'approved' ? ` and ${creditsToIssue} carbon credits will be issued` : ' with comments provided'}.`,
      });
      
      setSelectedReport(null);
      setVerificationComment("");
      setCreditAmount("");
      setMessageToSubmitter("");
      
    } catch (error) {
      console.error('Error updating report:', error);
      toast({
        title: "Error",
        description: "Failed to update report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sendMessageToSubmitter = (reportId: string) => {
    toast({
      title: "Message Sent",
      description: `Message sent to report submitter.`,
    });
    setMessageToSubmitter("");
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'photo': return <Camera className="h-4 w-4" />;
      case 'gps': return <MapPin className="h-4 w-4" />;
      case 'drone': return <Satellite className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">NCCR Verification Center</h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{reports.filter(r => r.verification_status === 'pending').length}</div>
            <div className="text-sm text-muted-foreground">Pending Reviews</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{reports.filter(r => r.verification_status === 'approved').length}</div>
            <div className="text-sm text-muted-foreground">Approved Reports</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{reports.filter(r => r.verification_status === 'rejected').length}</div>
            <div className="text-sm text-muted-foreground">Rejected Reports</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Verification</TabsTrigger>
          <TabsTrigger value="history">Verification History</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading reports...</div>
          ) : reports.filter(r => r.verification_status === 'pending').length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No pending reports</div>
          ) : (
            <div className="space-y-4">
              {reports.filter(r => r.verification_status === 'pending').slice(0, 2).map((report) => (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 mb-2">
                          {report.title}
                          <Badge variant="secondary">
                            <Clock className="h-3 w-3 mr-1" />
                            {report.status}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{report.project_name}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Submitted: {new Date(report.created_at).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>Credits: {report.estimated_credits}</span>
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Review Report
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Verify Report - {report.title}</DialogTitle>
                          </DialogHeader>
                          {selectedReport && (
                            <div className="space-y-6">
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Project Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">Title:</span>
                                      <p>{selectedReport.title}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Project:</span>
                                      <p>{selectedReport.project_name}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Community:</span>
                                      <p>{selectedReport.community_name}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Activity:</span>
                                      <p>{selectedReport.activity_type}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Area:</span>
                                      <p>{selectedReport.area_covered} hectares</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Est. Credits:</span>
                                      <p>{selectedReport.estimated_credits} tonnes CO₂</p>
                                    </div>
                                  </div>
                                  <Separator />
                                  <div>
                                    <span className="font-medium">Description:</span>
                                    <p className="text-sm mt-1">{selectedReport.description}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{selectedReport.location_coordinates}</span>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Proof Documents</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  {selectedReport.proof_documents && selectedReport.proof_documents.length > 0 ? (
                                    <div className="space-y-3">
                                      {selectedReport.proof_documents.map((doc: any, index: number) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                                          <div className="flex items-center gap-3">
                                            {getFileIcon(doc.fileType)}
                                            <div>
                                              <p className="font-medium">{doc.fileName}</p>
                                              <p className="text-xs text-muted-foreground">
                                                {Math.round(doc.fileSize / 1024 / 1024 * 100) / 100} MB • {doc.geotagged ? 'Geotagged' : 'No GPS data'}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-muted-foreground">No documents uploaded</p>
                                  )}
                                </CardContent>
                              </Card>

                              <div className="grid grid-cols-2 gap-4">
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Verification Decision</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="credits">Carbon Credits to Issue</Label>
                                      <Input
                                        id="credits"
                                        type="number"
                                        placeholder={`Default: ${selectedReport.estimated_credits}`}
                                        value={creditAmount}
                                        onChange={(e) => setCreditAmount(e.target.value)}
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="comments">Verification Comments</Label>
                                      <Textarea
                                        id="comments"
                                        placeholder="Add verification notes..."
                                        value={verificationComment}
                                        onChange={(e) => setVerificationComment(e.target.value)}
                                        className="min-h-[100px]"
                                      />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                      <Button 
                                        onClick={() => handleVerify(selectedReport.id, 'approved')}
                                        className="gap-2"
                                        variant="default"
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                        Accept
                                      </Button>
                                      <Button 
                                        onClick={() => handleVerify(selectedReport.id, 'rejected')}
                                        variant="destructive"
                                        className="gap-2"
                                      >
                                        <XCircle className="h-4 w-4" />
                                        Reject
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Message NGO</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="message">Send message</Label>
                                      <Textarea
                                        id="message"
                                        placeholder="Ask questions or request additional documentation..."
                                        value={messageToSubmitter}
                                        onChange={(e) => setMessageToSubmitter(e.target.value)}
                                        className="min-h-[100px]"
                                      />
                                    </div>
                                    <Button 
                                      onClick={() => sendMessageToSubmitter(selectedReport.id)}
                                      variant="outline"
                                      className="w-full gap-2"
                                      disabled={!messageToSubmitter.trim()}
                                    >
                                      <Send className="h-4 w-4" />
                                      Send Message
                                    </Button>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading verification history...</div>
          ) : reports.filter(r => r.verification_status !== 'pending').length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No verified reports yet</div>
          ) : (
            <div className="space-y-4">
              {reports.filter(r => r.verification_status !== 'pending').slice(0, 2).map((report) => (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 mb-2">
                          {report.title}
                          <Badge variant={report.verification_status === 'approved' ? 'default' : 'destructive'}>
                            {report.verification_status === 'approved' ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {report.verification_status === 'approved' ? 'Accepted' : 'Rejected'}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{report.project_name}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Submitted: {new Date(report.created_at).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>Verified: {new Date(report.verification_date).toLocaleDateString()}</span>
                          {report.verification_status === 'approved' && (
                            <>
                              <span>•</span>
                              <span className="text-green-600">Credits: {report.actual_credits || report.estimated_credits}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Report Details - {report.title}</DialogTitle>
                          </DialogHeader>
                          {selectedReport && (
                            <div className="space-y-6">
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg flex items-center gap-2">
                                    Project Information
                                    <Badge variant={selectedReport.verification_status === 'approved' ? 'default' : 'destructive'}>
                                      {selectedReport.verification_status === 'approved' ? (
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                      ) : (
                                        <XCircle className="h-3 w-3 mr-1" />
                                      )}
                                      {selectedReport.verification_status === 'approved' ? 'Accepted' : 'Rejected'}
                                    </Badge>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">Title:</span>
                                      <p>{selectedReport.title}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Project:</span>
                                      <p>{selectedReport.project_name}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Community:</span>
                                      <p>{selectedReport.community_name}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Activity:</span>
                                      <p>{selectedReport.activity_type}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Area:</span>
                                      <p>{selectedReport.area_covered} hectares</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        {selectedReport.verification_status === 'approved' ? 'Credits Issued:' : 'Est. Credits:'}
                                      </span>
                                      <p className={selectedReport.verification_status === 'approved' ? 'text-green-600 font-semibold' : ''}>
                                        {selectedReport.verification_status === 'approved' 
                                          ? (selectedReport.actual_credits || selectedReport.estimated_credits)
                                          : selectedReport.estimated_credits
                                        } tonnes CO₂
                                      </p>
                                    </div>
                                  </div>
                                  <Separator />
                                  <div>
                                    <span className="font-medium">Description:</span>
                                    <p className="text-sm mt-1">{selectedReport.description}</p>
                                  </div>
                                  {selectedReport.verification_notes && (
                                    <>
                                      <Separator />
                                      <div>
                                        <span className="font-medium">Verification Notes:</span>
                                        <p className="text-sm mt-1 p-3 bg-muted rounded-md">{selectedReport.verification_notes}</p>
                                      </div>
                                    </>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{selectedReport.location_coordinates}</span>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Proof Documents</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  {selectedReport.proof_documents && selectedReport.proof_documents.length > 0 ? (
                                    <div className="space-y-3">
                                      {selectedReport.proof_documents.map((doc: any, index: number) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                                          <div className="flex items-center gap-3">
                                            {getFileIcon(doc.fileType)}
                                            <div>
                                              <p className="font-medium">{doc.fileName}</p>
                                              <p className="text-xs text-muted-foreground">
                                                {Math.round(doc.fileSize / 1024 / 1024 * 100) / 100} MB • {doc.geotagged ? 'Geotagged' : 'No GPS data'}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-muted-foreground">No documents uploaded</p>
                                  )}
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};