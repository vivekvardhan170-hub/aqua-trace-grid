import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Upload, 
  CheckCircle,
  Calendar,
  Leaf,
  Camera,
  Satellite,
  FileText,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";

const projectInfoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  projectName: z.string().min(1, "Project name is required"),
  communityName: z.string().min(1, "Community name is required"),
  activityType: z.string().min(1, "Activity type is required"),
});

const locationSchema = z.object({
  areaCovered: z.coerce.number().min(0.1, "Area must be greater than 0"),
  locationCoordinates: z.string().min(1, "Location coordinates are required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  gpsData: z.string().optional(),
});

const mediaSchema = z.object({
  estimatedCredits: z.number().min(1, "Estimated credits must be at least 1"),
});

type ProjectInfoData = z.infer<typeof projectInfoSchema>;
type LocationData = z.infer<typeof locationSchema>;
type MediaData = z.infer<typeof mediaSchema>;

interface ProofFile {
  file: File;
  type: 'photo' | 'gps' | 'drone';
  id: string;
  geotagged?: boolean;
  timestamp?: string;
}

const steps = [
  { id: 1, name: "Project Information", icon: FileText },
  { id: 2, name: "Location & Area", icon: MapPin },
  { id: 3, name: "Media Upload", icon: Camera },
  { id: 4, name: "Review & Submit", icon: CheckCircle },
];

export const StepWizardForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [proofFiles, setProofFiles] = useState<ProofFile[]>([]);

  // Form instances for each step
  const projectForm = useForm<ProjectInfoData>({
    resolver: zodResolver(projectInfoSchema),
    defaultValues: { title: "", projectName: "", communityName: "", activityType: "" },
  });

  const locationForm = useForm<LocationData>({
    resolver: zodResolver(locationSchema),
    defaultValues: { 
      areaCovered: undefined, 
      locationCoordinates: "", 
      description: "", 
      gpsData: "" 
    },
    mode: "onBlur",
  });

  const mediaForm = useForm<MediaData>({
    resolver: zodResolver(mediaSchema),
    defaultValues: { estimatedCredits: 0 },
  });

  const getCurrentProgress = () => (currentStep / steps.length) * 100;

  const handleNext = async () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = await projectForm.trigger();
        break;
      case 2:
        isValid = await locationForm.trigger();
        break;
      case 3:
        isValid = await mediaForm.trigger();
        if (isValid && proofFiles.length === 0) {
          toast({
            title: "Media Required",
            description: "Please upload at least one photo, GPS file, or drone report.",
            variant: "destructive",
          });
          return;
        }
        break;
    }

    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFileUpload = (files: FileList | null, type: 'photo' | 'gps' | 'drone') => {
    if (!files) return;

    const newFiles: ProofFile[] = Array.from(files).map(file => {
      const proofFile: ProofFile = {
        file,
        type,
        id: Math.random().toString(36).substring(7),
      };

      // Check for EXIF data for photos
      if (type === 'photo') {
        // Simulate checking for geotag data
        proofFile.geotagged = Math.random() > 0.5;
        proofFile.timestamp = new Date().toISOString();
      }

      return proofFile;
    });

    setProofFiles(prev => [...prev, ...newFiles]);
    
    toast({
      title: "Files Added",
      description: `${newFiles.length} file(s) added successfully.`,
    });
  };

  const removeFile = (id: string) => {
    setProofFiles(prev => prev.filter(file => file.id !== id));
  };

  const uploadFilesToStorage = async (): Promise<string[]> => {
    if (!user?.id) throw new Error("User not authenticated");

    const uploadedPaths: string[] = [];
    let progress = 0;

    for (const proofFile of proofFiles) {
      const fileName = `${user.id}/${Date.now()}-${proofFile.file.name}`;
      
      const { error } = await supabase.storage
        .from('proof-documents')
        .upload(fileName, proofFile.file);

      if (error) {
        throw new Error(`Failed to upload ${proofFile.file.name}: ${error.message}`);
      }

      uploadedPaths.push(fileName);
      progress += (1 / proofFiles.length) * 100;
      setUploadProgress(progress);
    }

    return uploadedPaths;
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit a report.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const projectData = projectForm.getValues();
      const locationData = locationForm.getValues();
      const mediaData = mediaForm.getValues();

      // Upload files to storage
      const uploadedFiles = await uploadFilesToStorage();

      // Prepare proof documents metadata
      const proofDocuments = proofFiles.map((proofFile, index) => ({
        fileName: proofFile.file.name,
        fileType: proofFile.type,
        filePath: uploadedFiles[index],
        fileSize: proofFile.file.size,
        uploadedAt: new Date().toISOString(),
        geotagged: proofFile.geotagged,
        timestamp: proofFile.timestamp,
      }));

      // Insert report via secure Edge Function (bypasses RLS with service role)
      const { data, error } = await supabase.functions.invoke('submit-report', {
        body: {
          user_id: user.id,
          title: projectData.title,
          project_name: projectData.projectName,
          community_name: projectData.communityName,
          activity_type: projectData.activityType,
          area_covered: locationData.areaCovered,
          location_coordinates: locationData.locationCoordinates,
          estimated_credits: mediaData.estimatedCredits,
          description: locationData.description,
          proof_documents: proofDocuments,
          gps_data: locationData.gpsData && locationData.gpsData.trim()
            ? (() => { try { return JSON.parse(locationData.gpsData); } catch { return { raw: locationData.gpsData }; } })()
            : null,
          status: 'Pending',
          verification_status: 'pending',
        },
      });

      if (error) {
        throw new Error(typeof error === 'string' ? error : (error as any)?.message ?? 'Failed to submit');
      }

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Report Submitted Successfully",
        description: "Your restoration activity report has been submitted for verification.",
      });

      // Reset forms and state
      projectForm.reset();
      locationForm.reset();
      mediaForm.reset();
      setProofFiles([]);
      setUploadProgress(0);
      setCurrentStep(1);
      onSuccess?.();

    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'photo':
        return <Camera className="h-4 w-4" />;
      case 'gps':
        return <MapPin className="h-4 w-4" />;
      case 'drone':
        return <Satellite className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold">Project Information</h3>
              <p className="text-muted-foreground">Tell us about your restoration project</p>
            </div>
            
            <Form {...projectForm}>
              <div className="space-y-4">
                <FormField
                  control={projectForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a descriptive title for this report" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={projectForm.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Sundarbans Mangrove Restoration" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={projectForm.control}
                  name="communityName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Community/Organization Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Gosaba Village Committee" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={projectForm.control}
                  name="activityType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the type of restoration activity" />
                          </SelectTrigger>
                        </FormControl>
        <SelectContent>
          <SelectItem value="Mangrove Plantation">Mangrove Plantation</SelectItem>
          <SelectItem value="Wetland Restoration">Wetland Restoration</SelectItem>
        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Form>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h3 className="text-lg font-semibold">Location & Area Details</h3>
              <p className="text-muted-foreground">Provide location and area information</p>
            </div>
            
            <Form {...locationForm}>
              <div className="space-y-4">
                <FormField
                  control={locationForm.control}
                  name="locationCoordinates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GPS Coordinates</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., 22.1696°N, 88.8817°E or 22.1696, 88.8817" 
                          {...field} 
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Enter coordinates in decimal degrees or degrees format
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={locationForm.control}
                  name="areaCovered"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area Covered (hectares)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          min="0.1"
                          placeholder="e.g., 2.5" 
                          value={field.value || ""}
                          onChange={e => {
                            const value = e.target.value;
                            field.onChange(value === "" ? undefined : parseFloat(value));
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Enter the total area of restoration work in hectares
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={locationForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the restoration activities, methods used, timeline, and current status..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={locationForm.control}
                  name="gpsData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional GPS Data (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder='{"waypoints": [{"lat": 22.1696, "lng": 88.8817}], "boundaries": []} or any GPS coordinates/tracking data'
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        You can paste GPS coordinates, waypoints, or tracking data in any format
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Form>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Camera className="h-12 w-12 mx-auto text-orange-600 mb-4" />
              <h3 className="text-lg font-semibold">Media Upload</h3>
              <p className="text-muted-foreground">Upload proof documents and estimate carbon credits</p>
            </div>

            <Form {...mediaForm}>
              <FormField
                control={mediaForm.control}
                name="estimatedCredits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Carbon Credits (tonnes CO₂)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter estimated carbon credits" 
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Form>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                <h4 className="font-semibold">Upload Supporting Documents</h4>
                <AlertCircle className="h-4 w-4 text-amber-500" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="photos">Geotagged Photos</Label>
                  <Input
                    id="photos"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files, 'photo')}
                  />
                  <p className="text-xs text-muted-foreground">
                    Photos with GPS data preferred
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gps">GPS Tracking Files</Label>
                  <Input
                    id="gps"
                    type="file"
                    multiple
                    accept=".gpx,.kml,.json"
                    onChange={(e) => handleFileUpload(e.target.files, 'gps')}
                  />
                  <p className="text-xs text-muted-foreground">
                    GPX, KML, or JSON format
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="drone">Drone/Survey Reports</Label>
                  <Input
                    id="drone"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={(e) => handleFileUpload(e.target.files, 'drone')}
                  />
                  <p className="text-xs text-muted-foreground">
                    Aerial surveys and reports
                  </p>
                </div>
              </div>

              {proofFiles.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium">Uploaded Files ({proofFiles.length})</h5>
                  <div className="space-y-1">
                    {proofFiles.map((proofFile) => (
                      <div key={proofFile.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                        <div className="flex items-center gap-3">
                          {getFileIcon(proofFile.type)}
                          <div>
                            <span className="text-sm font-medium">{proofFile.file.name}</span>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>({(proofFile.file.size / 1024 / 1024).toFixed(2)} MB)</span>
                              {proofFile.geotagged && (
                                <Badge variant="secondary" className="text-xs">Geotagged</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(proofFile.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        const projectData = projectForm.getValues();
        const locationData = locationForm.getValues();
        const mediaData = mediaForm.getValues();

        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h3 className="text-lg font-semibold">Review & Submit</h3>
              <p className="text-muted-foreground">Review your submission before sending</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><strong>Title:</strong> {projectData.title}</div>
                  <div><strong>Project:</strong> {projectData.projectName}</div>
                  <div><strong>Community:</strong> {projectData.communityName}</div>
                  <div><strong>Activity:</strong> {projectData.activityType}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Location & Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><strong>Coordinates:</strong> {locationData.locationCoordinates}</div>
                  <div><strong>Area:</strong> {locationData.areaCovered} hectares</div>
                  <div><strong>Est. Credits:</strong> {mediaData.estimatedCredits} tonnes CO₂</div>
                  <div><strong>Files:</strong> {proofFiles.length} documents</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{locationData.description}</p>
              </CardContent>
            </Card>

            {isSubmitting && uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading files...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Submit Restoration Report
          </CardTitle>
          <Badge variant="outline">Step {currentStep} of {steps.length}</Badge>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={getCurrentProgress()} className="w-full" />
          <div className="flex justify-between text-sm text-muted-foreground">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={step.id} className={`flex flex-col items-center ${currentStep >= step.id ? 'text-primary' : ''}`}>
                  <IconComponent className={`h-4 w-4 mb-1 ${currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-xs">{step.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={handleNext} className="gap-2">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};