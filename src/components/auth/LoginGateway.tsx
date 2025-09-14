import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SignIn, useAuth } from "@clerk/clerk-react";
import { Shield, Users, Building, Waves } from "lucide-react";

export const LoginGateway = () => {
  const [selectedRole, setSelectedRole] = useState<'ngo' | 'nccr' | null>(null);
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return null; // User is already authenticated
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-ocean-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Waves className="h-12 w-12 text-ocean-600" />
            <h1 className="text-4xl font-bold text-ocean-900">Blue Carbon Platform</h1>
          </div>
          <p className="text-lg text-ocean-700">Blockchain-based Blue Carbon Restoration Registry</p>
        </div>

        {!selectedRole ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2 hover:border-ocean-300"
              onClick={() => setSelectedRole('ngo')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-fit">
                  <Users className="h-12 w-12 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-ocean-900">NGO / Community</CardTitle>
                <Badge variant="secondary" className="mx-auto w-fit">Field Data Collection</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Submit restoration activity reports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Upload field data and photos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Track carbon credit status</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Community engagement tools</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2 hover:border-ocean-300"
              onClick={() => setSelectedRole('nccr')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
                  <Shield className="h-12 w-12 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-ocean-900">NCCR Admin</CardTitle>
                <Badge variant="secondary" className="mx-auto w-fit">Verification & Management</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Verify restoration activities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Issue carbon credits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Manage blockchain registry</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Analytics and reporting</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-ocean-100 rounded-full w-fit">
                {selectedRole === 'ngo' ? (
                  <Users className="h-8 w-8 text-ocean-600" />
                ) : (
                  <Shield className="h-8 w-8 text-ocean-600" />
                )}
              </div>
              <CardTitle className="text-xl">
                {selectedRole === 'ngo' ? 'NGO / Community Login' : 'NCCR Admin Login'}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Sign in to access the {selectedRole === 'ngo' ? 'field data collection' : 'verification and management'} portal
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <SignIn 
                  routing="path"
                  path="/sign-in"
                  redirectUrl="/"
                  appearance={{
                    elements: {
                      rootBox: "mx-auto",
                      card: "shadow-none border-0",
                    }
                  }}
                />
                <Button 
                  variant="ghost" 
                  className="w-full" 
                  onClick={() => setSelectedRole(null)}
                >
                  ← Back to role selection
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};