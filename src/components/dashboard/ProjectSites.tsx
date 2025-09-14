import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MapPin, Activity, Users, TrendingUp, Eye, Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const projectSites = [
  {
    id: "PS-001",
    name: "Sundarbans Mangrove Restoration",
    location: "West Bengal, India",
    coordinates: "22.1696°N, 88.8817°E",
    area: "50 hectares",
    ecosystem: "Mangrove Forest",
    status: "Active",
    communities: 5,
    reports: 12,
    creditsIssued: 450,
    co2Sequestered: 675,
    startDate: "2023-06-15",
    manager: "Dr. Anita Sharma",
    activities: ["Plantation", "Monitoring", "Community Training"]
  },
  {
    id: "PS-002", 
    name: "Chilika Lake Seagrass Conservation",
    location: "Odisha, India",
    coordinates: "19.7179°N, 85.4456°E",
    area: "30 hectares",
    ecosystem: "Seagrass Beds",
    status: "Active",
    communities: 3,
    reports: 8,
    creditsIssued: 320,
    co2Sequestered: 480,
    startDate: "2023-08-20",
    manager: "Dr. Raj Patel",
    activities: ["Restoration", "Protection", "Research"]
  },
  {
    id: "PS-003",
    name: "Pulicat Lagoon Salt Marsh Recovery",
    location: "Andhra Pradesh, India", 
    coordinates: "13.6288°N, 80.3492°E",
    area: "40 hectares",
    ecosystem: "Salt Marsh",
    status: "Planning",
    communities: 4,
    reports: 5,
    creditsIssued: 200,
    co2Sequestered: 300,
    startDate: "2024-01-10",
    manager: "Dr. Meera Krishnan",
    activities: ["Site Preparation", "Stakeholder Engagement"]
  },
  {
    id: "PS-004",
    name: "Kochi Backwater Restoration",
    location: "Kerala, India",
    coordinates: "9.9312°N, 76.2673°E", 
    area: "25 hectares",
    ecosystem: "Coastal Wetland",
    status: "Monitoring",
    communities: 2,
    reports: 15,
    creditsIssued: 380,
    co2Sequestered: 570,
    startDate: "2023-04-12",
    manager: "Dr. Lakshmi Nair",
    activities: ["Monitoring", "Maintenance", "Data Collection"]
  }
];

export const ProjectSites = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const { toast } = useToast();

  const filteredSites = projectSites.filter(site =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.ecosystem.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalArea = projectSites.reduce((sum, site) => sum + parseInt(site.area), 0);
  const totalCredits = projectSites.reduce((sum, site) => sum + site.creditsIssued, 0);
  const totalCommunities = projectSites.reduce((sum, site) => sum + site.communities, 0);

  const openMapView = (coordinates: string) => {
    toast({
      title: "Map View",
      description: `Opening map view for coordinates: ${coordinates}`,
    });
  };

  const addNewSite = () => {
    toast({
      title: "Add New Site",
      description: "New project site creation form would open here.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Project Sites</h1>
        <Button onClick={addNewSite} variant="ocean" className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Site
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">{projectSites.length}</div>
                <div className="text-sm text-muted-foreground">Active Sites</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">{totalArea}</div>
                <div className="text-sm text-muted-foreground">Total Hectares</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">{totalCommunities}</div>
                <div className="text-sm text-muted-foreground">Communities</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-ocean-gradient" />
              <div>
                <div className="text-2xl font-bold text-foreground">{totalCredits.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Credits Issued</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="map" className="space-y-4">
        <TabsList>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="list">Site Directory</TabsTrigger>
          <TabsTrigger value="analytics">Site Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Project Sites Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-300">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-blue-800">Interactive Map</h3>
                  <p className="text-blue-600">Project sites visualization with coordinates and status indicators</p>
                  <Button variant="outline" className="mt-4" onClick={() => openMapView("All Sites")}>
                    View Full Map
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sites by name, location, or ecosystem..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredSites.map((site) => (
              <Card key={site.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {site.name}
                        <Badge variant={
                          site.status === 'Active' ? 'default' :
                          site.status === 'Planning' ? 'secondary' : 'outline'
                        }>
                          {site.status}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{site.location}</p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedSite(site)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>{site.name} - Site Details</DialogTitle>
                        </DialogHeader>
                        {selectedSite && (
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold mb-2">Site Information</h3>
                                <div className="space-y-2 text-sm">
                                  <p><strong>Location:</strong> {selectedSite.location}</p>
                                  <p><strong>Coordinates:</strong> {selectedSite.coordinates}</p>
                                  <p><strong>Area:</strong> {selectedSite.area}</p>
                                  <p><strong>Ecosystem:</strong> {selectedSite.ecosystem}</p>
                                  <p><strong>Start Date:</strong> {selectedSite.startDate}</p>
                                  <p><strong>Manager:</strong> {selectedSite.manager}</p>
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="font-semibold mb-2">Activities</h3>
                                <div className="flex flex-wrap gap-2">
                                  {selectedSite.activities.map((activity: string, index: number) => (
                                    <Badge key={index} variant="outline">{activity}</Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold mb-2">Impact Metrics</h3>
                                <div className="space-y-3">
                                  <div className="flex justify-between">
                                    <span>Communities Involved:</span>
                                    <span className="font-medium">{selectedSite.communities}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Reports Submitted:</span>
                                    <span className="font-medium">{selectedSite.reports}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Credits Issued:</span>
                                    <span className="font-medium text-green-600">{selectedSite.creditsIssued}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>CO₂ Sequestered:</span>
                                    <span className="font-medium text-blue-600">{selectedSite.co2Sequestered} tonnes</span>
                                  </div>
                                </div>
                              </div>
                              
                              <Button 
                                variant="ocean" 
                                className="w-full"
                                onClick={() => openMapView(selectedSite.coordinates)}
                              >
                                <MapPin className="h-4 w-4 mr-2" />
                                View on Map
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Ecosystem:</span>
                      <p className="font-medium">{site.ecosystem}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Area:</span>
                      <p className="font-medium">{site.area}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Communities:</span>
                      <p className="font-medium">{site.communities}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">CO₂ Sequestered:</span>
                      <p className="font-medium text-green-600">{site.co2Sequestered} tonnes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Site performance charts and metrics will be displayed here.
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Ecosystem Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Ecosystem type distribution and biodiversity metrics will appear here.
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};