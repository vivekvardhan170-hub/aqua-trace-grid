import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Eye, MapPin, Calendar, User, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const pendingReports = [
  {
    id: "BCR-2024-001",
    project: "Sundarbans Mangrove Restoration",
    community: "Gosaba Village Committee",
    submitted: "2024-01-15",
    area: "2.5 hectares",
    activity: "Mangrove Plantation",
    gps: "22.1696°N, 88.8817°E",
    photos: 12,
    droneData: "Available",
    submitter: "Ravi Kumar",
    estimatedCredits: 150,
    priority: "high"
  },
  {
    id: "BCR-2024-002", 
    project: "Chilika Lake Seagrass Conservation",
    community: "Balugaon Fishermen Association",
    submitted: "2024-01-16",
    area: "1.8 hectares",
    activity: "Seagrass Restoration",
    gps: "19.7179°N, 85.4456°E",
    photos: 8,
    droneData: "Pending",
    submitter: "Priya Patel",
    estimatedCredits: 120,
    priority: "medium"
  },
  {
    id: "BCR-2024-003",
    project: "Pulicat Lagoon Salt Marsh Recovery",
    community: "Sullurpeta Coastal Group",
    submitted: "2024-01-17",
    area: "3.2 hectares",
    activity: "Salt Marsh Restoration",
    gps: "13.6288°N, 80.3492°E",
    photos: 15,
    droneData: "Available",
    submitter: "Anjali Singh",
    estimatedCredits: 200,
    priority: "high"
  }
];

export const Verification = () => {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [verificationComment, setVerificationComment] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const { toast } = useToast();

  const handleVerify = (reportId: string, status: 'approved' | 'rejected') => {
    toast({
      title: `Report ${status}`,
      description: `Report ${reportId} has been ${status}${status === 'approved' ? ' and carbon credits will be issued' : ''}.`,
    });
    setSelectedReport(null);
    setVerificationComment("");
    setCreditAmount("");
  };

  const bulkApprove = () => {
    toast({
      title: "Bulk Approval",
      description: "3 reports have been approved for carbon credit issuance.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Verification Center</h1>
        <Button onClick={bulkApprove} variant="ocean" className="gap-2">
          <CheckCircle className="h-4 w-4" />
          Bulk Approve All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">3</div>
            <div className="text-sm text-muted-foreground">Pending Reviews</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">15</div>
            <div className="text-sm text-muted-foreground">Approved Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">2</div>
            <div className="text-sm text-muted-foreground">Rejected Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">470</div>
            <div className="text-sm text-muted-foreground">Credits to Issue</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Verification</TabsTrigger>
          <TabsTrigger value="history">Verification History</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {report.id}
                      <Badge variant={report.priority === 'high' ? 'destructive' : 'secondary'}>
                        {report.priority} priority
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{report.project}</p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Report Verification - {report.id}</DialogTitle>
                      </DialogHeader>
                      {selectedReport && (
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-semibold mb-2">Project Details</h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{selectedReport.gps}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>Submitted: {selectedReport.submitted}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  <span>{selectedReport.submitter}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Camera className="h-4 w-4" />
                                  <span>{selectedReport.photos} photos, {selectedReport.droneData}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="font-semibold mb-2">Activity Information</h3>
                              <div className="space-y-2 text-sm">
                                <p><strong>Community:</strong> {selectedReport.community}</p>
                                <p><strong>Activity:</strong> {selectedReport.activity}</p>
                                <p><strong>Area:</strong> {selectedReport.area}</p>
                                <p><strong>Estimated Credits:</strong> {selectedReport.estimatedCredits} tonnes CO₂</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="credits">Carbon Credits to Issue</Label>
                              <Input
                                id="credits"
                                type="number"
                                placeholder={selectedReport.estimatedCredits.toString()}
                                value={creditAmount}
                                onChange={(e) => setCreditAmount(e.target.value)}
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="comment">Verification Comment</Label>
                              <Textarea
                                id="comment"
                                placeholder="Add verification notes..."
                                value={verificationComment}
                                onChange={(e) => setVerificationComment(e.target.value)}
                              />
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                variant="ocean" 
                                onClick={() => handleVerify(selectedReport.id, 'approved')}
                                className="flex-1"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve & Issue Credits
                              </Button>
                              <Button 
                                variant="destructive" 
                                onClick={() => handleVerify(selectedReport.id, 'rejected')}
                                className="flex-1"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Community:</span>
                    <p className="font-medium">{report.community}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Activity:</span>
                    <p className="font-medium">{report.activity}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Area:</span>
                    <p className="font-medium">{report.area}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Est. Credits:</span>
                    <p className="font-medium">{report.estimatedCredits} tonnes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Verification History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Verification history will appear here once reports are processed.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};