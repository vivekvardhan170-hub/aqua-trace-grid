import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, ExternalLink, Activity, Clock, CheckCircle, Hash, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const blockchainData = {
  network: "Polygon Mumbai Testnet",
  contractAddress: "0x742d35C6C6F026Ce7C13F9a1E6b6c3c15e8b5fF",
  totalTransactions: 47,
  gasUsed: "2.45 MATIC",
  registryEntries: 35,
  tokensIssued: 1350
};

const recentTransactions = [
  {
    id: "TX-001",
    hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
    type: "Registry Entry",
    project: "Sundarbans Mangrove Restoration", 
    timestamp: "2024-01-25 14:30:25",
    status: "Confirmed",
    gasUsed: "0.0021 MATIC",
    blockNumber: 42847593,
    creditAmount: 150
  },
  {
    id: "TX-002", 
    hash: "0x2b3c4d5e6f7890abcdef1234567890abcdef123",
    type: "Token Mint",
    project: "Chilika Lake Seagrass Conservation",
    timestamp: "2024-01-24 16:45:12",
    status: "Confirmed", 
    gasUsed: "0.0018 MATIC",
    blockNumber: 42835721,
    creditAmount: 120
  },
  {
    id: "TX-003",
    hash: "0x3c4d5e6f7890abcdef1234567890abcdef1234ab",
    type: "Registry Entry",
    project: "Pulicat Lagoon Salt Marsh Recovery",
    timestamp: "2024-01-24 11:20:08",
    status: "Pending",
    gasUsed: "0.0023 MATIC",
    blockNumber: null,
    creditAmount: 200
  }
];

const smartContracts = [
  {
    name: "Blue Carbon Registry",
    address: "0x742d35C6C6F026Ce7C13F9a1E6b6c3c15e8b5fF",
    type: "Registry",
    deployedAt: "2023-06-01",
    version: "v1.2.0",
    status: "Active",
    interactions: 35
  },
  {
    name: "Carbon Credit Token",
    address: "0x853e46C7D7F126Cf7C24F9a2E7c7d4e16f9c6eE",
    type: "ERC-721",
    deployedAt: "2023-06-01", 
    version: "v1.1.0",
    status: "Active",
    interactions: 12
  }
];

export const Blockchain = () => {
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [newRegistryData, setNewRegistryData] = useState("");
  const { toast } = useToast();

  const viewOnExplorer = (hash: string) => {
    toast({
      title: "Blockchain Explorer",
      description: `Opening transaction ${hash} in Polygon Explorer.`,
    });
  };

  const submitToBlockchain = () => {
    toast({
      title: "Blockchain Submission",
      description: "New registry entry submitted to blockchain. Transaction pending confirmation.",
    });
    setNewRegistryData("");
  };

  const interactWithContract = (contractName: string) => {
    toast({
      title: "Smart Contract Interaction",
      description: `Initiating interaction with ${contractName} contract.`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Blockchain Registry</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ocean" className="gap-2">
              <Zap className="h-4 w-4" />
              Submit to Blockchain
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Registry Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="project-select">Select Project</Label>
                <Select>
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
                <Label htmlFor="data">Registry Data Hash</Label>
                <Input
                  id="data"
                  placeholder="Enter IPFS hash or metadata"
                  value={newRegistryData}
                  onChange={(e) => setNewRegistryData(e.target.value)}
                />
              </div>
              
              <Button onClick={submitToBlockchain} className="w-full" variant="ocean">
                Submit to Blockchain
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Link className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">{blockchainData.totalTransactions}</div>
                <div className="text-sm text-muted-foreground">Total Transactions</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">{blockchainData.registryEntries}</div>
                <div className="text-sm text-muted-foreground">Registry Entries</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Hash className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">{blockchainData.tokensIssued.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Tokens Issued</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">{blockchainData.gasUsed}</div>
                <div className="text-sm text-muted-foreground">Total Gas Used</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Network Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Network:</span>
              <p className="font-medium">{blockchainData.network}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Registry Contract:</span>
              <p className="font-medium font-mono text-xs">{blockchainData.contractAddress}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3"
            onClick={() => viewOnExplorer(blockchainData.contractAddress)}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Polygon Explorer
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="contracts">Smart Contracts</TabsTrigger>
          <TabsTrigger value="registry">Registry Explorer</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          {recentTransactions.map((tx) => (
            <Card key={tx.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {tx.id}
                      <Badge variant={tx.status === 'Confirmed' ? 'default' : 'secondary'}>
                        {tx.status === 'Confirmed' ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {tx.status}
                      </Badge>
                      <Badge variant="outline">{tx.type}</Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{tx.project}</p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedTx(tx)}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Transaction Details - {tx.id}</DialogTitle>
                      </DialogHeader>
                      {selectedTx && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Transaction Hash</Label>
                              <p className="font-mono text-xs bg-muted p-2 rounded break-all">{selectedTx.hash}</p>
                            </div>
                            <div>
                              <Label>Block Number</Label>
                              <p className="font-medium">{selectedTx.blockNumber || "Pending"}</p>
                            </div>
                            <div>
                              <Label>Type</Label>
                              <p className="font-medium">{selectedTx.type}</p>
                            </div>
                            <div>
                              <Label>Credits</Label>
                              <p className="font-medium text-green-600">{selectedTx.creditAmount} tonnes</p>
                            </div>
                            <div>
                              <Label>Gas Used</Label>
                              <p className="font-medium">{selectedTx.gasUsed}</p>
                            </div>
                            <div>
                              <Label>Timestamp</Label>
                              <p className="font-medium">{selectedTx.timestamp}</p>
                            </div>
                          </div>
                          
                          <Button 
                            variant="ocean" 
                            className="w-full"
                            onClick={() => viewOnExplorer(selectedTx.hash)}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View on Blockchain Explorer
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Hash:</span>
                    <p className="font-mono text-xs">{tx.hash.substring(0, 12)}...</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Timestamp:</span>
                    <p className="font-medium">{tx.timestamp}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Gas Used:</span>
                    <p className="font-medium">{tx.gasUsed}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Credits:</span>
                    <p className="font-medium text-green-600">{tx.creditAmount} tonnes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          {smartContracts.map((contract, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {contract.name}
                      <Badge variant="default">{contract.status}</Badge>
                      <Badge variant="outline">{contract.type}</Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground font-mono">{contract.address}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => interactWithContract(contract.name)}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Interact
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Version:</span>
                    <p className="font-medium">{contract.version}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Deployed:</span>
                    <p className="font-medium">{contract.deployedAt}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Interactions:</span>
                    <p className="font-medium">{contract.interactions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="registry">
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Registry Explorer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Interactive blockchain registry explorer with search and filtering capabilities will appear here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Comprehensive audit logs and immutable history tracking will be displayed here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};