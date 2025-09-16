import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Download,
  FileText,
  AlertTriangle,
  Clock,
  Satellite,
  Coins,
  Send,
  Filter,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const pendingReports = [
  {
    id: "BCR-2024-001",
    title: "Sundarbans Mangrove Restoration Phase 2",
    project: "Sundarbans Mangrove Restoration",
    community: "Gosaba Village Committee",
    submitted: "2024-01-15",
    submitter: "Ravi Kumar",
    submitterEmail: "ravi@gosaba.org",
    area: "2.5 hectares",
    activity: "Mangrove Plantation",
    description: "Restoration of degraded mangrove areas in the Sundarbans delta. Activities include seedling plantation, community training, and monitoring protocols setup.",
    gps: "22.1696°N, 88.8817°E",
    photos: 12,
    droneData: "Available",
    estimatedCredits: 150,
    priority: "high",
    riskLevel: "low",
    proofDocuments: [
      { name: "plantation_photos.zip", type: "photo", size: "45.2 MB", geotagged: true },
      { name: "gps_tracking.gpx", type: "gps", size: "2.1 MB", geotagged: false },
      { name: "drone_survey.pdf", type: "drone", size: "15.8 MB", geotagged: true }
    ],
    verificationChecklist: {
      documentationComplete: false,
      locationVerified: false,
      areaCalculated: false,
      photoAuthenticity: false,
      communityValidation: false
    }
  },
  {
    id: "BCR-2024-002", 
    title: "Chilika Lake Seagrass Conservation Expansion",
    project: "Chilika Lake Seagrass Conservation",
    community: "Balugaon Fishermen Association",
    submitted: "2024-01-16",
    submitter: "Priya Patel",
    submitterEmail: "priya@balugaon.org",
    area: "1.8 hectares",
    activity: "Seagrass Restoration",
    description: "Expansion of seagrass beds in Chilika Lake through transplantation and protection measures. Includes fishermen community engagement and sustainable practices training.",
    gps: "19.7179°N, 85.4456°E",
    photos: 8,
    droneData: "Pending",
    estimatedCredits: 120,
    priority: "medium",
    riskLevel: "medium",
    proofDocuments: [
      { name: "seagrass_photos.zip", type: "photo", size: "28.4 MB", geotagged: true },
      { name: "water_quality_data.xlsx", type: "other", size: "1.2 MB", geotagged: false }
    ],
    verificationChecklist: {
      documentationComplete: true,
      locationVerified: true,
      areaCalculated: false,
      photoAuthenticity: false,
      communityValidation: false
    }
  },
  {
    id: "BCR-2024-003",
    title: "Pulicat Lagoon Salt Marsh Recovery Initiative",
    project: "Pulicat Lagoon Salt Marsh Recovery",
    community: "Sullurpeta Coastal Group",
    submitted: "2024-01-17",
    submitter: "Anjali Singh",
    submitterEmail: "anjali@sullurpeta.org",
    area: "3.2 hectares",
    activity: "Salt Marsh Restoration",
    description: "Comprehensive salt marsh ecosystem restoration including native plant species reintroduction, soil improvement, and habitat creation for coastal wildlife.",
    gps: "13.6288°N, 80.3492°E",
    photos: 15,
    droneData: "Available",
    estimatedCredits: 200,
    priority: "high",
    riskLevel: "low",
    proofDocuments: [
      { name: "marsh_restoration_photos.zip", type: "photo", size: "67.9 MB", geotagged: true },
      { name: "soil_analysis_report.pdf", type: "other", size: "8.4 MB", geotagged: false },
      { name: "drone_mapping_data.zip", type: "drone", size: "234.7 MB", geotagged: true },
      { name: "species_inventory.xlsx", type: "other", size: "3.1 MB", geotagged: false }
    ],
    verificationChecklist: {
      documentationComplete: true,
      locationVerified: true,
      areaCalculated: true,
      photoAuthenticity: true,
      communityValidation: false
    }
  }
];

export const EnhancedVerification = () => {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [verificationComment, setVerificationComment] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [messageToSubmitter, setMessageToSubmitter] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterRisk, setFilterRisk] = useState("all");
  const [checklist, setChecklist] = useState<any>({});
  const { toast } = useToast();

  const filteredReports = pendingReports.filter(report => {
    const matchesPriority = filterPriority === "all" || report.priority === filterPriority;
    const matchesRisk = filterRisk === "all" || report.riskLevel === filterRisk;
    return matchesPriority && matchesRisk;
  });

  const handleVerify = (reportId: string, status: 'approved' | 'rejected') => {
    const selectedReport = pendingReports.find(r => r.id === reportId);
    const creditsToIssue = status === 'approved' ? (creditAmount || selectedReport?.estimatedCredits) : 0;
    
    toast({
      title: `Report ${status}`,
      description: `Report ${reportId} has been ${status}${status === 'approved' ? ` and ${creditsToIssue} carbon credits will be issued` : ' with comments provided'}.`,
    });
    
    if (status === 'approved') {
      console.log(`Issuing ${creditsToIssue} credits for report ${reportId}`);
    }
    
    setSelectedReport(null);
    setVerificationComment("");
    setCreditAmount("");
    setMessageToSubmitter("");
    setChecklist({});
  };

  const sendMessageToSubmitter = (reportId: string) => {
    toast({
      title: "Message Sent",
      description: `Message sent to report submitter for ${reportId}.`,
    });
    
    console.log(`Sending message to submitter for report ${reportId}: ${messageToSubmitter}`);
    setMessageToSubmitter("");
  };

  const bulkApprove = () => {
    toast({
      title: "Bulk Approval",
      description: `${filteredReports.length} reports have been approved for carbon credit issuance.`,
    });
  };

  const handleChecklistChange = (key: string, value: boolean) => {
    setChecklist((prev: any) => ({ ...prev, [key]: value }));
  };

  const getCompletionPercentage = (report: any) => {
    const checklistItems = Object.values(report.verificationChecklist);
    const completed = checklistItems.filter(Boolean).length;
    return Math.round((completed / checklistItems.length) * 100);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-orange-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
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
        <div className="flex gap-2">
          <Button onClick={bulkApprove} variant="ocean" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Bulk Approve Selected
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{pendingReports.length}</div>
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
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">8.5h</div>
            <div className="text-sm text-muted-foreground">Avg Review Time</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Verification</TabsTrigger>
          <TabsTrigger value="history">Verification History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRisk} onValueChange={setFilterRisk}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 mb-2">
                        {report.id} - {report.title}
                        <Badge variant={report.priority === 'high' ? 'destructive' : report.priority === 'medium' ? 'secondary' : 'outline'}>
                          {report.priority} priority
                        </Badge>
                        <Badge variant="outline" className={getRiskColor(report.riskLevel)}>
                          {report.riskLevel} risk
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{report.project}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Submitted: {report.submitted}</span>
                        <span>•</span>
                        <span>By: {report.submitter}</span>
                        <span>•</span>
                        <span>Completion: {getCompletionPercentage(report)}%</span>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Review Report
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Detailed Verification - {report.id}</DialogTitle>
                        </DialogHeader>
                        {selectedReport && (
                          <div className="grid grid-cols-3 gap-6">
                            {/* Left Column - Report Details */}
                            <div className="col-span-2 space-y-6">
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
                                      <p>{selectedReport.project}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Community:</span>
                                      <p>{selectedReport.community}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Activity:</span>
                                      <p>{selectedReport.activity}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Area:</span>
                                      <p>{selectedReport.area}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Est. Credits:</span>
                                      <p>{selectedReport.estimatedCredits} tonnes CO₂</p>
                                    </div>
                                  </div>
                                  <Separator />
                                  <div>
                                    <span className="font-medium">Description:</span>
                                    <p className="text-sm mt-1">{selectedReport.description}</p>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Submitter Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span>{selectedReport.submitter}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MessageCircle className="h-4 w-4" />
                                    <span>{selectedReport.submitterEmail}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>Submitted: {selectedReport.submitted}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{selectedReport.gps}</span>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Proof Documents</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-3">
                                    {selectedReport.proofDocuments.map((doc: any, index: number) => (
                                      <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                                        <div className="flex items-center gap-3">
                                          {getFileIcon(doc.type)}
                                          <div>
                                            <p className="font-medium">{doc.name}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                              <span>{doc.size}</span>
                                              {doc.geotagged && (
                                                <Badge variant="secondary" className="text-xs">Geotagged</Badge>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                          <Download className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            {/* Right Column - Verification Actions */}
                            <div className="space-y-6">
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Verification Checklist</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  {Object.entries(selectedReport.verificationChecklist).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between">
                                      <span className="text-sm">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                                      <input
                                        type="checkbox"
                                        checked={checklist[key] !== undefined ? checklist[key] : value}
                                        onChange={(e) => handleChecklistChange(key, e.target.checked)}
                                        className="rounded"
                                      />
                                    </div>
                                  ))}
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Credit Assessment</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
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
                                    <Label htmlFor="comment">Verification Notes</Label>
                                    <Textarea
                                      id="comment"
                                      placeholder="Add detailed verification notes and observations..."
                                      value={verificationComment}
                                      onChange={(e) => setVerificationComment(e.target.value)}
                                      className="min-h-[100px]"
                                    />
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Communication</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div>
                                    <Label htmlFor="message-submitter">Message to Submitter</Label>
                                    <Textarea
                                      id="message-submitter"
                                      placeholder="Send clarification requests or feedback to the submitter..."
                                      value={messageToSubmitter}
                                      onChange={(e) => setMessageToSubmitter(e.target.value)}
                                    />
                                  </div>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => sendMessageToSubmitter(selectedReport.id)}
                                    className="w-full gap-2"
                                  >
                                    <Send className="h-4 w-4" />
                                    Send Message
                                  </Button>
                                </CardContent>
                              </Card>

                              <div className="flex flex-col gap-2">
                                <Button 
                                  variant="ocean" 
                                  onClick={() => handleVerify(selectedReport.id, 'approved')}
                                  className="gap-2"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Approve & Issue Credits
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  onClick={() => handleVerify(selectedReport.id, 'rejected')}
                                  className="gap-2"
                                >
                                  <XCircle className="h-4 w-4" />
                                  Reject Report
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
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
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
                    <div>
                      <span className="text-muted-foreground">Documents:</span>
                      <p className="font-medium">{report.proofDocuments.length} files</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Verification History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Verification History</h3>
                <p>Completed verifications will appear here with detailed audit trails.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Verification Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                <p>Verification metrics, trends, and performance data coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};