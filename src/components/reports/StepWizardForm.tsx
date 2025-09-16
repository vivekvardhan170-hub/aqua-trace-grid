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
  Upload, 
  CheckCircle,
  Leaf,
  Camera,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";

const reportSchema = z.object({
  title: z.string().min(1, "Title is required"),
  activityType: z.string().min(1, "Activity type is required"),
  areaCovered: z.coerce.number().min(0.1, "Area must be greater than 0"),
  locationCoordinates: z.string().min(1, "Location coordinates are required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  estimatedCredits: z.number().min(1, "Estimated credits must be at least 1"),
});

type ReportFormData = z.infer<typeof reportSchema>;

interface ProofFile {
  file: File;
  type: 'photo' | 'gps' | 'drone';
  id: string;
  geotagged?: boolean;
  timestamp?: string;
}

const steps = [
  { id: 1, name: "Basic Information", icon: FileText },
  { id: 2, name: "Upload & Submit", icon: Upload },
];

export const StepWizardForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [proofFiles, setProofFiles] = useState<ProofFile[]>([]);

  // Single form for simplified submission
  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: { 
      title: "", 
      activityType: "", 
      areaCovered: undefined, 
      locationCoordinates: "", 
      description: "", 
      estimatedCredits: 0 
    },
  });

  const getCurrentProgress = () => (currentStep / steps.length) * 100;

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await form.trigger();
      if (isValid) {
        setCurrentStep(2);
      }
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

    if (proofFiles.length === 0) {
      toast({
        title: "Photos Required",
        description: "Please upload at least one photo before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = form.getValues();

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
          title: formData.title,
          project_name: `${formData.activityType} Project`,
          community_name: user.fullName || "Community Organization",
          activity_type: formData.activityType,
          area_covered: formData.areaCovered,
          location_coordinates: formData.locationCoordinates,
          estimated_credits: formData.estimatedCredits,
          description: formData.description,
          proof_documents: proofDocuments,
          gps_data: null,
          status: 'Pending',
          verification_status: 'pending',
        },
      });

      if (error) {
        throw new Error(typeof error === 'string' ? error : (error as any)?.message ?? 'Failed to submit');
      }

      toast({
        title: "Report Submitted Successfully",
        description: "Your restoration activity report has been submitted to NCCR for verification.",
      });

      // Reset forms and state
      form.reset();
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
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <p className="text-muted-foreground">Provide essential details about your restoration activity</p>
            </div>
            
            <Form {...form}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Mangrove Restoration at Site A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="activityType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select activity type" />
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

                <FormField
                  control={form.control}
                  name="locationCoordinates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Coordinates</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 22.1696, 88.8817" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="areaCovered"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area (hectares)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          min="0.1"
                          placeholder="2.5" 
                          value={field.value || ""}
                          onChange={e => {
                            const value = e.target.value;
                            field.onChange(value === "" ? undefined : parseFloat(value));
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of the restoration work done..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimatedCredits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Carbon Credits (tonnes)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="10" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
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
              <Upload className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h3 className="text-lg font-semibold">Upload Photos & Submit</h3>
              <p className="text-muted-foreground">Add proof photos and submit for NCCR verification</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Upload Photos</Label>
                <Input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={(e) => handleFileUpload(e.target.files, 'photo')}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload photos showing your restoration work (required)
                </p>
              </div>
            </div>

            {/* Display uploaded files */}
            {proofFiles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Uploaded Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {proofFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          {getFileIcon(file.type)}
                          <p className="text-sm font-medium">{file.file.name}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {proofFiles.length === 0 && (
              <Card className="border-2 border-dashed border-muted-foreground/25">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground text-center">
                    Please upload at least one photo to document your restoration work
                  </p>
                </CardContent>
              </Card>
            )}

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
              disabled={isSubmitting || proofFiles.length === 0}
              className="gap-2"
            >
              {isSubmitting ? "Submitting..." : "Submit to NCCR"}
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};