import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Navigation, ZoomIn, ZoomOut, Layers, X } from "lucide-react";

const projectSites = [
  {
    id: "PS-001",
    name: "Sundarbans Mangrove Restoration",
    coordinates: [22.1696, 88.8817],
    status: "Active",
    ecosystem: "Mangrove Forest",
    area: "50 hectares",
    creditsIssued: 450
  },
  {
    id: "PS-002", 
    name: "Chilika Lake Seagrass Conservation",
    coordinates: [19.7179, 85.4456],
    status: "Active",
    ecosystem: "Seagrass Beds",
    area: "30 hectares",
    creditsIssued: 320
  },
  {
    id: "PS-003",
    name: "Pulicat Lagoon Salt Marsh Recovery",
    coordinates: [13.6288, 80.3492],
    status: "Planning",
    ecosystem: "Salt Marsh",
    area: "40 hectares",
    creditsIssued: 200
  },
  {
    id: "PS-004",
    name: "Kochi Backwater Restoration",
    coordinates: [9.9312, 76.2673],
    status: "Monitoring",
    ecosystem: "Coastal Wetland",
    area: "25 hectares",
    creditsIssued: 380
  }
];

interface InteractiveMapProps {
  onClose: () => void;
}

export const InteractiveMap = ({ onClose }: InteractiveMapProps) => {
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState([20.0, 78.0]); // India center
  const [zoomLevel, setZoomLevel] = useState(5);
  const [showLayers, setShowLayers] = useState(true);

  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 1, 10));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 1, 1));

  const focusOnSite = (site: any) => {
    setMapCenter(site.coordinates);
    setZoomLevel(8);
    setSelectedSite(site);
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-6xl h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Interactive Project Sites Map
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex h-full">
          {/* Map Area */}
          <div className="flex-1 relative bg-gradient-to-br from-blue-50 to-green-50 m-6 rounded-lg border">
            {/* Map Controls */}
            <div className="absolute top-4 right-4 z-10 space-y-2">
              <Button variant="outline" size="sm" onClick={zoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={zoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowLayers(!showLayers)}>
                <Layers className="h-4 w-4" />
              </Button>
            </div>

            {/* Map Legend */}
            {showLayers && (
              <div className="absolute top-4 left-4 z-10 bg-white p-3 rounded-lg shadow-md">
                <h4 className="font-semibold text-sm mb-2">Map Legend</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Active Projects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Planning Phase</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Monitoring</span>
                  </div>
                </div>
              </div>
            )}

            {/* Simulated Map with Markers */}
            <div className="absolute inset-4 bg-gradient-to-br from-blue-100 to-green-100 rounded border-2 border-dashed border-blue-300 overflow-hidden">
              <div className="relative w-full h-full">
                {/* Coastline simulation */}
                <div className="absolute inset-0 opacity-30">
                  <svg className="w-full h-full" viewBox="0 0 800 600">
                    <path 
                      d="M0,300 Q200,250 400,300 T800,280" 
                      stroke="#3b82f6" 
                      strokeWidth="3" 
                      fill="none"
                    />
                    <path 
                      d="M0,320 Q250,270 500,320 T800,300" 
                      stroke="#06b6d4" 
                      strokeWidth="2" 
                      fill="none"
                    />
                  </svg>
                </div>

                {/* Project Site Markers */}
                {projectSites.map((site, index) => (
                  <div
                    key={site.id}
                    className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 ${
                      selectedSite?.id === site.id ? 'z-20 scale-125' : 'z-10'
                    }`}
                    style={{
                      left: `${20 + (index * 20)}%`,
                      top: `${30 + (index * 15)}%`
                    }}
                    onClick={() => focusOnSite(site)}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                      site.status === 'Active' ? 'bg-green-500' :
                      site.status === 'Planning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap">
                      {site.name}
                    </div>
                  </div>
                ))}

                {/* Center indicator */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Navigation className="h-6 w-6 text-blue-600 opacity-50" />
                </div>
              </div>
            </div>

            {/* Zoom level indicator */}
            <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded shadow text-sm">
              Zoom: {zoomLevel}x
            </div>
          </div>

          {/* Site Information Panel */}
          <div className="w-80 p-6 bg-gray-50 overflow-y-auto">
            <h3 className="font-semibold mb-4">Project Sites ({projectSites.length})</h3>
            
            {selectedSite && (
              <Card className="mb-4 border-ocean-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Selected Site
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{selectedSite.name}</h4>
                    <Badge variant={
                      selectedSite.status === 'Active' ? 'default' :
                      selectedSite.status === 'Planning' ? 'secondary' : 'outline'
                    }>
                      {selectedSite.status}
                    </Badge>
                    <div className="text-xs space-y-1">
                      <p><strong>Ecosystem:</strong> {selectedSite.ecosystem}</p>
                      <p><strong>Area:</strong> {selectedSite.area}</p>
                      <p><strong>Credits:</strong> {selectedSite.creditsIssued}</p>
                      <p><strong>Coordinates:</strong> {selectedSite.coordinates.join(', ')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              {projectSites.map((site) => (
                <div
                  key={site.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedSite?.id === site.id ? 'bg-ocean-100 border border-ocean-300' : 'bg-white hover:bg-gray-50'
                  }`}
                  onClick={() => focusOnSite(site)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${
                      site.status === 'Active' ? 'bg-green-500' :
                      site.status === 'Planning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <span className="font-medium text-sm">{site.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>{site.ecosystem} • {site.area}</p>
                    <p>{site.creditsIssued} credits issued</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};