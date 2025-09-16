import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MapPin, MessageCircle, Calendar, TrendingUp, Award } from "lucide-react";
import { CommunityChat } from "@/components/chat/CommunityChat";

export const Communities = () => {
  const [activeTab, setActiveTab] = useState("directory");

  const communities = [
    {
      id: 1,
      name: "Sundarbans Conservation Alliance",
      location: "West Bengal, India",
      members: 156,
      projects: 12,
      totalArea: 45.6,
      credits: 2340,
      description: "Focused on mangrove restoration and conservation in the Sundarbans delta region.",
      type: "NGO Network"
    },
    {
      id: 2,
      name: "Coastal Restoration Initiative",
      location: "Odisha, India", 
      members: 89,
      projects: 8,
      totalArea: 28.3,
      credits: 1420,
      description: "Community-driven coastal restoration projects along the Bay of Bengal.",
      type: "Community Group"
    },
    {
      id: 3,
      name: "Blue Carbon Research Collective",
      location: "Tamil Nadu, India",
      members: 234,
      projects: 18,
      totalArea: 67.2,
      credits: 3890,
      description: "Research institutions and NGOs collaborating on blue carbon science.",
      type: "Research Network"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community Network</h1>
          <p className="text-muted-foreground">Connect with blue carbon restoration communities</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="directory">Community Directory</TabsTrigger>
          <TabsTrigger value="chat">Community Chat</TabsTrigger>
          <TabsTrigger value="events">Events & Updates</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {communities.map((community) => (
              <Card key={community.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{community.name}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {community.location}
                      </p>
                    </div>
                    <Badge variant="outline">{community.type}</Badge>
                  </div>
                  <p className="text-sm">{community.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-medium">{community.members}</div>
                        <div className="text-xs text-muted-foreground">Members</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="font-medium">{community.projects}</div>
                        <div className="text-xs text-muted-foreground">Projects</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-orange-600" />
                      <div>
                        <div className="font-medium">{community.totalArea} ha</div>
                        <div className="text-xs text-muted-foreground">Total Area</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-purple-600" />
                      <div>
                        <div className="font-medium">{community.credits}</div>
                        <div className="text-xs text-muted-foreground">Credits</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Users className="h-4 w-4 mr-1" />
                      Join
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("chat")}>
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <CommunityChat />
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Events & Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium">Blue Carbon Workshop</h4>
                  <p className="text-sm text-muted-foreground">March 25, 2024 • Online</p>
                  <p className="text-sm">Learn about latest restoration techniques and verification processes.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium">Community Meetup - Kolkata</h4>
                  <p className="text-sm text-muted-foreground">April 10, 2024 • In-person</p>
                  <p className="text-sm">Regional meetup for Sundarbans restoration communities.</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-medium">Funding Opportunity Alert</h4>
                  <p className="text-sm text-muted-foreground">March 20, 2024</p>
                  <p className="text-sm">New grants available for coastal restoration projects up to ₹5 lakhs.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};