import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye,
  MapPin,
  Calendar,
  User,
  Camera,
  CheckCircle,
  Clock,
  XCircle,
  Leaf
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const reports = [
  {
    id: "BCR-2024-001",
    title: "Sundarbans Mangrove Restoration Phase 2",
    project: "Sundarbans Mangrove Restoration",
    community: "Gosaba Village Committee",
    submitter: "Ravi Kumar",
    submitDate: "2024-01-15",
    area: "2.5 hectares",
    activity: "Mangrove Plantation",
    status: "Verified",
    location: "22.1696°N, 88.8817°E",
    photos: 12,
    droneData: "Available",
    estimatedCredits: 150,
    actualCredits: 150,
    verifier: "Dr. Anita Sharma",
    verificationDate: "2024-01-20"
  },
  {
    id: "BCR-2024-002",
    title: "Chilika Lake Seagrass Conservation Expansion",
    project: "Chilika Lake Seagrass Conservation",
    community: "Balugaon Fishermen Association",
    submitter: "Priya Patel",
    submitDate: "2024-01-16",
    area: "1.8 hectares",
    activity: "Seagrass Restoration",
    status: "Verified",
    location: "19.7179°N, 85.4456°E",
    photos: 8,
    droneData: "Pending",
    estimatedCredits: 120,
    actualCredits: 120,
    verifier: "Dr. Raj Patel",
    verificationDate: "2024-01-22"
  },
  {
    id: "BCR-2024-003",
    title: "Pulicat Lagoon Salt Marsh Recovery Initiative",
    project: "Pulicat Lagoon Salt Marsh Recovery",
    community: "Sullurpeta Coastal Group",
    submitter: "Anjali Singh",
    submitDate: "2024-01-17",
    area: "3.2 hectares",
    activity: "Salt Marsh Restoration",
    status: "Pending",
    location: "13.6288°N, 80.3492°E",
    photos: 15,
    droneData: "Available",
    estimatedCredits: 200,
    actualCredits: null,
    verifier: null,
    verificationDate: null
  },
  {
    id: "BCR-2024-004",
    title: "Kochi Backwater Wetland Monitoring",
    project: "Kochi Backwater Restoration",
    community: "Kochi Backwater Collective",
    submitter: "Dr. Lakshmi Nair",
    submitDate: "2024-01-18",
    area: "1.5 hectares",
    activity: "Wetland Monitoring",
    status: "Verified",
    location: "9.9312°N, 76.2673°E",
    photos: 20,
    droneData: "Available",
    estimatedCredits: 90,
    actualCredits: 95,
    verifier: "Dr. Meera Krishnan",
    verificationDate: "2024-01-24"
  },
  {
    id: "BCR-2023-045",
    title: "Sundarbans Community Training Documentation",
    project: "Sundarbans Mangrove Restoration",
    community: "Gosaba Village Committee",
    submitter: "Ravi Kumar",
    submitDate: "2023-12-28",
    area: "0 hectares",
    activity: "Community Training",
    status: "Rejected",
    location: "22.1696°N, 88.8817°E",
    photos: 5,
    droneData: "Not Applicable",
    estimatedCredits: 0,
    actualCredits: 0,
    verifier: "Dr. Anita Sharma",
    verificationDate: "2024-01-03"
  }
];

export const Reports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const { toast } = useToast();

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.community.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.submitter.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalReports = reports.length;
  const verifiedReports = reports.filter(r => r.status === "Verified").length;
  const pendingReports = reports.filter(r => r.status === "Pending").length;
  const rejectedReports = reports.filter(r => r.status === "Rejected").length;

  const exportReports = () => {
    toast({
      title: "Export Started",
      description: "Reports are being exported to CSV format.",
    });
  };

  const viewReportDetails = (report: any) => {
    setSelectedReport(report);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Verified":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-orange-600" />;
      case "Rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Verified":
        return "default" as const;
      case "Pending":
        return "secondary" as const;
      case "Rejected":
        return "destructive" as const;
      default:
        return "outline" as const;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Reports Management</h1>
        <Button onClick={exportReports} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Reports
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">{totalReports}</div>
                <div className="text-sm text-muted-foreground">Total Reports</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">{verifiedReports}</div>
                <div className="text-sm text-muted-foreground">Verified</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">{pendingReports}</div>
                <div className="text-sm text-muted-foreground">Pending Review</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">{rejectedReports}</div>
                <div className="text-sm text-muted-foreground">Rejected</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="recent">Recent Submissions</TabsTrigger>
          <TabsTrigger value="analytics">Report Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports by title, community, or submitter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {report.id} - {report.title}
                        <Badge variant={getStatusVariant(report.status)} className="gap-1">
                          {getStatusIcon(report.status)}
                          {report.status}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{report.community}</p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => viewReportDetails(report)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Report Details - {report.id}</DialogTitle>
                        </DialogHeader>
                        {selectedReport && (
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold mb-2">Basic Information</h3>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    <span><strong>Title:</strong> {selectedReport.title}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span><strong>Submitter:</strong> {selectedReport.submitter}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span><strong>Submit Date:</strong> {selectedReport.submitDate}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span><strong>Location:</strong> {selectedReport.location}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="font-semibold mb-2">Activity Details</h3>
                                <div className="space-y-2 text-sm">
                                  <p><strong>Project:</strong> {selectedReport.project}</p>
                                  <p><strong>Activity Type:</strong> {selectedReport.activity}</p>
                                  <p><strong>Area Covered:</strong> {selectedReport.area}</p>
                                  <div className="flex items-center gap-2">
                                    <Camera className="h-4 w-4" />
                                    <span><strong>Photos:</strong> {selectedReport.photos} images</span>
                                  </div>
                                  <p><strong>Drone Data:</strong> {selectedReport.droneData}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold mb-2">Carbon Credits</h3>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span>Estimated Credits:</span>
                                    <span className="font-medium">{selectedReport.estimatedCredits} tonnes</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Actual Credits:</span>
                                    <span className="font-medium text-green-600">
                                      {selectedReport.actualCredits || "Pending"} 
                                      {selectedReport.actualCredits && " tonnes"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="font-semibold mb-2">Verification</h3>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(selectedReport.status)}
                                    <span><strong>Status:</strong> {selectedReport.status}</span>
                                  </div>
                                  {selectedReport.verifier && (
                                    <p><strong>Verified by:</strong> {selectedReport.verifier}</p>
                                  )}
                                  {selectedReport.verificationDate && (
                                    <p><strong>Verification Date:</strong> {selectedReport.verificationDate}</p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="pt-4 border-t">
                                <Button variant="ocean" className="w-full">
                                  <Leaf className="h-4 w-4 mr-2" />
                                  View Full Environmental Impact
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
                      <span className="text-muted-foreground">Submitter:</span>
                      <p className="font-medium">{report.submitter}</p>
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
                      <span className="text-muted-foreground">Submit Date:</span>
                      <p className="font-medium">{report.submitDate}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Credits:</span>
                      <p className="font-medium text-green-600">
                        {report.actualCredits || report.estimatedCredits} tonnes
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Recent submissions from the last 7 days will appear here with enhanced filtering options.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Submission Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Submission trends and patterns analysis will be displayed here.
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Verification Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Verification time analysis and efficiency metrics will appear here.
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};