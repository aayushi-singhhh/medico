import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Image, X, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

const UploadReport = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
  const [abnormalities, setAbnormalities] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [reportType, setReportType] = useState<string>("");
  const [reportTitle, setReportTitle] = useState<string>("");
  const [reportDate, setReportDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // FastAPI backend URL 
  const API_BASE_URL = "http://localhost:8000";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      // Filter for image files only for medical image analysis
      const imageFiles = selectedFiles.filter(file => 
        file.type.includes('image') || file.type.includes('dicom')
      );
      
      if (imageFiles.length === 0) {
        setError("Please select at least one image file (JPG, PNG, DICOM) for analysis.");
        return;
      }
      
      setFiles(imageFiles);
      setError(null);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const analyzeImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Use the analyze-with-annotation endpoint to get both analysis and annotated image
      const response = await fetch(`${API_BASE_URL}/analyze-with-annotation`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to analyze image');
      }

      const result = await response.json();
      return {
        analysis: result.analysis,
        annotatedImage: result.annotated_image,
        abnormalities: result.abnormalities
      };
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setError("Please select at least one file to upload.");
      return;
    }

    if (!reportType || !reportTitle || !reportDate) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setAnalysisResult(null);
    setAnnotatedImage(null);
    setAbnormalities(null);

    try {
      const imageFile = files.find(file => file.type.includes('image'));
      
      if (!imageFile) {
        throw new Error("No image file found for analysis.");
      }

      console.log("Starting analysis for:", imageFile.name);
      const result = await analyzeImage(imageFile);
      
      setAnalysisResult(result.analysis);
      setAnnotatedImage(result.annotatedImage);
      setAbnormalities(result.abnormalities);
      
      // Here you could also save the report data to your database
      // const reportData = {
      //   reportType,
      //   reportTitle,
      //   reportDate,
      //   notes,
      //   analysis,
      //   fileName: imageFile.name
      // };
      
    } catch (error) {
      console.error('Upload/Analysis failed:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during analysis');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-medical text-white p-6">
        <div className="container mx-auto flex items-center gap-4">
          <Link to="/patient-dashboard">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Upload Medical Report</h1>
            <p className="opacity-90">Add new medical documents for AI analysis</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Upload Your Medical Documents</CardTitle>
              <CardDescription>
                Upload medical reports, test results, or images for AI-powered analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Error Display */}
              {error && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Success Display */}
              {analysisResult && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Analysis completed successfully! Results are shown below.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Report Type */}
                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type *</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blood-test">Blood Test</SelectItem>
                      <SelectItem value="xray">X-Ray</SelectItem>
                      <SelectItem value="mri">MRI Scan</SelectItem>
                      <SelectItem value="ct-scan">CT Scan</SelectItem>
                      <SelectItem value="ecg">ECG</SelectItem>
                      <SelectItem value="ultrasound">Ultrasound</SelectItem>
                      <SelectItem value="pathology">Pathology Report</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Report Title */}
                <div className="space-y-2">
                  <Label htmlFor="report-title">Report Title *</Label>
                  <Input 
                    id="report-title" 
                    placeholder="e.g., Annual Blood Work, Chest X-Ray"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    required 
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="report-date">Date of Test/Examination *</Label>
                  <Input 
                    id="report-date" 
                    type="date"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    required 
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="files">Upload Medical Images *</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Drag and drop medical images here</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      or click to browse files
                    </p>
                    <Input
                      id="files"
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.dicom"
                      onChange={handleFileChange}
                      className="max-w-xs mx-auto"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Supported formats: JPG, PNG, DICOM (Max 10MB per file)
                    </p>
                  </div>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Files</Label>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {file.type.includes('image') ? (
                              <Image className="w-5 h-5 text-primary" />
                            ) : (
                              <FileText className="w-5 h-5 text-primary" />
                            )}
                            <div>
                              <p className="font-medium">{file.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile(index)}
                            type="button"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Any additional information about symptoms, concerns, or context..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Submit */}
                <Button 
                  variant="medical" 
                  className="w-full" 
                  disabled={isUploading || files.length === 0}
                >
                  {isUploading ? "Analyzing..." : "Upload and Analyze"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Analysis Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <p className="font-medium">Disease Risk Assessment</p>
                    <p className="text-sm text-muted-foreground">AI analyzes patterns to predict potential health risks</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <p className="font-medium">Medical Image Analysis</p>
                    <p className="text-sm text-muted-foreground">Advanced computer vision for X-rays, MRIs, and scans</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <p className="font-medium">Trend Detection</p>
                    <p className="text-sm text-muted-foreground">Identifies changes in your health metrics over time</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <p className="font-medium">Personalized Insights</p>
                    <p className="text-sm text-muted-foreground">Tailored recommendations based on your medical history</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  🔒 Your data is encrypted and HIPAA-compliant
                </p>
                <p className="text-sm text-muted-foreground">
                  👨‍⚕️ Only you and your assigned doctors can access your reports
                </p>
                <p className="text-sm text-muted-foreground">
                  🤖 AI analysis is performed securely on our protected servers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="mt-8 space-y-6">
            {/* Annotated Image */}
            {annotatedImage && (
              <Card>
                <CardHeader>
                  <CardTitle>Annotated Medical Image</CardTitle>
                  <CardDescription>
                    Your medical image with AI-detected abnormalities highlighted
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <img 
                      src={annotatedImage} 
                      alt="Annotated Medical Image" 
                      className="max-w-full h-auto border rounded-lg shadow-lg"
                      style={{ maxHeight: '600px' }}
                    />
                  </div>
                  
                  {/* Abnormalities Legend */}
                  {abnormalities && abnormalities.abnormalities && abnormalities.abnormalities.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Detected Abnormalities:</h4>
                      <div className="space-y-2">
                        {abnormalities.abnormalities.map((abnormality: any, index: number) => (
                          <div key={index} className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50">
                            <div className={`w-4 h-4 rounded mt-0.5 ${
                              abnormality.severity === 'High' ? 'bg-red-500' :
                              abnormality.severity === 'Medium' ? 'bg-orange-500' :
                              'bg-yellow-500'
                            }`} />
                            <div className="flex-1">
                              <p className="font-medium">{index + 1}. {abnormality.description}</p>
                              <p className="text-sm text-gray-600">
                                Severity: <span className="font-medium">{abnormality.severity}</span> | 
                                Confidence: <span className="font-medium">{abnormality.confidence}%</span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-sm text-gray-600">
                        <p><strong>Legend:</strong></p>
                        <div className="flex gap-4 mt-1">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded"></div>
                            <span>High Severity</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-orange-500 rounded"></div>
                            <span>Medium Severity</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                            <span>Low Severity</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Analysis Text */}
            <Card>
              <CardHeader>
                <CardTitle>AI Analysis Results</CardTitle>
                <CardDescription>
                  Detailed medical analysis of your image
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div 
                    className="whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: analysisResult.replace(/\n/g, '<br/>')
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadReport;