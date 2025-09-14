import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Award, 
  MapPin, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye
} from "lucide-react";

const overviewData = {
  totalReports: 40,
  verifiedReports: 35,
  pendingReports: 3,
  rejectedReports: 2,
  totalCredits: 1350,
  totalCommunities: 12,
  activeSites: 4,
  co2Sequestered: 2025,
  totalValue: 37485,
  monthlyGrowth: {
    reports: 15.8,
    credits: 22.3,
    communities: 8.7
  }
};

const recentActivity = [
  {
    id: 1,
    type: "Report Verified",
    description: "Sundarbans Mangrove Restoration - 150 credits issued",
    time: "2 hours ago",
    status: "success"
  },
  {
    id: 2,
    type: "New Community",
    description: "Kochi Backwater Collective joined the platform",
    time: "1 day ago", 
    status: "info"
  },
  {
    id: 3,
    type: "Blockchain Update",
    description: "Registry entry confirmed on Polygon",
    time: "2 days ago",
    status: "success"
  },
  {
    id: 4,
    type: "Pending Review",
    description: "Chilika Lake report awaiting verification",
    time: "3 days ago",
    status: "warning"
  }
];

export const Overview = () => {
  const verificationRate = (overviewData.verifiedReports / overviewData.totalReports) * 100;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">Blue Carbon Restoration Platform Analytics</p>
        </div>
        <Button variant="ocean" className="gap-2">
          <Eye className="h-4 w-4" />
          View Full Report
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">{overviewData.totalReports}</span>
                  <div className="flex items-center text-green-600 text-sm">
                    <ArrowUpRight className="h-3 w-3" />
                    {overviewData.monthlyGrowth.reports}%
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">Total Reports</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">{overviewData.totalCredits.toLocaleString()}</span>
                  <div className="flex items-center text-green-600 text-sm">
                    <ArrowUpRight className="h-3 w-3" />
                    {overviewData.monthlyGrowth.credits}%
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">Carbon Credits</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">{overviewData.totalCommunities}</span>
                  <div className="flex items-center text-green-600 text-sm">
                    <ArrowUpRight className="h-3 w-3" />
                    {overviewData.monthlyGrowth.communities}%
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">Active Communities</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-ocean-100 rounded-lg">
                <Activity className="h-6 w-6 text-ocean-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">{overviewData.co2Sequestered.toLocaleString()}</span>
                  <div className="flex items-center text-green-600 text-sm">
                    <ArrowUpRight className="h-3 w-3" />
                    18.5%
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">Tonnes CO₂</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Verification Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Verified Reports</span>
                <span>{overviewData.verifiedReports}/{overviewData.totalReports}</span>
              </div>
              <Progress value={verificationRate} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {verificationRate.toFixed(1)}% completion rate
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-green-600">{overviewData.verifiedReports}</div>
                <div className="text-xs text-muted-foreground">Verified</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-orange-600">{overviewData.pendingReports}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-red-600">{overviewData.rejectedReports}</div>
                <div className="text-xs text-muted-foreground">Rejected</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Impact Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{overviewData.activeSites}</div>
                <div className="text-sm text-blue-800">Project Sites</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">{overviewData.totalCommunities}</div>
                <div className="text-sm text-green-800">Communities</div>
              </div>
            </div>
            
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Credit Value</span>
                <span className="text-lg font-bold text-green-600">
                  ${overviewData.totalValue.toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Average: ${(overviewData.totalValue / overviewData.totalCredits).toFixed(2)} per credit
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'warning' ? 'bg-orange-500' :
                  activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                }`} />
                <div className="flex-1">
                  <div className="font-medium text-sm">{activity.type}</div>
                  <div className="text-xs text-muted-foreground">{activity.description}</div>
                </div>
                <div className="text-xs text-muted-foreground">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-sm text-muted-foreground">Avg. Processing Time</div>
            <div className="text-xl font-bold">2.3 days</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-sm text-muted-foreground">Success Rate</div>
            <div className="text-xl font-bold">{verificationRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-sm text-muted-foreground">Active This Week</div>
            <div className="text-xl font-bold">15</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <Award className="h-8 w-8 text-ocean-600 mx-auto mb-2" />
            <div className="text-sm text-muted-foreground">Credits This Month</div>
            <div className="text-xl font-bold">580</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};