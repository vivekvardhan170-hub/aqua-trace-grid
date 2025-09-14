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
import { 
  Upload, 
  FileImage, 
  MapPin, 
  Trash2, 
  AlertCircle,
  Camera,
  FileText,
  Satellite
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";

const reportSchema = z.object({
  title: z.string().min(1, "Title is required"),
  projectName: z.string().min(1, "Project name is required"),
  communityName: z.string().min(1, "Community name is required"),
  activityType: z.string().min(1, "Activity type is required"),
  areaCovered: z.number().min(0.1, "Area must be greater than 0"),
  locationCoordinates: z.string().min(1, "Location coordinates are required"),
  estimatedCredits: z.number().min(1, "Estimated credits must be at least 1"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  gpsData: z.string().optional(),
});

type ReportFormData = z.infer<typeof reportSchema>;

interface ProofFile {
  file: File;
  type: 'photo' | 'gps' | 'drone';
  id: string;
}

export const ReportSubmissionForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [proofFiles, setProofFiles] = useState<ProofFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      projectName: "",
      communityName: "",
      activityType: "",
      areaCovered: 0,
      locationCoordinates: "",
      estimatedCredits: 0,
      description: "",
      gpsData: "",
    },
  });

  const handleFileUpload = (files: FileList | null, type: 'photo' | 'gps' | 'drone') => {
    if (!files) return;

    const newFiles: ProofFile[] = Array.from(files).map(file => ({
      file,
      type,
      id: Math.random().toString(36).substring(7),
    }));

    setProofFiles(prev => [...prev, ...newFiles]);
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

  const onSubmit = async (data: ReportFormData) => {
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
        title: "Proof Required",
        description: "Please upload at least one proof document (photo, GPS data, or drone report).",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Upload files to storage
      const uploadedFiles = await uploadFilesToStorage();

      // Prepare proof documents metadata
      const proofDocuments = proofFiles.map((proofFile, index) => ({
        fileName: proofFile.file.name,
        fileType: proofFile.type,
        filePath: uploadedFiles[index],
        fileSize: proofFile.file.size,
        uploadedAt: new Date().toISOString(),
      }));

      // Insert report into database
      const { error } = await supabase
        .from('reports')
        .insert({
          user_id: user.id,
          title: data.title,
          project_name: data.projectName,
          community_name: data.communityName,
          activity_type: data.activityType,
          area_covered: data.areaCovered,
          location_coordinates: data.locationCoordinates,
          estimated_credits: data.estimatedCredits,
          description: data.description,
          proof_documents: proofDocuments,
          gps_data: data.gpsData ? JSON.parse(data.gpsData) : null,
          status: 'Pending',
        });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Report Submitted Successfully",
        description: "Your restoration activity report has been submitted for verification.",
      });

      // Reset form
      form.reset();
      setProofFiles([]);
      setUploadProgress(0);
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

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Submit Restoration Activity Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Report Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter report title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="communityName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Community Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter community name" {...field} />
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
                        <SelectItem value="Seagrass Restoration">Seagrass Restoration</SelectItem>
                        <SelectItem value="Salt Marsh Restoration">Salt Marsh Restoration</SelectItem>
                        <SelectItem value="Wetland Monitoring">Wetland Monitoring</SelectItem>
                        <SelectItem value="Community Training">Community Training</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="areaCovered"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area Covered (hectares)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1" 
                        placeholder="0.0" 
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
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
                      <Input placeholder="e.g., 22.1696°N, 88.8817°E" {...field} />
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
                    <FormLabel>Estimated Carbon Credits</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gpsData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GPS Data (JSON format - optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder='{"latitude": 22.1696, "longitude": 88.8817}'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide detailed description of the restoration activities..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Proof Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Upload Proof Documents</h3>
                <AlertCircle className="h-4 w-4 text-amber-500" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="photos">Photos</Label>
                  <Input
                    id="photos"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files, 'photo')}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload photos of restoration activities
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gps">GPS Data Files</Label>
                  <Input
                    id="gps"
                    type="file"
                    multiple
                    accept=".gpx,.kml,.json"
                    onChange={(e) => handleFileUpload(e.target.files, 'gps')}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload GPS tracking files
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="drone">Drone Reports</Label>
                  <Input
                    id="drone"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={(e) => handleFileUpload(e.target.files, 'drone')}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload drone surveys/reports
                  </p>
                </div>
              </div>

              {/* Uploaded Files List */}
              {proofFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Uploaded Files ({proofFiles.length})</h4>
                  <div className="space-y-1">
                    {proofFiles.map((proofFile) => (
                      <div key={proofFile.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <div className="flex items-center gap-2">
                          {getFileIcon(proofFile.type)}
                          <span className="text-sm">{proofFile.file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(proofFile.file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(proofFile.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {isSubmitting && uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading files...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setProofFiles([]);
                }}
              >
                Reset Form
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};