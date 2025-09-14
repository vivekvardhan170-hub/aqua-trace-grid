import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Download, Calendar, BarChart3, PieChart, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const analyticsData = {
  overview: {
    totalReports: 40,
    verifiedReports: 35,
    pendingReports: 3,
    rejectedReports: 2,
    totalCredits: 1350,
    totalCO2: 2025,
    totalValue: 37485,
    growthRate: 15.8
  },
  monthly: [
    { month: "Jan 2024", reports: 12, credits: 450, co2: 675, value: 11475 },
    { month: "Feb 2024", reports: 8, credits: 320, co2: 480, value: 9200 },
    { month: "Mar 2024", reports: 15, credits: 580, co2: 870, value: 16810 },
    { month: "Dec 2023", reports: 5, credits: 0, co2: 0, value: 0 }
  ],
  ecosystems: [
    { type: "Mangrove", projects: 2, area: 75, credits: 650, percentage: 48.1 },
    { type: "Seagrass", projects: 1, area: 30, credits: 320, percentage: 23.7 },
    { type: "Salt Marsh", projects: 1, area: 40, credits: 200, percentage: 14.8 },
    { type: "Coastal Wetland", projects: 1, area: 25, credits: 180, percentage: 13.3 }
  ],
  regions: [
    { state: "West Bengal", projects: 1, credits: 450, percentage: 33.3 },
    { state: "Odisha", projects: 1, credits: 320, percentage: 23.7 },
    { state: "Andhra Pradesh", projects: 1, credits: 200, percentage: 14.8 },
    { state: "Kerala", projects: 1, credits: 380, percentage: 28.1 }
  ]
};

export const Analytics = () => {
  const { toast } = useToast();

  const downloadReport = (type: string) => {
    toast({
      title: "Report Download",
      description: `${type} report is being generated and will be downloaded shortly.`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
        <div className="flex gap-2">
          <Select defaultValue="2024">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => downloadReport("Comprehensive Analytics")}>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">{analyticsData.overview.totalReports}</div>
                <div className="text-sm text-muted-foreground">Total Reports</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">{analyticsData.overview.totalCredits.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Credits Issued</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-ocean-gradient" />
              <div>
                <div className="text-2xl font-bold text-foreground">{analyticsData.overview.totalCO2.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Tonnes CO₂ Sequestered</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <PieChart className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">${analyticsData.overview.totalValue.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Credit Value</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Trends & Growth</TabsTrigger>
          <TabsTrigger value="ecosystem">Ecosystem Analysis</TabsTrigger>
          <TabsTrigger value="regional">Regional Distribution</TabsTrigger>
          <TabsTrigger value="reports">Report Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Monthly Report Trends</CardTitle>
                <Button variant="outline" size="sm" onClick={() => downloadReport("Monthly Trends")}>
                  <Download className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-blue-700 font-medium">Monthly Reports Chart</p>
                    <p className="text-sm text-blue-600">Interactive timeline visualization</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2 text-sm">
                  {analyticsData.monthly.map((month, index) => (
                    <div key={index} className="text-center p-2 bg-muted rounded">
                      <div className="font-medium">{month.month.split(' ')[0]}</div>
                      <div className="text-muted-foreground">{month.reports} reports</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Carbon Credit Growth</CardTitle>
                <Button variant="outline" size="sm" onClick={() => downloadReport("Credit Growth")}>
                  <Download className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center border-2 border-dashed border-green-200">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-2" />
                    <p className="text-green-700 font-medium">Credit Issuance Trends</p>
                    <p className="text-sm text-green-600">Growth rate: +{analyticsData.overview.growthRate}%</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="p-2 bg-muted rounded">
                    <div className="text-muted-foreground">Current Month</div>
                    <div className="font-medium text-green-600">580 credits</div>
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <div className="text-muted-foreground">Avg. Monthly</div>
                    <div className="font-medium">450 credits</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ecosystem" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Ecosystem Distribution</CardTitle>
                <Button variant="outline" size="sm" onClick={() => downloadReport("Ecosystem Analysis")}>
                  <Download className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.ecosystems.map((ecosystem, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-medium">{ecosystem.type}</div>
                        <div className="text-sm text-muted-foreground">
                          {ecosystem.projects} projects • {ecosystem.area} hectares
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600">{ecosystem.credits} credits</div>
                        <div className="text-sm text-muted-foreground">{ecosystem.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Ecosystem Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg flex items-center justify-center border-2 border-dashed border-emerald-200">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-emerald-600 mx-auto mb-2" />
                    <p className="text-emerald-700 font-medium">Ecosystem Pie Chart</p>
                    <p className="text-sm text-emerald-600">Credits by ecosystem type</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="regional" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Regional Performance</CardTitle>
                <Button variant="outline" size="sm" onClick={() => downloadReport("Regional Analysis")}>
                  <Download className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.regions.map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-medium">{region.state}</div>
                        <div className="text-sm text-muted-foreground">
                          {region.projects} active projects
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-blue-600">{region.credits} credits</div>
                        <div className="text-sm text-muted-foreground">{region.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
                  <div className="text-center">
                    <Activity className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-blue-700 font-medium">India Regional Map</p>
                    <p className="text-sm text-blue-600">Project distribution by state</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Status Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Verified</span>
                    <span className="font-medium text-green-600">{analyticsData.overview.verifiedReports}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Pending</span>
                    <span className="font-medium text-orange-600">{analyticsData.overview.pendingReports}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Rejected</span>
                    <span className="font-medium text-red-600">{analyticsData.overview.rejectedReports}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Verification Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {((analyticsData.overview.verifiedReports / analyticsData.overview.totalReports) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                  <div className="mt-4 text-xs text-muted-foreground">
                    Average processing time: 2.3 days
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Data Completeness</span>
                    <span className="font-medium">95.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Photo Quality</span>
                    <span className="font-medium">91.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GPS Accuracy</span>
                    <span className="font-medium">98.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};