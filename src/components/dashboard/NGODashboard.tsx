import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Coins,
  TrendingUp,
  Camera,
  MapPin,
  Calendar,
  MessageCircle,
  Wallet,
  Download,
  Plus,
  Send,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StepWizardForm } from "@/components/reports/StepWizardForm";

// Mock data for NGO user
const ngoData = {
  profile: {
    name: "Coastal Restoration Initiative",
    location: "West Bengal, India",
    totalProjects: 8,
    totalCredits: 1250,
    activeReports: 3,
    pendingCredits: 420
  },
  reports: [
    {
      id: "BCR-2024-001",
      title: "Sundarbans Mangrove Restoration Phase 2",
      status: "Verified",
      submitDate: "2024-01-15",
      verificationDate: "2024-01-20",
      credits: 150,
      area: "2.5 hectares",
      messages: 0
    },
    {
      id: "BCR-2024-003", 
      title: "Pulicat Lagoon Salt Marsh Recovery",
      status: "Pending",
      submitDate: "2024-01-17",
      credits: 200,
      area: "3.2 hectares",
      messages: 1
    },
    {
      id: "BCR-2024-005",
      title: "Community Training Documentation", 
      status: "Under Review",
      submitDate: "2024-01-20",
      credits: 0,
      area: "N/A",
      messages: 2
    },
    {
      id: "BCR-2024-007",
      title: "Chilika Seagrass Monitoring",
      status: "Rejected",
      submitDate: "2024-01-18",
      rejectionReason: "Insufficient documentation",
      credits: 0,
      area: "1.2 hectares",
      messages: 3
    }
  ],
  wallet: {
    totalCredits: 1250,
    availableCredits: 830,
    lockedCredits: 420,
    transactions: [
      { id: "TXN-001", type: "Earned", amount: 150, date: "2024-01-20", description: "Sundarbans Phase 2 Verification" },
      { id: "TXN-002", type: "Transfer", amount: -50, date: "2024-01-22", description: "Transfer to Community Partner" },
      { id: "TXN-003", type: "Earned", amount: 120, date: "2024-01-18", description: "Chilika Conservation Verified" }
    ]
  }
};

export const NGODashboard = () => {
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const { toast } = useToast();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Verified":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Pending":
      case "Under Review":
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
      case "Under Review":
        return "secondary" as const;
      case "Rejected":
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
          <p className="text-muted-foreground">{ngoData.profile.name} • {ngoData.profile.location}</p>
        </div>
        <Button onClick={() => setShowSubmissionForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Submit New Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">{ngoData.profile.activeReports}</div>
                <div className="text-sm text-muted-foreground">Active Reports</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Coins className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">{ngoData.profile.totalCredits}</div>
                <div className="text-sm text-muted-foreground">Total Credits Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">{ngoData.profile.pendingCredits}</div>
                <div className="text-sm text-muted-foreground">Pending Credits</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">{ngoData.profile.totalProjects}</div>
                <div className="text-sm text-muted-foreground">Total Projects</div>
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
          <div className="space-y-4">
            {ngoData.reports.map((report) => (
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
                        {report.messages > 0 && (
                          <Badge variant="outline" className="gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {report.messages}
                          </Badge>
                        )}
                      </CardTitle>
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
                      <p className="font-medium">{report.submitDate}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Area:</span>
                      <p className="font-medium">{report.area}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Credits:</span>
                      <p className="font-medium">{report.credits} tonnes</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <p className="font-medium">{report.status}</p>
                    </div>
                  </div>
                  
                  {report.status === "Rejected" && report.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-700">
                        <strong>Rejection Reason:</strong> {report.rejectionReason}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Wallet Tab */}
        <TabsContent value="wallet" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Available Credits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{ngoData.wallet.availableCredits}</div>
                <p className="text-sm text-muted-foreground">Ready for transfer or trade</p>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" onClick={handleTransferCredits} className="gap-2">
                    <Send className="h-4 w-4" />
                    Transfer
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleTradeCredits} className="gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Trade
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Locked Credits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{ngoData.wallet.lockedCredits}</div>
                <p className="text-sm text-muted-foreground">Pending verification</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{ngoData.wallet.totalCredits}</div>
                <p className="text-sm text-muted-foreground">Lifetime earnings</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ngoData.wallet.transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.type === 'Earned' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.type === 'Earned' ? '+' : '-'}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className={`font-bold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount} credits
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tracking Tab */}
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Progress Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">75%</span>
                </div>
                <Progress value={75} />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Credits Earned vs Target</span>
                  <span className="text-sm text-muted-foreground">1250 / 2000</span>
                </div>
                <Progress value={62.5} />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Reports Submitted This Quarter</span>
                  <span className="text-sm text-muted-foreground">8 / 12</span>
                </div>
                <Progress value={66.7} />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium">Q1 Report Deadline</p>
                      <p className="text-sm text-muted-foreground">March 31, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="font-medium">Site Verification Visit</p>
                      <p className="text-sm text-muted-foreground">April 15, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Coins className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="font-medium">Credit Issuance</p>
                      <p className="text-sm text-muted-foreground">April 30, 2024</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impact Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Area Restored</span>
                    <span className="font-bold">24.8 hectares</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CO₂ Sequestered</span>
                    <span className="font-bold">1,250 tonnes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Communities Engaged</span>
                    <span className="font-bold">12 villages</span>
                  </div>
                  <div className="flex justify-between">
                    <span>People Trained</span>
                    <span className="font-bold">240 individuals</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Marketplace Tab */}
        <TabsContent value="marketplace" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Carbon Credit Marketplace</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <TrendingUp className="h-16 w-16 mx-auto text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Marketplace Coming Soon</h3>
              <p className="text-muted-foreground mb-4">
                Buy, sell, and trade verified carbon credits with other organizations
              </p>
              <Button variant="outline">Join Waitlist</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};