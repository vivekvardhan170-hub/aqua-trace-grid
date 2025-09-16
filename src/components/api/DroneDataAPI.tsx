import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Satellite, 
  Upload, 
  Download, 
  Settings, 
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
  Camera,
  FileText,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock drone data processing results
const processingResults = [
  {
    id: "DRONE-001",
    projectName: "Sundarbans Mangrove Restoration",
    processedDate: "2024-01-20",
    area: "2.47 hectares",
    treeCount: 1250,
    canopyCover: "78%",
    healthIndex: "85%",
    status: "Completed",
    images: 45,
    gpsAccuracy: "±0.5m"
  },
  {
    id: "DRONE-002", 
    projectName: "Chilika Seagrass Conservation",
    processedDate: "2024-01-19",
    area: "1.82 hectares",
    seagrassPercent: "65%",
    waterQuality: "Good",
    healthIndex: "72%",
    status: "Processing",
    images: 32,
    gpsAccuracy: "±0.8m"
  }
];

const apiEndpoints = [
  {
    method: "POST",
    endpoint: "/api/drone/upload",
    description: "Upload drone imagery and GPS data for processing",
    parameters: ["images", "gps_coordinates", "flight_metadata"],
    example: `{
  "project_id": "BCR-2024-001",
  "images": ["image1.jpg", "image2.jpg"],
  "gps_coordinates": [
    {"lat": 22.1696, "lng": 88.8817, "altitude": 50}
  ],
  "flight_metadata": {
    "date": "2024-01-20",
    "weather": "Clear",
    "wind_speed": "5 km/h"
  }
}`
  },
  {
    method: "GET",
    endpoint: "/api/drone/process/{id}",
    description: "Get processing status and results for uploaded drone data",
    parameters: ["id"],
    example: `{
  "status": "completed",
  "area_calculated": "2.47 hectares",
  "tree_count": 1250,
  "canopy_coverage": 78,
  "health_index": 85,
  "processing_time": "15 minutes"
}`
  },
  {
    method: "POST",
    endpoint: "/api/drone/analyze",
    description: "Request automated analysis of restoration metrics",
    parameters: ["analysis_type", "comparison_baseline"],
    example: `{
  "analysis_type": "vegetation_growth",
  "comparison_baseline": "2023-12-01",
  "metrics": ["area", "density", "health", "biodiversity"]
}`
  }
];

export const DroneDataAPI = () => {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [testResponse, setTestResponse] = useState("");
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadFile(file);
      toast({
        title: "File Selected",
        description: `${file.name} ready for upload to drone processing API.`,
      });
    }
  };

  const testAPIConnection = () => {
    setTestResponse(`{
  "status": "success",
  "api_version": "1.2.0",
  "available_services": [
    "image_processing",
    "area_calculation", 
    "vegetation_analysis",
    "change_detection"
  ],
  "rate_limits": {
    "uploads_per_hour": 100,
    "processing_queue": 5
  }
}`);
    
    toast({
      title: "API Connection Test",
      description: "Successfully connected to drone data processing API.",
    });
  };

  const simulateProcessing = () => {
    toast({
      title: "Processing Started",
      description: "Drone data processing initiated. Results will be available in 10-15 minutes.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Drone Data Integration</h1>
          <p className="text-muted-foreground">Automated processing and analysis of aerial survey data</p>
        </div>
        <Badge variant="secondary" className="gap-2">
          <Zap className="h-4 w-4" />
          API Active
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="upload">Data Upload</TabsTrigger>
          <TabsTrigger value="api">API Documentation</TabsTrigger>
          <TabsTrigger value="results">Processing Results</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Satellite className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-foreground">24</div>
                    <div className="text-sm text-muted-foreground">Drone Surveys</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Camera className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold text-foreground">1,240</div>
                    <div className="text-sm text-muted-foreground">Images Processed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-8 w-8 text-orange-600" />
                  <div>
                    <div className="text-2xl font-bold text-foreground">47.8</div>
                    <div className="text-sm text-muted-foreground">Hectares Mapped</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold text-foreground">94%</div>
                    <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Automated Analysis Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Vegetation Analysis</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Tree counting and species identification</li>
                    <li>• Canopy coverage calculation</li>
                    <li>• Health index assessment</li>
                    <li>• Growth rate monitoring</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Area Measurement</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Precise area calculation</li>
                    <li>• Boundary detection</li>
                    <li>• Change detection over time</li>
                    <li>• GPS coordinate validation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Upload Tab */}
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Drone Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="drone-images">Drone Images (ZIP)</Label>
                    <Input
                      id="drone-images"
                      type="file"
                      accept=".zip,.rar"
                      onChange={handleFileUpload}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload aerial images in ZIP format (max 500MB)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="flight-metadata">Flight Metadata</Label>
                    <Textarea
                      id="flight-metadata"
                      placeholder='{"date": "2024-01-20", "weather": "Clear", "altitude": "50m"}'
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="project-id">Project ID</Label>
                    <Input
                      id="project-id"
                      placeholder="BCR-2024-001"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="gps-data">GPS Coordinates</Label>
                    <Textarea
                      id="gps-data"
                      placeholder='[{"lat": 22.1696, "lng": 88.8817, "alt": 50}]'
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="analysis-type">Analysis Type</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option>Vegetation Assessment</option>
                      <option>Area Calculation</option>
                      <option>Change Detection</option>
                      <option>Biodiversity Analysis</option>
                    </select>
                  </div>

                  <Button onClick={simulateProcessing} className="w-full gap-2">
                    <Upload className="h-4 w-4" />
                    Start Processing
                  </Button>
                </div>
              </div>

              {uploadFile && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Ready to Upload:</span>
                    <span>{uploadFile.name}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Documentation Tab */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your drone API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <Button onClick={testAPIConnection} variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Test Connection
              </Button>
              {testResponse && (
                <div className="p-4 bg-gray-50 border rounded-md">
                  <pre className="text-xs overflow-x-auto">{testResponse}</pre>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            {apiEndpoints.map((endpoint, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant={endpoint.method === 'POST' ? 'default' : 'secondary'}>
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm">{endpoint.endpoint}</code>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                  <div>
                    <h5 className="font-medium mb-2">Parameters:</h5>
                    <div className="flex gap-2 flex-wrap">
                      {endpoint.parameters.map((param) => (
                        <Badge key={param} variant="outline">{param}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Example:</h5>
                    <pre className="text-xs bg-gray-50 p-3 rounded border overflow-x-auto">
                      {endpoint.example}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Processing Results Tab */}
        <TabsContent value="results" className="space-y-4">
          <div className="space-y-4">
            {processingResults.map((result) => (
              <Card key={result.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {result.id} - {result.projectName}
                      <Badge variant={result.status === 'Completed' ? 'default' : 'secondary'}>
                        {result.status === 'Completed' ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                        {result.status}
                      </Badge>
                    </CardTitle>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download Results
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Processed:</span>
                      <p className="font-medium">{result.processedDate}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Area:</span>
                      <p className="font-medium">{result.area}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Health Index:</span>
                      <p className="font-medium">{result.healthIndex}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">GPS Accuracy:</span>
                      <p className="font-medium">{result.gpsAccuracy}</p>
                    </div>
                  </div>
                  
                  {result.status === 'Completed' && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        {result.treeCount && (
                          <div>
                            <span className="text-green-700 font-medium">Tree Count:</span>
                            <p>{result.treeCount}</p>
                          </div>
                        )}
                        {result.canopyCover && (
                          <div>
                            <span className="text-green-700 font-medium">Canopy Cover:</span>
                            <p>{result.canopyCover}</p>
                          </div>
                        )}
                        {result.seagrassPercent && (
                          <div>
                            <span className="text-green-700 font-medium">Seagrass Coverage:</span>
                            <p>{result.seagrassPercent}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};