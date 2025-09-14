import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coins, TrendingUp, Award, ExternalLink, Download, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BlockchainExplorer } from "@/components/blockchain/BlockchainExplorer";

const carbonCredits = [
  {
    id: "CC-2024-001",
    tokenId: "0x1a2b3c...",
    project: "Sundarbans Mangrove Restoration",
    community: "Gosaba Village Committee",
    amount: 150,
    issueDate: "2024-01-20",
    status: "Active",
    blockchainTx: "0x4d5e6f...",
    verifier: "Dr. Anita Sharma",
    price: 25.50,
    category: "Mangrove"
  },
  {
    id: "CC-2024-002",
    tokenId: "0x2b3c4d...",
    project: "Chilika Lake Seagrass Conservation", 
    community: "Balugaon Fishermen Association",
    amount: 120,
    issueDate: "2024-01-22",
    status: "Active",
    blockchainTx: "0x5e6f7g...",
    verifier: "Dr. Raj Patel",
    price: 28.75,
    category: "Seagrass"
  },
  {
    id: "CC-2024-003",
    tokenId: "0x3c4d5e...",
    project: "Pulicat Lagoon Salt Marsh Recovery",
    community: "Sullurpeta Coastal Group",
    amount: 200,
    issueDate: "2024-01-25",
    status: "Pending Transfer",
    blockchainTx: "0x6f7g8h...",
    verifier: "Dr. Meera Krishnan",
    price: 30.25,
    category: "Salt Marsh"
  }
];

export const CarbonCredits = () => {
  const [issuanceAmount, setIssuanceAmount] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const { toast } = useToast();

  const totalCreditsIssued = carbonCredits.reduce((sum, credit) => sum + credit.amount, 0);
  const totalValue = carbonCredits.reduce((sum, credit) => sum + (credit.amount * credit.price), 0);

  const issueNewCredits = () => {
    toast({
      title: "Credits Issued Successfully",
      description: `${issuanceAmount} carbon credits have been minted on the blockchain.`,
    });
    setIssuanceAmount("");
    setSelectedProject("");
  };

  const [showBlockchainExplorer, setShowBlockchainExplorer] = useState(false);
  const [selectedTxHash, setSelectedTxHash] = useState("");

  const viewOnBlockchain = (txHash: string) => {
    setSelectedTxHash(txHash);
    setShowBlockchainExplorer(true);
  };

  const exportCredits = () => {
    // Simulate CSV export
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Token ID,Project,Community,Amount,Issue Date,Status,Price,Total Value\n" +
      carbonCredits.map(credit => 
        `${credit.id},${credit.tokenId},${credit.project},${credit.community},${credit.amount},${credit.issueDate},${credit.status},${credit.price},${(credit.amount * credit.price).toFixed(2)}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `carbon_credits_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: "Carbon credits data has been exported to CSV file.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Carbon Credits</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ocean" className="gap-2">
              <Coins className="h-4 w-4" />
              Issue New Credits
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Issue Carbon Credits</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="project-select">Select Project</Label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a verified project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sundarbans">Sundarbans Mangrove Restoration</SelectItem>
                    <SelectItem value="chilika">Chilika Lake Seagrass Conservation</SelectItem>
                    <SelectItem value="pulicat">Pulicat Lagoon Salt Marsh Recovery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="amount">Credit Amount (tonnes CO₂)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter credit amount"
                  value={issuanceAmount}
                  onChange={(e) => setIssuanceAmount(e.target.value)}
                />
              </div>
              
              <Button onClick={issueNewCredits} className="w-full" variant="ocean">
                Mint Credits on Blockchain
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Coins className="h-8 w-8 text-ocean-gradient" />
              <div>
                <div className="text-2xl font-bold text-foreground">{totalCreditsIssued.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Credits Issued</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">${totalValue.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Market Value</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">3</div>
                <div className="text-sm text-muted-foreground">Active Projects</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Filter className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">$27.83</div>
                <div className="text-sm text-muted-foreground">Avg. Price/Credit</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Credits</TabsTrigger>
          <TabsTrigger value="issuance">Issuance History</TabsTrigger>
          <TabsTrigger value="analytics">Credit Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" onClick={exportCredits}>
              <Download className="h-4 w-4 mr-2" />
              Export Credits
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter by Category
            </Button>
          </div>
          
          {carbonCredits.map((credit) => (
            <Card key={credit.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {credit.id}
                      <Badge variant={credit.status === 'Active' ? 'default' : 'secondary'}>
                        {credit.status}
                      </Badge>
                      <Badge variant="outline">{credit.category}</Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{credit.project}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewOnBlockchain(credit.blockchainTx)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Blockchain
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Amount:</span>
                    <p className="font-medium">{credit.amount} tonnes CO₂</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Community:</span>
                    <p className="font-medium">{credit.community}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Issue Date:</span>
                    <p className="font-medium">{credit.issueDate}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Price/Credit:</span>
                    <p className="font-medium">${credit.price}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Value:</span>
                    <p className="font-medium text-green-600">${(credit.amount * credit.price).toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                  <span>Token ID: {credit.tokenId} | Verified by: {credit.verifier} | Tx: {credit.blockchainTx}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="issuance">
          <Card>
            <CardHeader>
              <CardTitle>Credit Issuance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Detailed issuance history and blockchain transaction logs will appear here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Credit Analytics & Market Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Market analytics, price trends, and trading volume charts will be displayed here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {showBlockchainExplorer && (
        <BlockchainExplorer 
          onClose={() => setShowBlockchainExplorer(false)}
          initialTxHash={selectedTxHash}
        />
      )}
    </div>
  );
};