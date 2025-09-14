import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Search, Clock, CheckCircle, AlertCircle, Copy, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const blockchainData = {
  transactions: [
    {
      hash: "0x4d5e6f1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
      type: "Credit Issuance",
      project: "Sundarbans Mangrove Restoration",
      amount: 150,
      timestamp: "2024-01-20T10:30:00Z",
      status: "Confirmed",
      blockNumber: 18456789,
      gasUsed: 84521,
      tokenId: "0x1a2b3c4d5e6f7g8h9i0j",
      from: "0xNccr_Admin_Wallet...",
      to: "0xCommunity_Wallet..."
    },
    {
      hash: "0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
      type: "Registry Update",
      project: "Chilika Lake Seagrass Conservation",
      amount: 120,
      timestamp: "2024-01-22T14:15:00Z",
      status: "Confirmed",
      blockNumber: 18457012,
      gasUsed: 67834,
      tokenId: "0x2b3c4d5e6f7g8h9i0j1k",
      from: "0xNccr_Admin_Wallet...",
      to: "0xRegistry_Contract..."
    },
    {
      hash: "0x6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a",
      type: "Credit Transfer",
      project: "Pulicat Lagoon Salt Marsh Recovery",
      amount: 75,
      timestamp: "2024-01-25T09:45:00Z",
      status: "Pending",
      blockNumber: null,
      gasUsed: null,
      tokenId: "0x3c4d5e6f7g8h9i0j1k2l",
      from: "0xCommunity_Wallet...",
      to: "0xBuyer_Wallet..."
    }
  ],
  contracts: [
    {
      address: "0xBlueCarbon_Registry_Main_Contract_Address",
      name: "Blue Carbon Registry",
      type: "Registry Contract",
      deployedBlock: 18400000,
      totalTransactions: 1247,
      lastActivity: "2024-01-25T15:30:00Z"
    },
    {
      address: "0xCarbon_Credit_Token_ERC721_Contract_Addr",
      name: "Carbon Credit Token",
      type: "ERC-721 Token",
      deployedBlock: 18400001,
      totalTransactions: 890,
      lastActivity: "2024-01-25T14:20:00Z"
    }
  ]
};

interface BlockchainExplorerProps {
  onClose: () => void;
  initialTxHash?: string;
}

export const BlockchainExplorer = ({ onClose, initialTxHash }: BlockchainExplorerProps) => {
  const [searchTerm, setSearchTerm] = useState(initialTxHash || "");
  const [selectedTab, setSelectedTab] = useState("transactions");
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Hash copied successfully",
    });
  };

  const openExternalExplorer = (hash: string) => {
    toast({
      title: "Opening External Explorer",
      description: `Opening ${hash} in Polygon/Ethereum explorer`,
    });
  };

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'text-green-600';
      case 'Pending': return 'text-yellow-600';
      case 'Failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-6xl h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Blockchain Explorer
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="flex gap-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by transaction hash, block number, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Search</Button>
          </div>
        </DialogHeader>

        <div className="flex-1 p-6 overflow-hidden">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="contracts">Smart Contracts</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="mt-4 h-full overflow-y-auto">
              <div className="space-y-4">
                {blockchainData.transactions.map((tx) => (
                  <Card key={tx.hash} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(tx.status)}
                          <div>
                            <CardTitle className="text-lg">{tx.type}</CardTitle>
                            <p className="text-sm text-muted-foreground">{tx.project}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={tx.status === 'Confirmed' ? 'default' : 'secondary'}>
                            {tx.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            {tx.amount} credits
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Transaction Hash:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                              {formatHash(tx.hash)}
                            </code>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => copyToClipboard(tx.hash)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openExternalExplorer(tx.hash)}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Timestamp:</span>
                          <p className="font-medium">{formatDate(tx.timestamp)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Token ID:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                              {formatHash(tx.tokenId)}
                            </code>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => copyToClipboard(tx.tokenId)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Block Number:</span>
                          <p className="font-medium">
                            {tx.blockNumber ? `#${tx.blockNumber.toLocaleString()}` : 'Pending'}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">From:</span>
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {formatHash(tx.from)}
                          </code>
                        </div>
                        <div>
                          <span className="text-muted-foreground">To:</span>
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {formatHash(tx.to)}
                          </code>
                        </div>
                      </div>
                      {tx.gasUsed && (
                        <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                          Gas Used: {tx.gasUsed.toLocaleString()} units
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="contracts" className="mt-4 h-full overflow-y-auto">
              <div className="space-y-4">
                {blockchainData.contracts.map((contract) => (
                  <Card key={contract.address} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{contract.name}</CardTitle>
                          <Badge variant="outline">{contract.type}</Badge>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openExternalExplorer(contract.address)}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Contract
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Contract Address:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                              {formatHash(contract.address)}
                            </code>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => copyToClipboard(contract.address)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Deployed Block:</span>
                          <p className="font-medium">#{contract.deployedBlock.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Transactions:</span>
                          <p className="font-medium">{contract.totalTransactions.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Last Activity:</span>
                          <p className="font-medium">{formatDate(contract.lastActivity)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-4 h-full overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Network Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Transactions:</span>
                        <span className="font-medium">2,137</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Contracts:</span>
                        <span className="font-medium">2</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Credits Issued:</span>
                        <span className="font-medium">1,350</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gas Used (24h):</span>
                        <span className="font-medium">2.4M units</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      Activity chart and transaction volume will be displayed here.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};