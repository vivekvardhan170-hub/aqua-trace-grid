import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Users, MapPin, Award, TrendingUp, Phone, Mail, Eye, MessageCircle, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const communities = [
  {
    id: "CM-001",
    name: "Gosaba Village Committee",
    location: "Sundarbans, West Bengal",
    type: "Village Committee",
    members: 250,
    contact: {
      phone: "+91-9876543210",
      email: "gosaba.committee@gmail.com",
      coordinator: "Ravi Kumar"
    },
    projects: ["Sundarbans Mangrove Restoration"],
    reports: 12,
    creditsEarned: 450,
    co2Impact: 675,
    joinDate: "2023-06-15",
    status: "Active",
    verificationRate: 92,
    engagement: "High"
  },
  {
    id: "CM-002",
    name: "Balugaon Fishermen Association",
    location: "Chilika Lake, Odisha", 
    type: "Fishermen Association",
    members: 180,
    contact: {
      phone: "+91-9876543211",
      email: "balugaon.fishermen@yahoo.com",
      coordinator: "Priya Patel"
    },
    projects: ["Chilika Lake Seagrass Conservation"],
    reports: 8,
    creditsEarned: 320,
    co2Impact: 480,
    joinDate: "2023-08-20",
    status: "Active",
    verificationRate: 88,
    engagement: "High"
  },
  {
    id: "CM-003",
    name: "Sullurpeta Coastal Group",
    location: "Pulicat Lagoon, Andhra Pradesh",
    type: "NGO",
    members: 120,
    contact: {
      phone: "+91-9876543212", 
      email: "sullurpeta.coastal@gmail.com",
      coordinator: "Anjali Singh"
    },
    projects: ["Pulicat Lagoon Salt Marsh Recovery"],
    reports: 5,
    creditsEarned: 200,
    co2Impact: 300,
    joinDate: "2024-01-10",
    status: "Active",
    verificationRate: 100,
    engagement: "Medium"
  },
  {
    id: "CM-004",
    name: "Kochi Backwater Collective",
    location: "Kerala Backwaters, Kerala",
    type: "Community Collective",
    members: 95,
    contact: {
      phone: "+91-9876543213",
      email: "kochi.collective@outlook.com", 
      coordinator: "Dr. Lakshmi Nair"
    },
    projects: ["Kochi Backwater Restoration"],
    reports: 15,
    creditsEarned: 380,
    co2Impact: 570,
    joinDate: "2023-04-12",
    status: "Active",
    verificationRate: 95,
    engagement: "High"
  }
];

export const Communities = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState<any>(null);
  const [messageContent, setMessageContent] = useState("");
  const { toast } = useToast();

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMembers = communities.reduce((sum, community) => sum + community.members, 0);
  const totalCredits = communities.reduce((sum, community) => sum + community.creditsEarned, 0);
  const totalReports = communities.reduce((sum, community) => sum + community.reports, 0);
  const avgVerificationRate = communities.reduce((sum, community) => sum + community.verificationRate, 0) / communities.length;

  const sendMessage = (communityId: string) => {
    toast({
      title: "Message Sent",
      description: `Message sent to ${selectedCommunity?.name} successfully.`,
    });
    setMessageContent("");
  };

  const contactCommunity = (contact: any) => {
    toast({
      title: "Contact Information",
      description: `Opening contact for ${contact.coordinator}: ${contact.phone}`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Communities</h1>
        <Button variant="ocean" className="gap-2">
          <MessageCircle className="h-4 w-4" />
          Broadcast Message
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">{communities.length}</div>
                <div className="text-sm text-muted-foreground">Active Communities</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">{totalMembers.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Members</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">{totalCredits.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Credits Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-ocean-gradient" />
              <div>
                <div className="text-2xl font-bold text-foreground">{avgVerificationRate.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Avg. Verification Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="directory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="directory">Community Directory</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Metrics</TabsTrigger>
          <TabsTrigger value="communication">Communication Hub</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search communities by name, location, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCommunities.map((community) => (
              <Card key={community.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {community.name}
                        <Badge variant={community.engagement === 'High' ? 'default' : 'secondary'}>
                          {community.engagement} Engagement
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{community.location}</p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedCommunity(community)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>{community.name} - Community Profile</DialogTitle>
                        </DialogHeader>
                        {selectedCommunity && (
                          <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-2 space-y-4">
                              <div>
                                <h3 className="font-semibold mb-2">Community Information</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Type:</span>
                                    <p className="font-medium">{selectedCommunity.type}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Members:</span>
                                    <p className="font-medium">{selectedCommunity.members}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Join Date:</span>
                                    <p className="font-medium">{selectedCommunity.joinDate}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Status:</span>
                                    <Badge variant="default">{selectedCommunity.status}</Badge>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="font-semibold mb-2">Contact Information</h3>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    <span>{selectedCommunity.contact.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <span>{selectedCommunity.contact.email}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span>Coordinator: {selectedCommunity.contact.coordinator}</span>
                                  </div>
                                </div>
                                
                                <div className="flex gap-2 mt-3">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => contactCommunity(selectedCommunity.contact)}
                                  >
                                    <Phone className="h-4 w-4 mr-2" />
                                    Call
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => contactCommunity(selectedCommunity.contact)}
                                  >
                                    <Mail className="h-4 w-4 mr-2" />
                                    Email
                                  </Button>
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="font-semibold mb-2">Active Projects</h3>
                                <div className="flex flex-wrap gap-2">
                                  {selectedCommunity.projects.map((project: string, index: number) => (
                                    <Badge key={index} variant="outline">{project}</Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold mb-2">Impact Metrics</h3>
                                <div className="space-y-3">
                                  <div className="flex justify-between">
                                    <span>Reports Submitted:</span>
                                    <span className="font-medium">{selectedCommunity.reports}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Credits Earned:</span>
                                    <span className="font-medium text-green-600">{selectedCommunity.creditsEarned}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>CO₂ Impact:</span>
                                    <span className="font-medium text-blue-600">{selectedCommunity.co2Impact} tonnes</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Verification Rate:</span>
                                    <span className="font-medium">{selectedCommunity.verificationRate}%</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="message">Send Message</Label>
                                <Textarea
                                  id="message"
                                  placeholder="Type your message..."
                                  value={messageContent}
                                  onChange={(e) => setMessageContent(e.target.value)}
                                />
                                <Button 
                                  variant="ocean" 
                                  size="sm"
                                  onClick={() => sendMessage(selectedCommunity.id)}
                                  className="w-full"
                                >
                                  <MessageCircle className="h-4 w-4 mr-2" />
                                  Send Message
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
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <p className="font-medium">{community.type}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Members:</span>
                      <p className="font-medium">{community.members}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Reports:</span>
                      <p className="font-medium">{community.reports}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Verification Rate:</span>
                      <p className="font-medium text-green-600">{community.verificationRate}%</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                    <span>Coordinator: {community.contact.coordinator} | Joined: {community.joinDate}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="engagement">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Community Engagement Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Engagement metrics and participation trends will be displayed here.
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Top performing communities ranking will appear here.
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="communication">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Broadcast Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Message broadcasting interface and history will be shown here.
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Community Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Feedback collection and community responses will appear here.
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};